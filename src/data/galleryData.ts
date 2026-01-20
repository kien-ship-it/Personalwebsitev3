// src/data/galleryData.ts
// Manual gallery data input for Visual Gallery
// Customize your gallery items here with text and images

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  year: string;
  techStack: string[];
  featured?: boolean;
  link?: string; // Optional: URL for project/demo
  videoUrl?: string; // Optional: URL for video (e.g., GitHub assets)
}

export const galleryData: GalleryItem[] = [
  {
    id: "1",
    title: "LiveSolve",
    category: "Full-Stack Engineer",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    videoUrl: "https://github.com/user-attachments/assets/d4686b93-8bfa-46a4-870c-f9c41085e8e4",
    description: "First of its kind AI tutor that gives visual feedback on math handwriting",
    year: "2025",
    techStack: ["React", "Python", "FastAPI", "GCP", "Gemini 2.5 Pro"],
    featured: true,
    link: "https://github.com/kien-ship-it/livesolve"
  },
  {
    id: "2",
    title: "Slugger Analytics",
    category: "Full-Stack Engineer",
    image: "/images/SluggerVisualisation.png",
    description: "Migrated legacy infrastructure to AWS ECS/Lambda PaaS with Docker CI/CD.",
    year: "2025",
    techStack: ["Ci/Cd", "Docker", "AWS ECS", "Lambda", "Terraform"],
    featured: false,
    link: "https://github.com/slugger-analytics/slugger-website"
  },
  {
    id: "3",
    title: "SentiCare",
    category: "Full-Stack Engineer",
    image: "/images/My Movie GIF from Adobe Express.gif",
    description: "AI-Powered Wellness Monitoring System with Real-Time Firebase Integration and Edge-Deployed ResNet",
    year: "2025",
    techStack: ["React", "Node.js", "Cloud Functions", "Firestore", "ResNet"],
    featured: false,
    link: "https://github.com/kien-ship-it/SentiCare"
  },
    {
    id: "4",
    title: "Kien's English App",
    category: "Full-Stack Engineer",
    image: "/images/KEAVisualisation.gif",
    description: "Langauge learning app with Firebase and Gemini API for AI-generated vocabulary stories",
    year: "2024",
    techStack: ["Flutter", "Dart", "Firebase", "Gemini API", "Dictionary API", "TTS"],
    featured: false,
    link: "https://github.com/kien-ship-it/Kien-s_english_app"
  },
];
