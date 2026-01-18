// api/lib/supabase.ts
// Supabase client initialization for vector store operations

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// CV Chunk type for embedding storage
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

// Match result from similarity search
export interface MatchResult {
    id: string;
    content: string;
    section: string;
    metadata: Record<string, unknown>;
    similarity: number;
}

// Singleton client instance
let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient {
    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
    return supabaseClient;
}

/**
 * Query match_cv_embeddings function for similarity search
 */
export async function matchCvEmbeddings(
    embedding: number[],
    limit: number = 5
): Promise<MatchResult[]> {
    const client = getSupabaseClient();

    const { data, error } = await client.rpc('match_cv_embeddings', {
        query_embedding: embedding,
        match_count: limit,
    });

    if (error) {
        throw new Error(`Similarity search failed: ${error.message}`);
    }

    return data || [];
}

/**
 * Insert CV chunks with embeddings into the database
 */
export async function insertEmbeddings(chunks: CvChunk[]): Promise<void> {
    const client = getSupabaseClient();

    const { error } = await client.from('cv_embeddings').insert(
        chunks.map((chunk) => ({
            content: chunk.content,
            embedding: chunk.embedding,
            section: chunk.section,
            metadata: chunk.metadata,
        }))
    );

    if (error) {
        throw new Error(`Failed to insert embeddings: ${error.message}`);
    }
}

/**
 * Delete all existing CV embeddings
 */
export async function deleteAllEmbeddings(): Promise<void> {
    const client = getSupabaseClient();

    const { error } = await client.from('cv_embeddings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
        throw new Error(`Failed to delete embeddings: ${error.message}`);
    }
}
