// src/data/resumeData.ts
// Complete resume data for Kien Le

import type { ResumeData } from '../types/resume.js';

export const resumeData: ResumeData = {
    contact: {
        name: "Kien Le",
        tagline: "Full-Stack Developer • AI Enthusiast • Builder",
        phone: "(410) 365-9686",
        email: "dle26@jh.edu",
        location: "Baltimore, Maryland",
        linkedin: "www.linkedin.com/in/duckienle",
        github: "github.com/kien-ship-it",
        cvLink: "/cv.pdf",
        profileImage: "/images/profile.jpg"
    },
    education: {
        institution: "Johns Hopkins University",
        location: "Baltimore, Maryland",
        degree: "Bachelor of Science, Computer Science",
        graduationDate: "May 2029",
        coursework: [
            "Full-Stack Javascript",
            "Data Structures",
            "Intermediate Programming",
            "Computational Reasoning",
            "Human and Machine Intelligence Alignment"
        ],
        logo: "/images/jhu-logo.png"
    },
    skills: [
        {
            category: "Languages",
            items: [
                { name: "Python", logo: "/logos/python.svg" },
                { name: "TypeScript", logo: "/logos/typescript.svg" },
                { name: "Java", logo: "/logos/java.svg" },
                { name: "C++", logo: "/logos/cplusplus.svg" },
                { name: "Dart", logo: "/logos/dart.svg" },
                { name: "HTML", logo: "/logos/html5.svg" }
            ]
        },
        {
            category: "Frontend",
            items: [
                { name: "React", logo: "/logos/react.svg" },
                { name: "Node.js", logo: "/logos/nodejs.svg" },
                { name: "Flutter", logo: "/logos/flutter.svg" }
            ]
        },
        {
            category: "Backend & Cloud",
            items: [
                { name: "AWS", logo: "/logos/aws.svg" },
                { name: "GCP", logo: "/logos/gcp.svg" },
                { name: "Firebase", logo: "/logos/firebase.svg" },
                { name: "Supabase", logo: "/logos/supabase.svg" },
                { name: "Terraform", logo: "/logos/terraform.svg" }
            ]
        },
        {
            category: "DevOps & Tools",
            items: [
                { name: "Docker", logo: "/logos/docker.svg" },
                { name: "Git", logo: "/logos/git.svg" },
                { name: "Vercel", logo: "/logos/vercel.svg" },
                { name: "Figma", logo: "/logos/figma.svg" },
                { name: "Datadog", logo: "/logos/datadog.svg" },
                { name: "Google Colab", logo: "/logos/googlecolab.svg" },
                { name: "Jupyter Notebook", logo: "/logos/jupyter.svg" }
            ]
        },
        {
            category: "Other Skills",
            items: [
                { name: "Spec-driven development" },
                { name: "IaC" },
                { name: "UI/UX" },
                { name: "Collaboration" },
                { name: "Communication" },
                { name: "Product/Project Management" },
                { name: "Prompt Engineering" },
                { name: "DevOps" },
                { name: "IoT" }
            ]
        }
    ],
    certifications: [
        {
            name: "AWS Certified AI Practitioner",
            provider: "Amazon Web Services Training and Certification",
            logo: "/images/AWS AI Practitioner Logo.png",
            issueDate: "2026"
        },
        {
            name: "Machine Learning Specialization",
            provider: "DeepLearning.AI",
            logo: "/images/DeepLearning AI Logo.png",
            issueDate: "2025"
        },
        {
            name: "6.S191 Introduction to Deep Learning",
            provider: "MIT",
            logo: "/images/MIT Logo.svg.png",
            issueDate: "2025"
        },
        {
            name: "CS230 Deep Learning",
            provider: "Stanford",
            logo: "/images/Stanford Cardinal Logo.svg.png",
            issueDate: "2025"
        },
        {
            name: "Writing in the Sciences",
            provider: "Stanford",
            logo: "/images/Stanford Cardinal Logo.svg.png",
            issueDate: "2025"
        },
        {
            name: "Practical Deep Learning",
            provider: "fast.ai",
            logo: "/images/Fast.ai Logo.png",
            issueDate: "2025"
        },
    ],
    experience: [
        {
            company: "Johns Hopkins School of Education",
            location: "Baltimore, Maryland",
            role: "Full-stack Developer (Lead)",
            dateRange: "October 2025 - Present",
            project: "Ventilator Education App",
            featured: true,
            techStack: ["Next.js", "Tailwind CSS", "PWA"],
            descriptions: [
                "Collaborated with a frontend engineer to deliver a grant-funded, gamified ventilator training PWA under a strict timeline, facilitating frictionless installation for clinicians while implementing creative engagement strategies tailored to ICU nurse psychology.",
                "Adhered to rigorous HIPAA and IRB mandates by engineering a local-first data architecture, eliminating third-party cloud dependencies; facilitated compliant research data collection via a secure manual export system, ensuring zero unauthorized data egress."
            ]
        },
        {
            company: "Johns Hopkins Sports Analytics Research Group (SARG)",
            location: "Baltimore, Maryland",
            role: "Software Engineer",
            dateRange: "September 2025 - Present",
            project: "SLUGGER",
            techStack: ["AWS ECS", "Lambda", "Docker", "Trackman API"],
            descriptions: [
                "Engineered interactive analytical tools and APIs for the Atlantic League of Professional Baseball (ALPB) under Dr. Anton Dahbura, processing Trackman data to enable flexible widget integration and strategic insights for players and coaches.",
                "Migrated legacy infrastructure to a containerized AWS ECS and Lambda architecture, establishing Docker CI/CD pipelines to optimize costs and zero-downtime releases."
            ]
        }
    ],
    projects: [
        {
            name: "LiveSolve",
            role: "Full-Stack Engineer",
            dateRange: "May 2025 - Present",
            tagline: "First of its kind AI tutor that gives visual feedback on math handwriting",
            featured: true,
            techStack: ["React", "Python", "FastAPI", "GCP", "Gemini 2.5 Pro"],
            descriptions: [
                "Created a full-stack, serverless application on Google Cloud Platform using React and Python (FastAPI) to power an interactive canvas and provide real-time, AI-driven, intuitive feedback for mathematical work.",
                "Engineered a novel multimodal AI pipeline with Gemini 2.5 Pro, bypassing OCR to visually highlight errors directly on a student's handwritten work, improving learning experience."
            ]
        },
        {
            name: "SentiCare",
            role: "Full-Stack Engineer",
            dateRange: "September 2025 - October 2025",
            tagline: "AI-Powered Wellness Monitoring System",
            techStack: ["React", "Node.js", "Cloud Functions", "Firestore", "ResNet"],
            descriptions: [
                "Architected and built a full-stack, event-driven platform to process and visualize real-time activity data from a custom-trained ResNet model for activities classification (standing, walking, falling, sitting, sleeping).",
                "Engineered an AI analysis engine using the Firebase Gemini API to translate raw activity data into actionable insights, providing caregivers with daily wellness scores and natural-language patient summaries."
            ]
        }
    ],
    additionalPositions: [
        {
            organization: "Johns Hopkins Association for Computing Machinery",
            location: "Baltimore, Maryland",
            role: "Open Source Contributor",
            dateRange: "September 2025 - Present",
            project: "PDR AI",
            descriptions: [
                "Engineered a dual-path RAG pipeline integrating Chandra OCR (current best performance) to parse scanned documents and handwriting into Markdown, optimizing vector embeddings and enabling high-fidelity math rendering to drive a 95% reduction in missing document incidents and an 80% decrease in manual review time."
            ]
        }
    ]
};
