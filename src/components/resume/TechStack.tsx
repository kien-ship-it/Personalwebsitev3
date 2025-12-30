import React from 'react';
import { motion } from 'motion/react';
import { Code, Database, Globe, Server, Cpu, Cloud, Terminal, Layers } from 'lucide-react';

const technologies = [
  { name: "React", icon: Code },
  { name: "TypeScript", icon: Terminal },
  { name: "Next.js", icon: Globe },
  { name: "Node.js", icon: Server },
  { name: "PostgreSQL", icon: Database },
  { name: "AWS", icon: Cloud },
  { name: "System Design", icon: Layers },
  { name: "Architecture", icon: Cpu },
];

export function TechStack() {
  return (
    <section className="py-12 border-t border-neutral-900 overflow-hidden">
      <div className="flex items-center gap-8 md:gap-12">
        <h3 className="text-white font-serif italic text-xl shrink-0 pl-6 md:pl-0">Tech Stack</h3>
        
        <div className="flex-1 overflow-hidden mask-linear-fade relative">
            {/* Gradient masks for fading edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

            <motion.div 
              className="flex gap-12 items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 20, 
                ease: "linear", 
                repeat: Infinity 
              }}
            >
              {[...technologies, ...technologies, ...technologies].map((tech, i) => (
                <div key={i} className="flex items-center gap-3 text-neutral-500 hover:text-white transition-colors cursor-default whitespace-nowrap">
                  <tech.icon className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wide">{tech.name}</span>
                </div>
              ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
}
