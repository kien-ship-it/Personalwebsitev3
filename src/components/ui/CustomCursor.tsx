import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  // Use MotionValues to track position directly (bypassing React render cycle)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Very fast spring configuration for minimal latency while keeping smoothness
  const springConfig = { damping: 20, stiffness: 800, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      // Direct update to motion value - extremely fast
      // Subtract 5 to center the 10px dot
      cursorX.set(e.clientX - 5);
      cursorY.set(e.clientY - 5);
      
      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const isClickable = 
        computedStyle.cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null;
        
      setIsPointer(!!isClickable);
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <>
      <style>{`
        body, a, button, input, textarea, select {
          cursor: none !important;
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          scale: { duration: 0.1 }
        }}
      />
    </>
  );
}
