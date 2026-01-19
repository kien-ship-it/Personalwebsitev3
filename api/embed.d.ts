/**
 * POST /api/embed
 * Embeds CV content into Supabase vector store
 *
 * Requirements: 2.3, 2.4, 2.5, 2.6, 2.8, 6.4
 *
 * - Requires x-embed-secret header for authentication
 * - Deletes existing embeddings before re-embedding (idempotent)
 * - Generates embeddings via OpenAI for each chunk
 * - Stores in Supabase cv_embeddings table
 * - Returns summary (chunk count, sections)
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse): Promise<void>;
