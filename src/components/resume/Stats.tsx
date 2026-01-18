import React from 'react';
import { Layers, Users, GitCommit, Coffee } from 'lucide-react';

const stats = [
  { label: "Years Experience", value: "04", icon: Layers },
  { label: "Projects Shipped", value: "10+", icon: GitCommit },
  { label: "Good Person", value: "100%", icon: Users },
  { label: "Uptime Guarantee", value: "99,99%", icon: Coffee },
];

export function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-900 border border-neutral-900 rounded-lg overflow-hidden my-16">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#050505] p-8 flex flex-col gap-4 hover:bg-[#0A0A0A] transition-colors group">
          <stat.icon className="w-5 h-5 text-neutral-600 group-hover:text-red-500 transition-colors" />
          <div>
            <div className="text-3xl font-serif italic text-white mb-1">{stat.value}</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
