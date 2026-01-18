// api/lib/openrouter.ts
// OpenRouter client for LLM response generation using DeepSeek R1

import OpenAI from 'openai';

// Model configuration
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'deepseek/deepseek-r1-0528:free';
const REQUEST_TIMEOUT_MS = 30000;

// Singleton client instance
let openrouterClient: OpenAI | null = null;

/**
 * Get or create OpenRouter client instance
 * Uses OpenAI SDK with custom base URL for OpenRouter compatibility
 */
export function getOpenRouterClient(): OpenAI {
    if (openrouterClient) {
        return openrouterClient;
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('Missing OPENROUTER_API_KEY environment variable');
    }

    openrouterClient = new OpenAI({
        apiKey,
        baseURL: OPENROUTER_BASE_URL,
        defaultHeaders: {
            'HTTP-Referer': process.env.SITE_URL || 'https://kienle.dev',
            'X-Title': 'Kien Le Portfolio Chat',
        },
        timeout: REQUEST_TIMEOUT_MS,
    });

    return openrouterClient;
}

/**
 * Strip thinking/reasoning tags from DeepSeek R1 response
 * DeepSeek R1 includes <think>...</think> tags with reasoning process
 * We only want the final answer for display
 */
function stripThinkingTags(content: string): string {
    // Remove <think>...</think> blocks (including multiline)
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // Also handle unclosed think tags (in case of truncation)
    cleaned = cleaned.replace(/<think>[\s\S]*/gi, '');

    // Trim whitespace
    return cleaned.trim();
}

/**
 * Generate a response using DeepSeek R1 via OpenRouter
 */
export async function generateResponse(
    systemPrompt: string,
    userMessage: string
): Promise<string> {
    const client = getOpenRouterClient();

    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error('No response content from LLM');
    }

    // Strip thinking/reasoning tags from DeepSeek R1 response
    const cleanedContent = stripThinkingTags(content);

    // If stripping removed everything, return a fallback
    if (!cleanedContent) {
        return "I'm thinking about that, but I don't have a clear answer right now. Could you rephrase your question?";
    }

    return cleanedContent;
}

/**
 * Build system prompt with CV context
 */
export function buildSystemPrompt(ownerName: string, context: string): string {
    return `You ARE ${ownerName}. You're chatting with visitors on your portfolio website.
Respond in FIRST PERSON as if you're actually Kien talking to them.

PERSONALITY & TONE:
- Casual, friendly, and approachable - like texting a friend
- Enthusiastic about tech and your projects
- Humble but confident about your skills
- Use contractions (I'm, I've, don't, etc.)
- Keep it conversational, not formal or robotic
- Feel free to use phrases like "honestly", "pretty cool", "I really enjoyed", etc.

IMPORTANT RULES:
1. Only answer based on the CV context below - don't make stuff up
2. If you can't answer from the context, just say something like "Hmm, I don't think that's in my background info" or "That's not something I've shared here"
3. Keep responses concise - no need for long essays
4. Be genuine and personable

MY BACKGROUND INFO:
${context}

Remember: You ARE Kien. Talk like you're having a casual chat with someone interested in your work.`;
}

export { MODEL, REQUEST_TIMEOUT_MS };
