// api/lib/openai.ts
// OpenAI client for generating embeddings

import OpenAI from 'openai';

// Embedding model configuration
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

// Singleton client instance
let openaiClient: OpenAI | null = null;

/**
 * Get or create OpenAI client instance
 */
export function getOpenAIClient(): OpenAI {
    if (openaiClient) {
        return openaiClient;
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY environment variable');
    }

    openaiClient = new OpenAI({ apiKey });
    return openaiClient;
}

/**
 * Generate embedding for a single text string
 * Returns a 1536-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const client = getOpenAIClient();

    const response = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
    });

    const embedding = response.data[0]?.embedding;

    if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(`Invalid embedding response: expected ${EMBEDDING_DIMENSIONS} dimensions`);
    }

    return embedding;
}

/**
 * Generate embeddings for multiple text strings
 * Returns array of 1536-dimensional vectors
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
        return [];
    }

    const client = getOpenAIClient();

    const response = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: texts,
    });

    const embeddings = response.data.map((item) => item.embedding);

    // Validate all embeddings have correct dimensions
    for (const embedding of embeddings) {
        if (embedding.length !== EMBEDDING_DIMENSIONS) {
            throw new Error(`Invalid embedding dimensions: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`);
        }
    }

    return embeddings;
}

export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
