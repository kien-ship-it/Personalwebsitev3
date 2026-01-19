import { SupabaseClient } from '@supabase/supabase-js';
export interface CvChunk {
    id?: string;
    content: string;
    embedding?: number[];
    section: string;
    metadata: {
        source?: string;
        index?: number;
        [key: string]: unknown;
    };
    created_at?: string;
}
export interface MatchResult {
    id: string;
    content: string;
    section: string;
    metadata: Record<string, unknown>;
    similarity: number;
}
/**
 * Get or create Supabase client instance
 */
export declare function getSupabaseClient(): SupabaseClient;
/**
 * Query match_cv_embeddings function for similarity search
 */
export declare function matchCvEmbeddings(embedding: number[], limit?: number): Promise<MatchResult[]>;
/**
 * Insert CV chunks with embeddings into the database
 */
export declare function insertEmbeddings(chunks: CvChunk[]): Promise<void>;
/**
 * Delete all existing CV embeddings
 */
export declare function deleteAllEmbeddings(): Promise<void>;
