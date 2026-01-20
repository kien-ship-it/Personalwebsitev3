# Resume Vector DB Deployment

This script deploys your resume data to Supabase vector database for RAG (Retrieval-Augmented Generation) functionality.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your credentials:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (found in Project Settings > API)
- `OPENAI_API_KEY`: Your OpenAI API key (for creating embeddings)

### 3. Set Up Vector Database

Run the SQL script in `scripts/setup-vector-db.sql` in your Supabase SQL editor:

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the contents of `setup-vector-db.sql`
4. Run the script

## Usage

### Deploy Resume to Vector DB

After updating your `src/data/resumeData.ts` file, run:

```bash
npm run deploy:resume
```

The script will:

1. Read your resume data from `src/data/resumeData.ts`
2. Chunk it into semantic pieces (contact, education, skills, experience, projects, etc.)
3. Create embeddings using OpenAI's text-embedding-3-small model
4. Clear existing embeddings from the database
5. Upload the new embeddings to Supabase

## How It Works

### Chunking Strategy

The resume is divided into logical chunks:

- Contact information (1 chunk)
- Education (1 chunk)
- Skills (1 chunk per category)
- Experience (1 chunk per position)
- Projects (1 chunk per project)
- Additional positions (1 chunk per position)
- Certifications (1 chunk per certification)

### Metadata

Each chunk includes metadata for filtering:

- `type`: The category (contact, education, skills, etc.)
- Additional fields specific to each type (company, role, project name, etc.)

### Embeddings

- Model: OpenAI text-embedding-3-small (1536 dimensions)
- Indexed with ivfflat for efficient similarity search

## Querying the Vector DB

You can query the embeddings using the `match_resume_embeddings` function:

```sql
SELECT * FROM match_resume_embeddings(
  query_embedding => <your_query_embedding>,
  match_threshold => 0.5,
  match_count => 5
);
```

## Troubleshooting

### "Could not find resumeData export"

Ensure your `src/data/resumeData.ts` file exports the data as:

```typescript
export const resumeData: ResumeData = {
  // your data here
};
```

### Permission Errors

Make sure your service role key has the necessary permissions to write to the database.

### Vector Extension Not Found

Run the setup SQL script to enable the vector extension and create the necessary tables.
