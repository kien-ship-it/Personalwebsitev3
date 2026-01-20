#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local (fallback to .env)
config({ path: join(__dirname, '../.env.local') });
if (!process.env.SUPABASE_URL) {
  config({ path: join(__dirname, '../.env') });
}

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
  console.error('Missing required environment variables:');
  console.error('- SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('- OPENAI_API_KEY');
  process.exit(1);
}

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

// Interface for resume data
interface ResumeData {
  contact: any;
  education: any;
  skills: any[];
  certifications: any[];
  experience: any[];
  projects: any[];
  additionalPositions: any[];
}

// Chunk interface matching cv_embeddings table schema
interface CvChunk {
  content: string;
  section: string;
  metadata: Record<string, any>;
}

// Chunk the resume data into semantic pieces
function chunkResumeData(resumeData: ResumeData): CvChunk[] {
  const chunks: CvChunk[] = [];

  // Contact info chunk
  chunks.push({
    content: `Name: ${resumeData.contact.name}\nTagline: ${resumeData.contact.tagline}\nEmail: ${resumeData.contact.email}\nPhone: ${resumeData.contact.phone}\nLocation: ${resumeData.contact.location}\nLinkedIn: ${resumeData.contact.linkedin}\nGitHub: ${resumeData.contact.github}`,
    section: 'contact',
    metadata: { source: 'resumeData.ts', index: 0 }
  });

  // Education chunk
  chunks.push({
    content: `Education: ${resumeData.education.degree} from ${resumeData.education.institution} in ${resumeData.education.location}, graduating ${resumeData.education.graduationDate}. Coursework includes: ${resumeData.education.coursework.join(', ')}.`,
    section: 'education',
    metadata: { institution: resumeData.education.institution, degree: resumeData.education.degree, source: 'resumeData.ts' }
  });

  // Skills chunks by category
  resumeData.skills.forEach((skillCategory, index) => {
    const skillNames = skillCategory.items.map((item: any) => item.name).join(', ');
    chunks.push({
      content: `${skillCategory.category} skills: ${skillNames}`,
      section: 'skills',
      metadata: { category: skillCategory.category, skills: skillCategory.items.map((item: any) => item.name), index, source: 'resumeData.ts' }
    });
  });

  // Experience chunks
  resumeData.experience.forEach((exp, index) => {
    const content = `Experience at ${exp.company} in ${exp.location} as ${exp.role} (${exp.dateRange}). Project: ${exp.project}. Tech Stack: ${exp.techStack.join(', ')}. Description: ${exp.descriptions.join(' ')}`;
    chunks.push({
      content,
      section: 'experience',
      metadata: { company: exp.company, role: exp.role, dateRange: exp.dateRange, project: exp.project, featured: exp.featured, index, source: 'resumeData.ts' }
    });
  });

  // Project chunks
  resumeData.projects.forEach((project, index) => {
    const content = `Project: ${project.name}. Role: ${project.role} (${project.dateRange}). ${project.tagline}. Tech Stack: ${project.techStack.join(', ')}. Description: ${project.descriptions.join(' ')}`;
    chunks.push({
      content,
      section: 'projects',
      metadata: { name: project.name, role: project.role, dateRange: project.dateRange, featured: project.featured, index, source: 'resumeData.ts' }
    });
  });

  // Additional positions
  resumeData.additionalPositions.forEach((position, index) => {
    const content = `Additional Position: ${position.role} at ${position.organization} in ${position.location} (${position.dateRange}). Project: ${position.project}. Description: ${position.descriptions.join(' ')}`;
    chunks.push({
      content,
      section: 'additional_positions',
      metadata: { organization: position.organization, role: position.role, dateRange: position.dateRange, index, source: 'resumeData.ts' }
    });
  });

  // Certifications
  resumeData.certifications.forEach((cert, index) => {
    const content = `Certification: ${cert.name} from ${cert.provider} (${cert.issueDate})`;
    chunks.push({
      content,
      section: 'certifications',
      metadata: { name: cert.name, provider: cert.provider, issueDate: cert.issueDate, index, source: 'resumeData.ts' }
    });
  });

  return chunks;
}

