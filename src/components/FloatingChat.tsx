import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUp } from 'lucide-react';
import { cn } from './ui/utils';
import { useChatContext } from '../context/ChatContext';

// Chat API response types
interface ChatApiResponse {
    answer?: string;
    error?: string;
    code?: string;
}

type ChatState = 'closed' | 'expanded';

export function FloatingChat() {
    const [chatState, setChatState] = useState<ChatState>('closed');
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setAiResponse, setIsLoading } = useChatContext();

    // Focus input when expanded
    useEffect(() => {
        if (chatState === 'expanded') {
            // Use multiple attempts with different timing
            const attempts = [
                { delay: 0, method: 'direct' },
                { delay: 50, method: 'timeout' },
                { delay: 100, method: 'late' },
                { delay: 200, method: 'very-late' }
            ];
            
            attempts.forEach(({ delay, method }) => {
                const timeoutId = setTimeout(() => {
                    if (inputRef.current) {
                        console.log(`Attempting focus with method: ${method}`);
                        inputRef.current.focus();
                        // Force focus by triggering a click
                        inputRef.current.click();
                    }
                }, delay);
                
                // Only clean up the last timeout
                if (delay === 200) {
                    return () => clearTimeout(timeoutId);
                }
            });
        }
    }, [chatState]);

    // Close expanded state when clicking outside
    useEffect(() => {
        if (chatState !== 'expanded') return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setChatState('closed');
                setInputValue('');
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [chatState]);

    /**
     * Send message to /api/chat endpoint with streaming and route response to SpeechBubble
     */
    const handleSend = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        setInputValue("");
        setChatState('closed');
        setIsLoading(true);
        setAiResponse('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: trimmedInput, stream: true }),
            });

            if (!response.ok) {
                const data: ChatApiResponse = await response.json();
                const errorMessage = data.error || 'Something went wrong. Please try again.';
                setAiResponse(errorMessage);
                setIsLoading(false);
                return;
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            if (!reader) {
                setAiResponse('Unable to read response stream.');
                setIsLoading(false);
                return;
            }

            const decoder = new TextDecoder();
            let accumulatedResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                const lines = text.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.chunk) {
                                accumulatedResponse += data.chunk;
                                setAiResponse(accumulatedResponse);
                                setIsLoading(false);
                            } else if (data.error) {
                                setAiResponse(data.error);
                            }
                        } catch {
                            // Ignore JSON parse errors for incomplete chunks
                        }
                    }
                }
            }

            if (!accumulatedResponse) {
                setAiResponse('I received your message but couldn\'t generate a response.');
            }
        } catch (error) {
            console.error('Chat request failed:', error);
            setAiResponse('Unable to connect. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Click outside to close expanded state
    const handleContainerClick = () => {
        if (chatState === 'closed') {
            setChatState('expanded');
        }
    };

    // Determine container dimensions based on state
    const getContainerClasses = () => {
        switch (chatState) {
            case 'closed':
                return "h-12 rounded-full border border-neutral-800 hover:border-neutral-600 cursor-pointer";
            case 'expanded':
                return "h-12 rounded-full border border-neutral-700";
        }
    };

    return (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            {/* Container to catch pointer events only on the element */}
            <div ref={containerRef} className="pointer-events-auto">
                <motion.div
                    layout
                    onClick={handleContainerClick}
                    className={cn(
                        "bg-[#050505] shadow-2xl overflow-hidden relative",
                        getContainerClasses()
                    )}
                    initial={false}
                    animate={{
                        width: chatState === 'expanded' ? 400 : 340,
                    }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                >
                    <AnimatePresence mode="wait">
                        {chatState === 'closed' && (
                            <motion.div
                                key="closed-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                className="h-full flex items-center justify-between px-1 pl-5"
                            >
                                <span className="text-sm font-light text-neutral-500 select-none">Ask a question...</span>
                                <div className="w-10 h-10 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-neutral-400" />
                                </div>
                            </motion.div>
                        )}

                        {chatState === 'expanded' && (
                            <motion.div
                                key="expanded-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                onAnimationComplete={() => {
                                    // Focus when animation is complete
                                    if (inputRef.current) {
                                        inputRef.current.focus();
                                    }
                                }}
                                className="h-full flex items-center px-1 pl-4"
                            >
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex-1 flex items-center h-full"
                                >
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                setChatState('closed');
                                                setInputValue('');
                                            }
                                        }}
                                        placeholder="Ask a question..."
                                        autoFocus
                                        className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 placeholder:text-neutral-500 font-light"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
