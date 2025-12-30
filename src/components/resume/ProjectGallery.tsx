import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const projects = [
  {
    id: 1,
    title: "Lumina Interface",
    category: "Design System",
    image: "https://images.unsplash.com/photo-1736325263301-488931888151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "A comprehensive design system built for high-scale enterprise applications with focus on accessibility.",
    year: "2024"
  },
  {
    id: 2,
    title: "Neon Architect",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1595409300508-fa0e6fa98692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "3D visualization tool for urban planning in cyberpunk aesthetic environments using WebGL.",
    year: "2023"
  },
  {
    id: 3,
    title: "Mono Forms",
    category: "Typography",
    image: "https://images.unsplash.com/photo-1758229297003-5932ad49e4ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Experimental typography project exploring the intersection of geometric shapes and legibility.",
    year: "2023"
  },
  {
    id: 4,
    title: "Aether Lens",
    category: "Photography Portfolio",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000",
    description: "Minimalist portfolio template for photographers focusing on visual storytelling.",
    year: "2022"
  }
];

export function ProjectGallery() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
            <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-2">Visual Gallery</h2>
            <p className="text-neutral-500 max-w-sm">
                A curation of digital products, experiments, and visual explorations.
            </p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => scroll('left')}
                className="rounded-full border-neutral-800 bg-black hover:bg-neutral-900 text-white hover:text-white"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => scroll('right')}
                className="rounded-full border-neutral-800 bg-black hover:bg-neutral-900 text-white hover:text-white"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* Gallery Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project) => (
            <motion.div 
                key={project.id}
                className="min-w-[300px] md:min-w-[400px] snap-start group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                {/* Image Card */}
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 mb-6 relative">
                    <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-white/10 hover:bg-black/70">
                            {project.year}
                        </Badge>
                    </div>

                    {/* Action Button Overlay */}
                    <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button size="icon" className="rounded-full bg-white text-black hover:bg-neutral-200">
                            <ArrowUpRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-xl font-medium text-white group-hover:text-red-500 transition-colors">
                            {project.title}
                        </h3>
                        <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                            {project.category}
                        </span>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed border-l border-neutral-800 pl-3">
                        {project.description}
                    </p>
                </div>
            </motion.div>
        ))}
        
        {/* Spacer for right padding scroll */}
        <div className="min-w-[1px] w-[1px]" />
      </div>
    </section>
  );
}
