// src/types/resume.ts
// Type definitions for resume data structure

export interface Contact {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    location: string;
    linkedin: string;
    github: string;
    cvLink?: string;
    profileImage: string;
}

export interface Education {
    institution: string;
    location: string;
    degree: string;
    graduationDate: string;
    coursework: string[];
    logo: string;
}

export interface SkillItem {
    name: string;
    logo?: string;
}

export interface SkillCategory {
    category: string;
    items: SkillItem[];
}

export interface Certification {
    name: string;
    provider: string;
    logo: string;
    date?: string;
    issueDate?: string;
}

export interface Experience {
    company: string;
    location: string;
    role: string;
    dateRange: string;
    project: string;
    featured?: boolean;
    techStack: string[];
    descriptions: string[];
}

export interface Project {
    name: string;
    role: string;
    dateRange: string;
    tagline: string;
    featured?: boolean;
    techStack: string[];
    descriptions: string[];
}

export interface AdditionalPosition {
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