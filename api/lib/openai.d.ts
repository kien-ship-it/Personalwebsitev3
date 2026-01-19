import OpenAI from 'openai';
declare const EMBEDDING_MODEL = "text-embedding-3-small";
declare const EMBEDDING_DIMENSIONS = 1536;
/**
 * Get or create OpenAI client instance
 */
export declare function getOpenAIClient(): OpenAI;
/**
 * Generate embedding for a single text string
 * Returns a 1536-dimensional vector
 */
export declare function generateEmbedding(text: string): Promise<number[]>;
/**
 * Generate embeddings for multiple text strings
 * Returns array of 1536-dimensional vectors
 */
export declare function generateEmbeddings(texts: string[]): Promise<number[][]>;
export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
