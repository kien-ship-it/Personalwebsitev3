// api/lib/chunker.ts
// CV content chunking logic for embedding pipeline

import type { CvChunk } from './supabase.js';

// Resume data types (mirrored from src/types/resume.ts for API use)
interface Contact {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    location: string;
    linkedin: string;
    github: string;
}

interface Education {
    institution: string;
    location: string;
    degree: string;
    graduationDate: string;
    coursework: string[];
}

interface SkillItem {
    name: string;
}

interface SkillCategory {
    category: string;
    items: SkillItem[];
}

interface Certification {
    name: string;
    provider: string;
}

interface Experience {
    company: string;
    location: string;
    role: string;
    dateRange: string;
    project: string;
    techStack: string[];
    descriptions: string[];
}

interface Project {
    name: string;
    role: string;
    dateRange: string;
    tagline: string;
    techStack: string[];
    descriptions: string[];
}

interface AdditionalPosition {
    organization: string;
    location: string;
    role: string;
    dateRange: string;
    project: string;
    descriptions: string[];
}

export interface ResumeData {
    contact: Contact;
    education: Education;
    skills: SkillCategory[];
    certifications: Certification[];
    experience: Experience[];
    projects: Project[];
    additionalPositions: AdditionalPosition[];
}

/**
 * Chunk resume data into sections for embedding
 * Each chunk contains content from a logical section with metadata
 */
export function chunkResumeData(data: ResumeData): CvChunk[] {
    const chunks: CvChunk[] = [];
    let index = 0;

    // Contact/Profile chunk
    chunks.push({
        content: formatContact(data.contact),
        section: 'contact',
        metadata: { source: 'resumeData', index: index++ },
    });

    // Education chunk
    chunks.push({
        content: formatEducation(data.education),
        section: 'education',
        metadata: { source: 'resumeData', index: index++ },
    });

    // Skills chunk (all categories combined)
    chunks.push({
        content: formatSkills(data.skills),
        section: 'skills',
        metadata: { source: 'resumeData', index: index++ },
    });

    // Certifications chunk
    chunks.push({
        content: formatCertifications(data.certifications),
        section: 'certifications',
        metadata: { source: 'resumeData', index: index++ },
    });

    // Experience chunks (one per position for better retrieval)
    for (const exp of data.experience) {
        chunks.push({
            content: formatExperience(exp),
            section: 'experience',
            metadata: { source: 'resumeData', index: index++, company: exp.company },
        });
    }

    // Project chunks (one per project for better retrieval)
    for (const proj of data.projects) {
        chunks.push({
            content: formatProject(proj),
            section: 'projects',
            metadata: { source: 'resumeData', index: index++, projectName: proj.name },
        });
    }

    // Additional positions chunk
    if (data.additionalPositions && data.additionalPositions.length > 0) {
        for (const pos of data.additionalPositions) {
            chunks.push({
                content: formatAdditionalPosition(pos),
                section: 'additional_positions',
                metadata: { source: 'resumeData', index: index++, organization: pos.organization },
            });
        }
    }

    return chunks;
}

function formatContact(contact: Contact): string {
    return `Name: ${contact.name}
Tagline: ${contact.tagline}
Location: ${contact.location}
Email: ${contact.email}
Phone: ${contact.phone}
LinkedIn: ${contact.linkedin}
GitHub: ${contact.github}`;
}

function formatEducation(education: Education): string {
    return `Education: ${education.degree} at ${education.institution}
Location: ${education.location}
Expected Graduation: ${education.graduationDate}
Relevant Coursework: ${education.coursework.join(', ')}`;
}

function formatSkills(skills: SkillCategory[]): string {
    const lines = ['Skills and Technologies:'];
    for (const category of skills) {
        const items = category.items.map((item) => item.name).join(', ');
        lines.push(`${category.category}: ${items}`);
    }
    return lines.join('\n');
}

function formatCertifications(certifications: Certification[]): string {
    const lines = ['Certifications and Courses:'];
    for (const cert of certifications) {
        lines.push(`- ${cert.name} (${cert.provider})`);
    }
    return lines.join('\n');
}

function formatExperience(exp: Experience): string {
    const lines = [
        `Work Experience: ${exp.role} at ${exp.company}`,
        `Project: ${exp.project}`,
        `Location: ${exp.location}`,
        `Duration: ${exp.dateRange}`,
        `Tech Stack: ${exp.techStack.join(', ')}`,
        'Responsibilities and Achievements:',
    ];
    for (const desc of exp.descriptions) {
        lines.push(`- ${desc}`);
    }
    return lines.join('\n');
}

function formatProject(proj: Project): string {
    const lines = [
        `Project: ${proj.name}`,
        `Role: ${proj.role}`,
        `Duration: ${proj.dateRange}`,
        `Summary: ${proj.tagline}`,
        `Tech Stack: ${proj.techStack.join(', ')}`,
        'Details:',
    ];
    for (const desc of proj.descriptions) {
        lines.push(`- ${desc}`);
    }
    return lines.join('\n');
}

function formatAdditionalPosition(pos: AdditionalPosition): string {
    const lines = [
        `Additional Position: ${pos.role} at ${pos.organization}`,
        `Project: ${pos.project}`,
        `Location: ${pos.location}`,
        `Duration: ${pos.dateRange}`,
        'Details:',
    ];
    for (const desc of pos.descriptions) {
        lines.push(`- ${desc}`);
    }
    return lines.join('\n');
}

/**
 * Get all unique section names from chunks
 */
export function getSectionNames(chunks: CvChunk[]): string[] {
    return [...new Set(chunks.map((chunk) => chunk.section))];
}
