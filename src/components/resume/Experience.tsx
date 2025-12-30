import React from 'react';
import { resumeData } from '../../data/resumeData';

export function Experience() {
  const { experience } = resumeData;

  return (
    <section className="py-24 border-t border-neutral-900">
      <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-16">Experience</h2>

      <div className="space-y-0">
        {experience.map((exp, i) => (
          <div key={i} className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-neutral-900 last:border-0 hover:bg-[#0A0A0A] transition-colors -mx-4 px-4 rounded-lg">

            <div className="md:col-span-3">
              <span className="text-neutral-500 font-mono text-xs">{exp.dateRange}</span>
            </div>

            <div className="md:col-span-5 flex flex-col gap-2">
              <h3 className="text-white font-bold text-lg group-hover:text-red-500 transition-colors">{exp.company}</h3>
              <p className="text-neutral-300 text-sm font-medium">{exp.role}</p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3 justify-between">
              <p className="text-neutral-500 text-sm leading-relaxed">
                {exp.descriptions[0]}
              </p>
              <div className="flex gap-2 flex-wrap">
                {exp.techStack.map(tag => (
                  <span key={tag} className="text-[10px] text-neutral-600 bg-neutral-900/50 px-2 py-1 rounded border border-neutral-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
