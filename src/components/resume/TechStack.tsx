import React from 'react';
import { motion } from 'motion/react';
import { resumeData } from '../../data/resumeData';

// Get tech stack skills (Languages, Frontend, Backend & Cloud)
const techStackSkills = resumeData.skills
  .filter(category => ['Languages', 'Frontend', 'Backend & Cloud'].includes(category.category))
  .flatMap(category => category.items);

// Get tools (DevOps & Tools category)
const toolsSkills = resumeData.skills
  .filter(category => category.category === 'DevOps & Tools')
  .flatMap(category => category.items);

// Marquee component for seamless looping
function Marquee({ items, direction = 'left' }: { items: typeof techStackSkills; direction?: 'left' | 'right' }) {
  return (
    <div className="flex">
      {[0, 1].map((setIndex) => (
        <motion.div
          key={setIndex}
          className="flex gap-12 items-center shrink-0"
          animate={{ x: direction === 'left' ? [0, '-100%'] : ['-100%', 0] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
          style={{ paddingRight: '3rem' }}
        >
          {items.map((skill, i) => (
            <div key={i} className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-colors cursor-default whitespace-nowrap">
              {skill.logo ? (
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="w-5 h-5"
                />
              ) : null}
              <span className="text-sm font-medium tracking-wide">{skill.name}</span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export function TechStack() {
  return (
    <>
      {/* Tech Stack Section */}
      <section className="py-12 border-t border-neutral-900 overflow-hidden">
        <div className="flex items-center gap-8 md:gap-12">
          <h3 className="text-white font-serif italic text-xl shrink-0 pl-6 md:pl-0">Tech Stack</h3>

          <div className="flex-1 overflow-hidden relative">
            {/* Gradient masks for fading edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

            <Marquee items={techStackSkills} direction="left" />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12 border-t border-neutral-900 overflow-hidden">
        <div className="flex items-center gap-8 md:gap-12">
          <div className="flex-1 overflow-hidden relative">
            {/* Gradient masks for fading edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

            <Marquee items={toolsSkills} direction="right" />
          </div>

          <h3 className="text-white font-serif italic text-xl shrink-0 pr-6 md:pr-0">Tools</h3>
        </div>
      </section>
    </>
  );
}