// Create embeddings for chunks
async function createEmbeddings(chunks: CvChunk[]) {
  console.log(`Creating embeddings for ${chunks.length} chunks...`);
  
  const embeddings = await Promise.all(
    chunks.map(async (chunk, index) => {
      try {
        const response = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk.content,
        });
        
        return {
          content: chunk.content,
          section: chunk.section,
          metadata: chunk.metadata,
          embedding: response.data[0].embedding,
        };
      } catch (error) {
        console.error(`Error creating embedding for chunk ${index}:`, error);
        throw error;
      }
    })
  );

  return embeddings;
}

// Initialize the vector table in Supabase
async function initializeVectorTable() {
  console.log('Checking vector table...');
  
  // The table already exists as 'cv_embeddings'
  console.log('Using existing cv_embeddings table');
}

// Clear existing embeddings
async function clearExistingEmbeddings() {
  console.log('Clearing existing resume embeddings...');
  
  // Delete all records from cv_embeddings
  const { error } = await supabase
    .from('cv_embeddings')
    .delete()
    .gte('id', '00000000-0000-0000-0000-000000000000'); // Delete all UUIDs
  
  if (error) {
    // Try alternative approach if the above doesn't work
    console.log('Trying alternative delete approach...');
    const { error: error2 } = await supabase
      .from('cv_embeddings')
      .delete()
      .not('id', 'is', null);
    
    if (error2) {
      console.error('Error clearing embeddings:', error2);
      throw error2;
    }
  }
  
  console.log('Cleared existing embeddings');
}

// Upload embeddings to Supabase
async function uploadEmbeddings(embeddings: Array<{
  content: string;
  section: string;
  metadata: Record<string, any>;
  embedding: number[];
}>) {
  console.log(`Uploading ${embeddings.length} embeddings to Supabase...`);
  
  const rows = embeddings.map((emb) => ({
    content: emb.content,
    section: emb.section,
    metadata: emb.metadata,
    embedding: emb.embedding,
  }));

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase
      .from('cv_embeddings')
      .insert(batch);
    
    if (error) {
      console.error(`Error uploading batch ${i / batchSize + 1}:`, error);
      throw error;
    }
    
    console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(rows.length / batchSize)}`);
  }
  
  console.log('All embeddings uploaded successfully!');
}

// Main function
async function main() {
  console.log('🚀 Starting resume deployment to Supabase Vector DB...\n');
  
  try {
    // Read and parse resume data
    const resumePath = join(__dirname, '../src/data/resumeData.ts');
    console.log(`Reading resume data from: ${resumePath}`);
    
    const resumeContent = readFileSync(resumePath, 'utf-8');
    
    // Extract the resumeData object from the file
    const exportMatch = resumeContent.match(/export const resumeData: ResumeData = ({[\s\S]*});/);
    if (!exportMatch) {
      throw new Error('Could not find resumeData export in the file');
    }
    
    // Use eval to parse the object (in production, you'd want a proper parser)
    // For now, we'll use a simple approach
    const resumeData: ResumeData = eval(`(${exportMatch[1]})`);
    
    console.log('✅ Resume data loaded successfully\n');
    
    // Initialize vector table
    await initializeVectorTable();
    
    // Chunk the data
    const chunks = chunkResumeData(resumeData);
    console.log(`✅ Created ${chunks.length} chunks\n`);
    
    // Create embeddings
    const embeddings = await createEmbeddings(chunks);
    console.log('✅ Embeddings created successfully\n');
    
    // Clear existing data
    await clearExistingEmbeddings();
    
    // Upload to Supabase
    await uploadEmbeddings(embeddings);
    
    console.log('\n🎉 Resume deployed to Supabase Vector DB successfully!');
    console.log(`\nTotal chunks: ${embeddings.length}`);
    console.log('You can now use this data for RAG queries.');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
