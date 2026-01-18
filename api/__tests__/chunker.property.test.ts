/**
 * Property-Based Tests for CV Chunker
 * Feature: ai-chat-feature, Property 3: Chunking Content Preservation
 * Validates: Requirements 2.2
 * 
 * For any CV content input, chunking the content and concatenating all chunks
 * SHALL preserve all original text content (no data loss during chunking).
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { chunkResumeData, type ResumeData } from '../lib/chunker';

// Arbitrary generators for ResumeData structure
const skillItemArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
});

const skillCategoryArb = fc.record({
    category: fc.string({ minLength: 1, maxLength: 30 }),
    items: fc.array(skillItemArb, { minLength: 1, maxLength: 10 }),
});

const certificationArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }),
    provider: fc.string({ minLength: 1, maxLength: 50 }),
});

const experienceArb = fc.record({
    company: fc.string({ minLength: 1, maxLength: 100 }),
    location: fc.string({ minLength: 1, maxLength: 100 }),
    role: fc.string({ minLength: 1, maxLength: 100 }),
    dateRange: fc.string({ minLength: 1, maxLength: 50 }),
    project: fc.string({ minLength: 1, maxLength: 100 }),
    techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
    descriptions: fc.array(fc.string({ minLength: 1, maxLength: 500 }), { minLength: 1, maxLength: 5 }),
});

const projectArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }),
    role: fc.string({ minLength: 1, maxLength: 100 }),
    dateRange: fc.string({ minLength: 1, maxLength: 50 }),
    tagline: fc.string({ minLength: 1, maxLength: 200 }),
    techStack: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
    descriptions: fc.array(fc.string({ minLength: 1, maxLength: 500 }), { minLength: 1, maxLength: 5 }),
});

const additionalPositionArb = fc.record({
    organization: fc.string({ minLength: 1, maxLength: 100 }),
    location: fc.string({ minLength: 1, maxLength: 100 }),
    role: fc.string({ minLength: 1, maxLength: 100 }),
    dateRange: fc.string({ minLength: 1, maxLength: 50 }),
    project: fc.string({ minLength: 1, maxLength: 100 }),
    descriptions: fc.array(fc.string({ minLength: 1, maxLength: 500 }), { minLength: 1, maxLength: 5 }),
});

const contactArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }),
    tagline: fc.string({ minLength: 1, maxLength: 200 }),
    phone: fc.string({ minLength: 1, maxLength: 20 }),
    email: fc.emailAddress(),
    location: fc.string({ minLength: 1, maxLength: 100 }),
    linkedin: fc.string({ minLength: 1, maxLength: 100 }),
    github: fc.string({ minLength: 1, maxLength: 100 }),
});

const educationArb = fc.record({
    institution: fc.string({ minLength: 1, maxLength: 100 }),
    location: fc.string({ minLength: 1, maxLength: 100 }),
    degree: fc.string({ minLength: 1, maxLength: 100 }),
    graduationDate: fc.string({ minLength: 1, maxLength: 50 }),
    coursework: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
});

const resumeDataArb: fc.Arbitrary<ResumeData> = fc.record({
    contact: contactArb,
    education: educationArb,
    skills: fc.array(skillCategoryArb, { minLength: 1, maxLength: 5 }),
    certifications: fc.array(certificationArb, { minLength: 0, maxLength: 10 }),
    experience: fc.array(experienceArb, { minLength: 0, maxLength: 5 }),
    projects: fc.array(projectArb, { minLength: 0, maxLength: 5 }),
    additionalPositions: fc.array(additionalPositionArb, { minLength: 0, maxLength: 3 }),
});

/**
 * Extract all meaningful text content from ResumeData for comparison
 */
function extractAllContent(data: ResumeData): string[] {
    const content: string[] = [];

    // Contact
    content.push(data.contact.name);
    content.push(data.contact.tagline);
    content.push(data.contact.location);
    content.push(data.contact.email);
    content.push(data.contact.phone);
    content.push(data.contact.linkedin);
    content.push(data.contact.github);

    // Education
    content.push(data.education.institution);
    content.push(data.education.location);
    content.push(data.education.degree);
    content.push(data.education.graduationDate);
    content.push(...data.education.coursework);

    // Skills
    for (const category of data.skills) {
        content.push(category.category);
        for (const item of category.items) {
            content.push(item.name);
        }
    }

    // Certifications
    for (const cert of data.certifications) {
        content.push(cert.name);
        content.push(cert.provider);
    }

    // Experience
    for (const exp of data.experience) {
        content.push(exp.company);
        content.push(exp.location);
        content.push(exp.role);
        content.push(exp.dateRange);
        content.push(exp.project);
        content.push(...exp.techStack);
        content.push(...exp.descriptions);
    }

    // Projects
    for (const proj of data.projects) {
        content.push(proj.name);
        content.push(proj.role);
        content.push(proj.dateRange);
        content.push(proj.tagline);
        content.push(...proj.techStack);
        content.push(...proj.descriptions);
    }

    // Additional positions
    for (const pos of data.additionalPositions) {
        content.push(pos.organization);
        content.push(pos.location);
        content.push(pos.role);
        content.push(pos.dateRange);
        content.push(pos.project);
        content.push(...pos.descriptions);
    }

    return content;
}

describe('Chunker Property Tests', () => {
    /**
     * Property 3: Chunking Content Preservation
     * For any CV content input, chunking the content and concatenating all chunks
     * SHALL preserve all original text content (no data loss during chunking).
     */
    it('Property 3: All original content is preserved in chunks', () => {
        fc.assert(
            fc.property(resumeDataArb, (resumeData) => {
                // Chunk the resume data
                const chunks = chunkResumeData(resumeData);

                // Concatenate all chunk content
                const allChunkContent = chunks.map(c => c.content).join('\n');

                // Extract all meaningful content from original data
                const originalContent = extractAllContent(resumeData);

                // Verify each piece of original content appears in the chunks
                for (const content of originalContent) {
                    if (content && content.trim().length > 0) {
                        const found = allChunkContent.includes(content);
                        if (!found) {
                            return false;
                        }
                    }
                }

                return true;
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Additional property: Chunks have valid section metadata
     */
    it('Property 3b: All chunks have valid section metadata', () => {
        fc.assert(
            fc.property(resumeDataArb, (resumeData) => {
                const chunks = chunkResumeData(resumeData);

                const validSections = [
                    'contact',
                    'education',
                    'skills',
                    'certifications',
                    'experience',
                    'projects',
                    'additional_positions'
                ];

                // Every chunk must have a valid section
                for (const chunk of chunks) {
                    if (!validSections.includes(chunk.section)) {
                        return false;
                    }
                    if (!chunk.metadata || typeof chunk.metadata.index !== 'number') {
                        return false;
                    }
                }

                return true;
            }),
            { numRuns: 100 }
        );
    });
});
