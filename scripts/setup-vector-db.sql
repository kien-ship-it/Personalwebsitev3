-- Run this in your Supabase SQL editor to set up the vector database

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the embeddings table
CREATE TABLE IF NOT EXISTS resume_embeddings (
  id bigserial PRIMARY KEY,
  content text NOT NULL,
  metadata jsonb NOT NULL,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create an index for efficient similarity search
CREATE INDEX IF NOT EXISTS resume_embeddings_embedding_idx 
ON resume_embeddings 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create a function for similarity search
CREATE OR REPLACE FUNCTION match_resume_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE(
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql
AS $$
  SELECT
    resume_embeddings.id,
    resume_embeddings.content,
    resume_embeddings.metadata,
    1 - (resume_embeddings.embedding <=> query_embedding) AS similarity
  FROM resume_embeddings
  WHERE 1 - (resume_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Enable Row Level Security
ALTER TABLE resume_embeddings ENABLE ROW LEVEL SECURITY;

-- Create a policy for public read access (adjust as needed)
CREATE POLICY "Public embeddings are viewable by everyone."
  ON resume_embeddings FOR SELECT
  USING (true);

-- Grant necessary permissions
GRANT ALL ON resume_embeddings TO authenticated;
GRANT SELECT ON resume_embeddings TO anon;
GRANT ALL ON resume_embeddings TO service_role;
