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
/**
 * Validate that message exists and is non-empty
 * Returns sanitized message or null if invalid
 */
export declare function validateMessage(message: unknown): string | null;
/**
 * Sanitize user input to prevent injection attacks
 */
export declare function sanitizeInput(input: string): string;
export default function handler(req: VercelRequest, res: VercelResponse): Promise<void>;
