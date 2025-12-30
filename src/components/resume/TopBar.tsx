import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function TopBar() {
  
  const handleConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    // Launch confetti from the left and right edges
    const frame = () => {
      // Launch from left
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899']
      });
      
      // Launch from right
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-end pointer-events-none">
      <button 
        onClick={handleConfetti}
        className="pointer-events-auto bg-[#0A0A0A]/90 backdrop-blur-md border border-neutral-800 hover:border-neutral-600 text-white px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-3 shadow-lg group"
      >
        <span className="text-neutral-400 group-hover:text-white transition-colors">Press for</span>
        <span className="flex font-bold">
          <span className="text-red-500 group-hover:-translate-y-0.5 transition-transform duration-300 delay-[0ms]">V</span>
          <span className="text-orange-500 group-hover:-translate-y-0.5 transition-transform duration-300 delay-[50ms]">i</span>
          <span className="text-yellow-500 group-hover:-translate-y-0.5 transition-transform duration-300 delay-[100ms]">b</span>
          <span className="text-green-500 group-hover:-translate-y-0.5 transition-transform duration-300 delay-[150ms]">e</span>
          <span className="text-blue-500 group-hover:-translate-y-0.5 transition-transform duration-300 delay-[200ms]">s</span>
        </span>
      </button>
    </div>
  );
}
