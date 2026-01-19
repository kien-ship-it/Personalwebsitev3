import OpenAI from 'openai';
declare const MODEL = "deepseek/deepseek-r1-0528:free";
declare const REQUEST_TIMEOUT_MS = 30000;
/**
 * Get or create OpenRouter client instance
 * Uses OpenAI SDK with custom base URL for OpenRouter compatibility
 */
export declare function getOpenRouterClient(): OpenAI;
/**
 * Generate a response using DeepSeek R1 via OpenRouter
 */
export declare function generateResponse(systemPrompt: string, userMessage: string): Promise<string>;
/**
 * Build system prompt with CV context
 */
export declare function buildSystemPrompt(ownerName: string, context: string): string;
/**
 * Generate a streaming response using DeepSeek R1 via OpenRouter
 * Yields chunks as they arrive, stripping thinking tags in real-time
 */
export declare function generateStreamingResponse(systemPrompt: string, userMessage: string): AsyncGenerator<string, void, unknown>;
export { MODEL, REQUEST_TIMEOUT_MS };
