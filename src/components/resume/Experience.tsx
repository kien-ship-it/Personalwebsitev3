import React from 'react';

const experiences = [
  {
    company: "Vercel",
    role: "Senior Design Engineer",
    period: "2023 — Present",
    description: "Leading the design system team and shipping core platform features.",
    tags: ["Next.js", "React", "Design Systems"]
  },
  {
    company: "Linear",
    role: "Product Engineer",
    period: "2021 — 2023",
    description: "Built the real-time sync engine and the new issue triage interface.",
    tags: ["Electron", "Sync", "Performance"]
  },
  {
    company: "Stripe",
    role: "Frontend Engineer",
    period: "2019 — 2021",
    description: "Worked on Stripe Checkout and the payment elements library.",
    tags: ["Payments", "React", "Security"]
  }
];

export function Experience() {
  return (
    <section className="py-24 border-t border-neutral-900">
      <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-16">Experience</h2>
      
      <div className="space-y-0">
        {experiences.map((exp, i) => (
          <div key={i} className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-neutral-900 last:border-0 hover:bg-[#0A0A0A] transition-colors -mx-4 px-4 rounded-lg">
            
            <div className="md:col-span-3">
              <span className="text-neutral-500 font-mono text-xs">{exp.period}</span>
            </div>
            
            <div className="md:col-span-5 flex flex-col gap-2">
              <h3 className="text-white font-bold text-lg group-hover:text-red-500 transition-colors">{exp.company}</h3>
              <p className="text-neutral-300 text-sm font-medium">{exp.role}</p>
            </div>
            
            <div className="md:col-span-4 flex flex-col gap-3 justify-between">
              <p className="text-neutral-500 text-sm leading-relaxed">
                {exp.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {exp.tags.map(tag => (
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
