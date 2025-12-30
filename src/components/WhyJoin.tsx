import React from 'react';

const benefits = [
  {
    title: "$100 Amp credit",
    description: "Jumpstart your builds and try agent-driven coding on ampcode.com."
  },
  {
    title: "Private Discord server",
    description: "Ask questions, share ideas, and get help fast - real builders, no noise."
  },
  {
    title: "Build challenges",
    description: "Ship small projects and demos. Learn by doing."
  },
  {
    title: "XP and badges",
    description: "Devs using Amp earn XP and unlock badges as they code."
  },
  {
    title: "Showcases and feedback",
    description: "Share demos for feedback, get featured in the weekly spotlight."
  },
  {
    title: "Templates and starters",
    description: "Agent-ready starter repos and examples to help you move fast."
  },
  {
    title: "Share Amp threads",
    description: "Publish Amp conversation threads to teach, get feedback, and document agent workflows."
  },
  {
    title: "Rewards for milestones",
    description: "Unlock perks when you hit XP and badge milestones."
  }
];

export function WhyJoin() {
  return (
    <section className="py-16 md:py-24 border-t border-neutral-900">
      <h2 className="text-3xl md:text-4xl font-serif italic mb-12 text-white">Why join</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-base">{benefit.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
