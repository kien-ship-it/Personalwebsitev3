import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Project {
  title: string;
  category: string;
  description: string;
  stats: string;
  size: "small" | "large" | "tall";
  year: string;
}

const projects: Project[] = [
  {
    title: "Vercel Analytics",
    category: "Developer Tools",
    description: "Real-time traffic insights for Next.js applications with zero-config setup.",
    stats: "1M+ Users",
    size: "large",
    year: "2024"
  },
  {
    title: "Mono UI",
    category: "Design System",
    description: "A comprehensive component library focused on monochromatic aesthetics.",
    stats: "12k Stars",
    size: "small",
    year: "2023"
  },
  {
    title: "Chronos",
    category: "Productivity",
    description: "AI-powered calendar management.",
    stats: "50k ARR",
    size: "small",
    year: "2024"
  },
  {
    title: "Scale AI",
    category: "Infrastructure",
    description: "Labeling infrastructure for autonomous driving data.",
    stats: "Enterprise",
    size: "tall",
    year: "2022"
  },
  {
    title: "TurboPack",
    category: "Build Tool",
    description: "Incremental bundler optimized for speed.",
    stats: "99% Faster",
    size: "small",
    year: "2023"
  }
];

export function BentoGrid() {
  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <h2 className="text-3xl md:text-4xl font-serif italic text-white">Selected Works</h2>
        <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
          A curated selection of projects focusing on developer experience and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
        {projects.map((project, i) => (
          <div 
            key={i} 
            className={`
              group relative p-8 rounded-xl border border-neutral-900 bg-[#0A0A0A] hover:bg-[#111] transition-all duration-300 flex flex-col justify-between
              ${project.size === 'large' ? 'md:col-span-2' : ''}
              ${project.size === 'tall' ? 'md:row-span-2' : ''}
            `}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-neutral-500">{project.year}</span>
                <Badge variant="outline" className="w-fit border-neutral-800 text-neutral-400 font-normal text-[10px] tracking-wider uppercase bg-transparent pointer-events-none">
                  {project.category}
                </Badge>
              </div>
              <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>

            <div className="mt-8 flex flex-col gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{project.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-[90%]">
                  {project.description}
                </p>
              </div>
              <div className="pt-5 border-t border-neutral-900/50">
                <span className="text-xs font-mono text-neutral-400">{project.stats}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
