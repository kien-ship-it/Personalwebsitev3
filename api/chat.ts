/**
 * POST /api/chat
 * RAG-powered chat endpoint for CV questions
 * 
 * Requirements: 3.1-3.7, 6.1-6.3, 6.5, 7.1-7.6, 8.1-8.2
 * 
 * - Validates message field exists and is non-empty
 * - Implements IP-based rate limiting (10 req/min)
 * - Sanitizes user input
 * - Generates embedding for user question via OpenAI
 * - Queries match_cv_embeddings for top 5 relevant chunks
 * - Constructs system prompt with context and question
 * - Calls DeepSeek R1 via OpenRouter
 * - Returns JSON response with answer
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateEmbedding } from './lib/openai';
import { matchCvEmbeddings, type MatchResult } from './lib/supabase';
import { generateResponse, generateStreamingResponse, buildSystemPrompt } from './lib/openrouter';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

// In-memory rate limit store (per IP)
// Note: In production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Owner name for system prompt (from CV data)
const OWNER_NAME = 'Kien Le';

// Top-K retrieval limit
const TOP_K_CHUNKS = 5;

interface ChatRequest {
    message: string;
    stream?: boolean;
}

interface ChatResponse {
    answer: string;
    error?: string;
}

interface ErrorResponse {
    error: string;
    code?: string;
}

/**
 * Get client IP from request headers
 */
function getClientIP(req: VercelRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    if (Array.isArray(forwarded)) {
        return forwarded[0];
    }
    return req.socket?.remoteAddress || 'unknown';
}

/**
 * Check and update rate limit for an IP
 * Returns true if request is allowed, false if rate limited
 */
function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        // New window or expired window
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS,
        });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    record.count++;
    return true;
}

/**
 * Validate that message exists and is non-empty
 * Returns sanitized message or null if invalid
 */
export function validateMessage(message: unknown): string | null {
    if (typeof message !== 'string') {
        return null;
    }

    // Trim whitespace
    const trimmed = message.trim();

    // Check if empty or whitespace-only
    if (trimmed.length === 0) {
        return null;
    }

    return trimmed;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
    // Remove control characters except newlines and tabs
    let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Limit length to prevent abuse
    const MAX_LENGTH = 2000;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
}

/**
 * Build context string from matched CV chunks
 */
function buildContext(chunks: MatchResult[]): string {
    if (chunks.length === 0) {
        return 'No relevant information found in the CV.';
    }

    return chunks
        .map((chunk) => `[${chunk.section.toUpperCase()}]\n${chunk.content}`)
        .join('\n\n---\n\n');
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' } as ErrorResponse);
        return;
    }

    // Rate limiting (Requirement 6.2, 6.3)
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
        console.info(`Rate limit exceeded for IP: ${clientIP}`);
        res.status(429).json({
            error: 'Too many requests. Please wait a moment.',
            code: 'RATE_LIMITED',
        } as ErrorResponse);
        return;
    }

    // Parse request body
    const body = req.body as ChatRequest;

    // Validate message field (Requirement 3.7, 6.1)
    const validatedMessage = validateMessage(body?.message);
    if (validatedMessage === null) {
        console.warn('Invalid message received');
        res.status(400).json({ error: 'Please enter a message' } as ErrorResponse);
        return;
    }

    // Sanitize input (Requirement 6.5)
    const sanitizedMessage = sanitizeInput(validatedMessage);

    try {
        // Step 1: Generate embedding for user question (Requirement 3.2)
        let questionEmbedding: number[];
        try {
            questionEmbedding = await generateEmbedding(sanitizedMessage);
        } catch (error) {
            // Requirement 7.2: Handle OpenAI API failures
            console.error('OpenAI embedding failed:', error);
            res.status(503).json({
                error: 'Service temporarily unavailable. Please try again.',
                code: 'SERVICE_UNAVAILABLE',
            } as ErrorResponse);
            return;
        }

        // Step 2: Query for relevant CV chunks (Requirement 3.3, 8.1)
        let matchedChunks: MatchResult[];
        try {
            matchedChunks = await matchCvEmbeddings(questionEmbedding, TOP_K_CHUNKS);
        } catch (error) {
            // Requirement 7.3: Handle Supabase connection failures
            console.error('Supabase query failed:', error);
            res.status(503).json({
                error: 'Service temporarily unavailable. Please try again.',
                code: 'SERVICE_UNAVAILABLE',
            } as ErrorResponse);
            return;
        }

        // Step 3: Build context from chunks (Requirement 3.4)
        const context = buildContext(matchedChunks);

        // Step 4: Build system prompt (Requirement 8.2)
        const systemPrompt = buildSystemPrompt(OWNER_NAME, context);

        // Step 5: Generate response via OpenRouter (Requirement 3.5, 3.6)
        const useStreaming = body?.stream === true;

        if (useStreaming) {
            // Streaming response
            try {
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');

                const generator = generateStreamingResponse(systemPrompt, sanitizedMessage);

                for await (const chunk of generator) {
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                }

                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                res.end();
            } catch (error) {
                console.error('OpenRouter streaming failed:', error);
                res.write(`data: ${JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' })}\n\n`);
                res.end();
            }
            return;
        }

        // Non-streaming response
        let answer: string;
        try {
            answer = await generateResponse(systemPrompt, sanitizedMessage);
        } catch (error) {
            // Requirement 7.1: Handle OpenRouter API failures
            console.error('OpenRouter generation failed:', error);
            res.status(503).json({
                error: 'Service temporarily unavailable. Please try again.',
                code: 'SERVICE_UNAVAILABLE',
            } as ErrorResponse);
            return;
        }

        // Step 6: Return response (Requirement 3.6)
        const response: ChatResponse = { answer };
        res.status(200).json(response);

    } catch (error) {
        // Requirement 7.5: Log error details
        console.error('Chat API error:', error);

        // Return generic error without exposing details (Requirement 7.6)
        res.status(500).json({
            error: 'Something went wrong. Please try again.',
        } as ErrorResponse);
    }
}
