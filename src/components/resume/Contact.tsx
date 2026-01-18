import React, { useState, useRef } from 'react';
import { Send, Check } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'motion/react';
import { cn } from '../ui/utils';
import { resumeData } from '../../data/resumeData';

export function Contact() {
  const [isSent, setIsSent] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 200], [1, 0]);
  const textOpacity = useTransform(x, [0, 100], [1, 0]);

  const { contact } = resumeData;

  const handleDragEnd = () => {
    if (x.get() > 200) {
      setIsSent(true);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 40 });
    }
  };

  const resetForm = () => {
    setIsSent(false);
    x.set(0);
  };

  return (
    <section className="py-24 border-t border-neutral-900 overflow-hidden min-h-[600px] flex items-center justify-center relative bg-transparent">
      <div className="max-w-5xl mx-auto w-full relative px-4">

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="contact-form"
              initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{
                scale: 0.2,
                opacity: 0,
                x: 800,
                y: -100,
                rotate: 15,
                transition: { duration: 0.8, ease: "anticipate" }
              }}
              className="bg-[#0A0A0A] border border-neutral-800 relative shadow-2xl overflow-hidden rounded-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 min-h-[500px]">

                {/* LEFT SIDE: Message Area (3/5 width) */}
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800 relative bg-[#0A0A0A]">

                  {/* Header/From Section */}
                  <div className="space-y-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest font-bold">From:</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full bg-transparent border-b border-neutral-700 text-xl py-2 focus:outline-none focus:border-white transition-colors text-white font-serif italic placeholder:text-neutral-700 font-light"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Reply-To:</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-transparent border-b border-neutral-700 text-lg py-2 focus:outline-none focus:border-white transition-colors text-neutral-300 font-mono placeholder:text-neutral-700"
                      />
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="flex-grow space-y-3">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Message:</label>
                    <textarea
                      placeholder="Write your message here..."
                      className="w-full h-full min-h-[150px] bg-transparent resize-none border-none p-4 text-white leading-relaxed focus:ring-0 placeholder:text-neutral-700 text-base md:text-lg font-serif italic"
                    />
                  </div>

                  {/* DRAGGABLE SEND FOOTER */}
                  <div className="mt-8 pt-6 border-t border-neutral-900 relative">
                    <div className="relative h-14 flex items-center bg-black/40 rounded-full px-1 border border-neutral-800/50" ref={constraintsRef}>
                      {/* Track Line */}
                      <div className="absolute inset-x-0 h-[1px] bg-transparent w-full flex items-center px-4">
                        <div className="w-full border-t border-dashed border-neutral-600/50"></div>
                      </div>

                      {/* Text Hint */}
                      <motion.span
                        style={{ opacity: textOpacity }}
                        className="absolute left-16 text-[11px] font-mono text-neutral-400 uppercase tracking-widest pointer-events-none select-none font-bold"
                      >
                        Drag plane to send transmission
                      </motion.span>

                      {/* Draggable Plane */}
                      <motion.div
                        drag="x"
                        dragConstraints={constraintsRef}
                        dragElastic={0.1}
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        className="relative z-10 cursor-grab active:cursor-grabbing touch-none"
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform border border-neutral-200">
                          <Send className="w-5 h-5 text-black translate-x-[1px] translate-y-[1px]" />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                </div>

                {/* RIGHT SIDE: Address & Stamp (2/5 width) */}
                <div className="md:col-span-2 p-8 md:p-12 relative flex flex-col items-center md:items-start bg-[#080808] border-l border-neutral-900/50">

                  {/* Stamp Area */}
                  <div className="absolute top-8 right-8 md:top-12 md:right-12">
                    <div className="w-28 h-32 bg-[#111] border-2 border-dashed border-neutral-600 flex flex-col items-center justify-center gap-2 rotate-[-2deg] shadow-xl hover:rotate-0 transition-transform duration-500 group cursor-help z-10">
                      <div className="w-20 h-20 rounded-full border border-neutral-700 flex items-center justify-center group-hover:border-red-500 transition-colors bg-black">
                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">🚀</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Priority</span>
                        <span className="text-[9px] font-bold text-neutral-500 group-hover:text-red-500 transition-colors">AIR MAIL</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-[-20px] -translate-y-1/2 w-32 h-12 opacity-40 pointer-events-none mix-blend-overlay">
                      <svg viewBox="0 0 100 40" className="w-full h-full stroke-neutral-400 fill-none stroke-1">
                        <path d="M0,10 Q25,20 50,10 T100,10" />
                        <path d="M0,20 Q25,30 50,20 T100,20" />
                        <path d="M0,30 Q25,40 50,30 T100,30" />
                      </svg>
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div className="mt-auto md:mb-12 w-full max-w-[200px] space-y-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2 block border-b border-neutral-800 pb-2 font-bold">To:</span>
                      <span className="font-serif italic text-3xl text-white tracking-wide">{contact.name}</span>
                      <span className="font-mono text-xs text-neutral-400 font-medium">Johns Hopkins University</span>
                    </div>

                    <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-400 uppercase tracking-widest leading-relaxed font-medium">
                      <span>{contact.location}</span>
                      <span>USA</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Air Mail Stripes */}
              <div className="h-4 w-full bg-[repeating-linear-gradient(45deg,#b91c1c,#b91c1c_15px,transparent_15px,transparent_30px,#1d4ed8_30px,#1d4ed8_45px,transparent_45px,transparent_60px)] opacity-40 border-t border-neutral-900"></div>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center p-12 border border-neutral-800 bg-[#0A0A0A] rounded-xl max-w-lg mx-auto shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-3xl font-serif italic text-white mb-3">Transmission Received</h3>
              <p className="text-neutral-400 text-base max-w-xs mx-auto leading-relaxed">
                Thank you for reaching out. I'll get back to you within 24-48 hours.
              </p>
              <button
                onClick={resetForm}
                className="mt-10 px-6 py-2 rounded-full border border-neutral-800 text-xs font-mono text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 uppercase tracking-widest transition-all font-bold"
              >
                Send another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
