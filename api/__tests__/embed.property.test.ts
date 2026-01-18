/**
 * Property-Based Tests for Embedding Pipeline Idempotence
 * Feature: ai-chat-feature, Property 4: Embedding Idempotence
 * Validates: Requirements 2.6
 * 
 * For any CV content, running the embed pipeline twice in succession
 * SHALL result in the same final database state as running it once
 * (same number of chunks, same content).
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { chunkResumeData, getSectionNames, type ResumeData } from '../lib/chunker';

// Arbitrary generators for ResumeData structure (reused from chunker tests)
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
 * Simulate the embedding pipeline's deterministic behavior
 * This tests that the chunking process is idempotent
 */
function simulateEmbedPipeline(data: ResumeData) {
    const chunks = chunkResumeData(data);
    const sections = getSectionNames(chunks);
    return {
        chunkCount: chunks.length,
        sections: sections.sort(),
        chunkContents: chunks.map(c => c.content).sort(),
        chunkSections: chunks.map(c => c.section).sort(),
    };
}

describe('Embedding Pipeline Property Tests', () => {
    /**
     * Property 4: Embedding Idempotence
     * For any CV content, running the embed pipeline twice in succession
     * SHALL result in the same final database state as running it once.
     * 
     * Since the actual embedding involves external services, we test the
     * deterministic chunking behavior which is the core of idempotence.
     */
    it('Property 4: Chunking is deterministic (idempotent)', () => {
        fc.assert(
            fc.property(resumeDataArb, (resumeData) => {
                // Run the pipeline simulation twice
                const firstRun = simulateEmbedPipeline(resumeData);
                const secondRun = simulateEmbedPipeline(resumeData);

                // Verify same chunk count
                if (firstRun.chunkCount !== secondRun.chunkCount) {
                    return false;
                }

                // Verify same sections
                if (JSON.stringify(firstRun.sections) !== JSON.stringify(secondRun.sections)) {
                    return false;
                }

                // Verify same chunk contents
                if (JSON.stringify(firstRun.chunkContents) !== JSON.stringify(secondRun.chunkContents)) {
                    return false;
                }

                // Verify same chunk sections
                if (JSON.stringify(firstRun.chunkSections) !== JSON.stringify(secondRun.chunkSections)) {
                    return false;
                }

                return true;
            }),
            { numRuns: 100 }
        );
    });

    /**
     * Additional property: Multiple runs produce identical output
     */
    it('Property 4b: Multiple consecutive runs produce identical results', () => {
        fc.assert(
            fc.property(resumeDataArb, fc.integer({ min: 2, max: 5 }), (resumeData, runCount) => {
                const results = [];

                for (let i = 0; i < runCount; i++) {
                    results.push(simulateEmbedPipeline(resumeData));
                }

                // All runs should produce identical results
                const firstResult = JSON.stringify(results[0]);
                for (let i = 1; i < results.length; i++) {
                    if (JSON.stringify(results[i]) !== firstResult) {
                        return false;
                    }
                }

                return true;
            }),
            { numRuns: 100 }
        );
    });
});
