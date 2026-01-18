import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';

interface SpeechBubbleProps {
    text: string;
    isVisible?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function SpeechBubble({ text, isVisible = true, className, style }: SpeechBubbleProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                    className={cn(
                        "absolute z-20",
                        className
                    )}
                    style={style}
                >
                    {/* Speech bubble container */}
                    <div className="relative">

                        {/* Main bubble */}
                        <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 text-white p-4 rounded-xl text-sm font-light leading-relaxed">
                            {text}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
