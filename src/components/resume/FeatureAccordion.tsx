import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { cn } from '../ui/utils';

const features = [
  {
    id: '01',
    title: 'Design Systems',
    description: "Building scalable, atomic design systems that ensure consistency across every touchpoint of your product ecosystem. From tokens to components, I architect languages that speak fluently to both designers and developers.",
    image: "https://images.unsplash.com/photo-1656837891721-0acebaaf981e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwYW5kJTIwaXBob25lJTIwZGFyayUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NjcwNzc5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '02',
    title: 'Frontend Architecture',
    description: "Crafting resilient, performant frontend architectures using modern React patterns. I focus on maintainability, testing strategies, and state management that scales with your application's complexity.",
    image: "https://images.unsplash.com/photo-1674486989737-20e2031d5676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGFkJTIwcHJvJTIwbW9ja3VwJTIwZGFya3xlbnwxfHx8fDE3NjcwNzc5NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: '03',
    title: 'Interactive Experiences',
    description: "Creating immersive web experiences with WebGL and Framer Motion. I believe motion is semantic – it should guide the user, explain relationships, and delight the senses without compromising performance.",
    image: "https://images.unsplash.com/photo-1664730022901-b1ef21076535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHdhdGNoJTIwdWx0cmElMjBkYXJrfGVufDF8fHx8MTc2NzA3Nzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export function FeatureAccordion() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-24 border-t border-neutral-900 bg-transparent relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 w-full">

        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-6">
            Methodology
          </h2>
          <p className="text-neutral-500 max-w-md text-lg font-light leading-relaxed">
            A holistic approach to digital product creation, blending aesthetics with rigorous engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Left Side: Accordion */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={cn(
                  "cursor-pointer group border-b border-neutral-900 pb-6 transition-all duration-500",
                  activeFeature === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <div className="flex items-center justify-between py-2">
                  <h3 className="text-2xl md:text-3xl font-serif italic text-white group-hover:text-red-500 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-neutral-500 transition-transform duration-500",
                      activeFeature === index ? "rotate-180 text-red-500" : "rotate-0"
                    )}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {activeFeature === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-neutral-400 leading-relaxed text-base md:text-lg font-light max-w-md">
                        {feature.description}
                      </p>
                      <div className="pt-6 flex items-center gap-2 text-red-500 text-xs font-mono uppercase tracking-widest font-bold opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <span>Learn more</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Side: Image/Preview */}
          <div className="relative h-[400px] md:h-[600px] w-full bg-[#0A0A0A] border border-neutral-800 p-2 md:p-4 rounded-sm">
            <div className="relative w-full h-full overflow-hidden bg-black border border-neutral-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 1.05, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />

                  {/* Decorative Elements on top of image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-block px-3 py-1 border border-white/20 bg-black/50 backdrop-blur-md rounded-full mb-3">
                      <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{features[activeFeature].id} — FEATURE</span>
                    </div>
                    <h4 className="text-xl text-white font-medium">{features[activeFeature].title}</h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-700 -translate-x-[1px] -translate-y-[1px]"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-700 translate-x-[1px] -translate-y-[1px]"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-700 -translate-x-[1px] translate-y-[1px]"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-700 translate-x-[1px] translate-y-[1px]"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
