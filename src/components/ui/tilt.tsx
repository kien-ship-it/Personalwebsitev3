import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  scale?: number;
  perspective?: number;
}

export function Tilt({ children, className, rotation = 15, scale = 1.05, perspective = 1000 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movements
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [rotation, -rotation]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-rotation, rotation]);
  
  // Create a sheen effect based on mouse position
  const sheenOpacity = useTransform(mouseX, (value) => Math.abs(value) > 0.01 ? 1 : 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center of element (-0.5 to 0.5)
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale }}
        className="w-full h-full"
      >
        <div 
          style={{ transform: "translateZ(20px)" }} 
          className="w-full h-full shadow-2xl rounded-xl"
        >
          {children}
        </div>
        
        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-50 rounded-xl mix-blend-overlay"
          style={{
            opacity: sheenOpacity,
            rotateX: useTransform(rotateX, (val) => val * -1), // Counter rotate sheen for realism
            rotateY: useTransform(rotateY, (val) => val * -1),
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)"
          }}
        />
      </motion.div>
    </div>
  );
}
