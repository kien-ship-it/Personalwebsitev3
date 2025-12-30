import React from 'react';
import { Layers, Zap, Layout, Smartphone } from 'lucide-react';

const services = [
  {
    icon: <Layout className="w-5 h-5" />,
    title: "Product Design",
    description: "End-to-end product design from discovery to final polish. Focusing on user-centric interfaces and design systems."
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Frontend Engineering",
    description: "Building performant, accessible, and scalable web applications using React, Next.js, and modern CSS."
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Design Systems",
    description: "Creating comprehensive design systems that bridge the gap between design and engineering teams."
  },
  {
    icon: <Smartphone className="w-5 h-5" />,
    title: "Interaction Design",
    description: "Crafting delightful micro-interactions and animations that enhance the user experience without sacrificing performance."
  }
];

export function Services() {
  return (
    <section className="py-24 border-t border-neutral-900">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6">Expertise</h2>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
            I bridge the gap between design and engineering, helping teams ship better products faster.
          </p>
        </div>
        
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="space-y-4 group">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:border-neutral-700 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg font-medium text-white group-hover:text-red-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed border-l border-neutral-900 pl-4 group-hover:border-red-500/50 transition-colors">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
