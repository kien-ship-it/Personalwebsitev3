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
 * Truncate text at sentence boundary to avoid cutting off mid-sentence
 */
function truncateAtSentenceBoundary(text: string, maxWords: number): string {
    const words = text.split(' ');
    
    // If under limit, return as-is
    if (words.length <= maxWords) {
        return text;
    }
    
    // Find the last sentence ending within the word limit
    const truncatedWords = words.slice(0, maxWords);
    const truncatedText = truncatedWords.join(' ');
    
    // Look for sentence endings (. ! ?) in the truncated text
    const sentenceEndings = [...truncatedText.matchAll(/[.!?]/g)];
    
    if (sentenceEndings.length > 0) {
        // Return text up to the last complete sentence
        const lastSentenceEnd = sentenceEndings[sentenceEndings.length - 1];
        return truncatedText.substring(0, lastSentenceEnd.index! + 1).trim();
    }
    
    // If no sentence endings found, truncate at word boundary and add ellipsis
    return truncatedText.trim() + '...';
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
        max_tokens: 500,
        temperature: 1,
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

    // Truncate at sentence boundary to avoid cutting off mid-sentence
    return truncateAtSentenceBoundary(cleanedContent, 250);
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
3. Keep responses concise and natural - aim for 1-2 sentences
4. Be genuine and personable

FORMATING
- Answer in 50 words or less, ensure response contain all necessary core information (IMPORTANT)

MY BACKGROUND INFO:
${context}

Remember: You ARE Kien. Talk like you're having a casual chat with someone interested in your work.`;
}

/**
 * Generate a streaming response using DeepSeek R1 via OpenRouter
 * Yields chunks as they arrive, stripping thinking tags in real-time
 */
export async function* generateStreamingResponse(
    systemPrompt: string,
    userMessage: string
): AsyncGenerator<string, void, unknown> {
    const client = getOpenRouterClient();

    const stream = await client.chat.completions.create({
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.6,
        stream: true,
    });

    let buffer = '';
    let insideThinkTag = false;
    let wordCount = 0;
    const MAX_WORDS = 200;

    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (!content) continue;

        buffer += content;

        // Process buffer to strip thinking tags in real-time
        while (buffer.length > 0) {
            if (insideThinkTag) {
                // Look for closing </think> tag
                const closeIndex = buffer.toLowerCase().indexOf('</think>');
                if (closeIndex !== -1) {
                    // Found closing tag, skip everything up to and including it
                    buffer = buffer.substring(closeIndex + 8);
                    insideThinkTag = false;
                } else {
                    // Still inside think tag, clear buffer and wait for more
                    buffer = '';
                    break;
                }
            } else {
                // Look for opening <think> tag
                const openIndex = buffer.toLowerCase().indexOf('<think>');
                if (openIndex !== -1) {
                    // Yield content before the think tag
                    const beforeThink = buffer.substring(0, openIndex);
                    if (beforeThink) {
                        // Check word count limit
                        const words = beforeThink.split(/\s+/).filter(w => w.length > 0);
                        if (wordCount + words.length > MAX_WORDS) {
                            // Truncate and stop
                            const remainingWords = MAX_WORDS - wordCount;
                            if (remainingWords > 0) {
                                yield words.slice(0, remainingWords).join(' ');
                            }
                            return;
                        }
                        wordCount += words.length;
                        yield beforeThink;
                    }
                    buffer = buffer.substring(openIndex + 7);
                    insideThinkTag = true;
                } else if (buffer.includes('<')) {
                    // Might be start of a tag, yield content before '<' and wait
                    const lessThanIndex = buffer.indexOf('<');
                    const beforeLessThan = buffer.substring(0, lessThanIndex);
                    if (beforeLessThan) {
                        const words = beforeLessThan.split(/\s+/).filter(w => w.length > 0);
                        if (wordCount + words.length > MAX_WORDS) {
                            const remainingWords = MAX_WORDS - wordCount;
                            if (remainingWords > 0) {
                                yield words.slice(0, remainingWords).join(' ');
                            }
                            return;
                        }
                        wordCount += words.length;
                        yield beforeLessThan;
                    }
                    buffer = buffer.substring(lessThanIndex);
                    break;
                } else {
                    // No tags, yield the buffer
                    const words = buffer.split(/\s+/).filter(w => w.length > 0);
                    if (wordCount + words.length > MAX_WORDS) {
                        const remainingWords = MAX_WORDS - wordCount;
                        if (remainingWords > 0) {
                            yield words.slice(0, remainingWords).join(' ');
                        }
                        return;
                    }
                    wordCount += words.length;
                    yield buffer;
                    buffer = '';
                }
            }
        }
    }

    // Yield any remaining content
    if (buffer && !insideThinkTag) {
        yield buffer;
    }
}

export { MODEL, REQUEST_TIMEOUT_MS };
