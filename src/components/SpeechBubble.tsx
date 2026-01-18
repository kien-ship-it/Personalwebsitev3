import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from './ui/utils';
import { useChatContext } from '../context/ChatContext';
import { parseMarkdown } from '../utils/markdownParser.tsx';

interface SpeechBubbleProps {
    className?: string;
    style?: React.CSSProperties;
}

export function SpeechBubble({ className, style }: SpeechBubbleProps) {
    const { aiResponse, isLoading, isVisible, resetConversation } = useChatContext();

    const showLoadingDots = isLoading && aiResponse.trim().length === 0;
    
    console.log('SpeechBubble state:', { isLoading, aiResponse, showLoadingDots });

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="speech-bubble"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                    className={cn(
                        "absolute z-20",
                        className
                    )}
                    style={style}
                >
                    {/* Speech bubble container - expands upwards with max height */}
                    <div className="relative flex flex-col justify-end">

                        {/* Main bubble */}
                        <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 text-white p-4 pr-10 rounded-xl text-sm font-light leading-relaxed font-mono max-h-[200px] overflow-y-auto scrollbar-hide min-h-[40px]">
                            {/* Close button */}
                            <button
                                onClick={resetConversation}
                                className="z-20 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                                style={{ position: 'absolute', top: '8px', right: '8px' }}
                                aria-label="Close conversation"
                            >
                                <X className="w-3 h-3 text-white/70 hover:text-white" />
                            </button>
                            {showLoadingDots ? (
                                <div className="flex items-center justify-center gap-2 h-full">
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            ) : (
                                <div>{parseMarkdown(aiResponse || "Hello! Ask me anything about my experience, skills, or projects.")}</div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
