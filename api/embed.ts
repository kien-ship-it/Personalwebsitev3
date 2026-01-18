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
import { chunkResumeData, getSectionNames, type ResumeData } from './lib/chunker';
import { generateEmbeddings } from './lib/openai';
import { deleteAllEmbeddings, insertEmbeddings, type CvChunk } from './lib/supabase';

// Import resume data - we'll need to handle this for serverless
import { resumeData } from '../src/data/resumeData';

interface EmbedResponse {
    success: boolean;
    chunksEmbedded: number;
    sections: string[];
    error?: string;
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Validate secret key header (Requirement 6.4)
    const secretKey = req.headers['x-embed-secret'];
    const expectedSecret = process.env.EMBED_SECRET_KEY;

    if (!expectedSecret) {
        console.error('EMBED_SECRET_KEY environment variable not configured');
        res.status(500).json({ error: 'Server configuration error' });
        return;
    }

    if (!secretKey || secretKey !== expectedSecret) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        // Step 1: Chunk the resume data (Requirement 2.1, 2.2)
        const chunks = chunkResumeData(resumeData as ResumeData);
        const sections = getSectionNames(chunks);

        console.log(`Chunked CV into ${chunks.length} chunks across sections: ${sections.join(', ')}`);

        // Step 2: Delete existing embeddings for idempotence (Requirement 2.6)
        await deleteAllEmbeddings();
        console.log('Deleted existing embeddings');

        // Step 3: Generate embeddings for all chunks (Requirement 2.3)
        const texts = chunks.map(chunk => chunk.content);
        const embeddings = await generateEmbeddings(texts);

        console.log(`Generated ${embeddings.length} embeddings`);

        // Step 4: Attach embeddings to chunks
        const chunksWithEmbeddings: CvChunk[] = chunks.map((chunk, index) => ({
            ...chunk,
            embedding: embeddings[index],
        }));

        // Step 5: Store in Supabase (Requirement 2.4)
        await insertEmbeddings(chunksWithEmbeddings);

        console.log(`Stored ${chunksWithEmbeddings.length} embeddings in Supabase`);

        // Step 6: Return summary (Requirement 2.8)
        const response: EmbedResponse = {
            success: true,
            chunksEmbedded: chunksWithEmbeddings.length,
            sections,
        };

        res.status(200).json(response);
    } catch (error) {
        // Requirement 2.5: Return error response with descriptive message
        console.error('Embedding failed:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        const response: EmbedResponse = {
            success: false,
            chunksEmbedded: 0,
            sections: [],
            error: errorMessage,
        };

        res.status(500).json(response);
    }
}
