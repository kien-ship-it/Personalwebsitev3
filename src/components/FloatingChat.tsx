import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, Sparkles, User, ArrowUp, MessageSquare } from 'lucide-react';
import { cn } from './ui/utils';

// Initial welcome message
const INITIAL_MESSAGES = [
    { id: 1, role: 'ai' as const, text: "Hello! I'm Kien's AI assistant. Ask me anything about his experience, skills, or projects." },
];

// Chat API response types
interface ChatApiResponse {
    answer?: string;
    error?: string;
    code?: string;
}

// Message type
interface ChatMessage {
    id: number;
    role: 'user' | 'ai';
    text: string;
}

type ChatState = 'closed' | 'expanded' | 'open';

export function FloatingChat() {
    const [chatState, setChatState] = useState<ChatState>('closed');
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, chatState, isTyping]);

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
     * Send message to /api/chat endpoint
     * Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 7.6
     */
    const handleSend = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        // Add user message to conversation (Requirement 5.5)
        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            text: trimmedInput
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);
        setIsLoading(true);

        try {
            // Send POST request to /api/chat (Requirement 5.1)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: trimmedInput }),
            });

            const data: ChatApiResponse = await response.json();

            if (!response.ok) {
                // Handle error responses (Requirement 5.4, 7.6)
                // Display user-friendly error without exposing technical details
                const errorMessage = data.error || 'Something went wrong. Please try again.';
                const aiErrorMessage: ChatMessage = {
                    id: Date.now() + 1,
                    role: 'ai',
                    text: errorMessage,
                };
                setMessages(prev => [...prev, aiErrorMessage]);
            } else {
                // Display AI response in conversation (Requirement 5.3)
                const aiMessage: ChatMessage = {
                    id: Date.now() + 1,
                    role: 'ai',
                    text: data.answer || 'I received your message but couldn\'t generate a response.',
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            // Handle network errors (Requirement 5.4, 7.6)
            // Do not expose technical details
            console.error('Chat request failed:', error);
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                role: 'ai',
                text: 'Unable to connect. Please check your connection and try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            setIsLoading(false);
        }
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setChatState('closed');
    };

    // Handle send from expanded state - opens full chat
    const handleExpandedSend = async () => {
        if (inputValue.trim()) {
            setChatState('open');
            // Small delay to let the UI transition before sending
            setTimeout(() => handleSend(), 100);
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
            case 'open':
                return "h-[500px] rounded-3xl border border-orange-600/60 shadow-[0_0_50px_rgba(234,88,12,0.15)]";
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
                        width: chatState === 'open' ? 450 : chatState === 'expanded' ? 400 : 340,
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
                                    onSubmit={(e) => { e.preventDefault(); handleExpandedSend(); }}
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
                                        onFocus={(e) => {
                                            console.log('Input focused!');
                                        }}
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

                        {chatState === 'open' && (
                            <motion.div
                                key="chat-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col h-full"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-900 bg-[#050505] relative z-10 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold whitespace-nowrap">
                                            System AI_v1.0
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-neutral-900 text-neutral-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#050505]" ref={scrollRef}>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={cn(
                                            "flex gap-4 max-w-[90%]",
                                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                        )}>
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border mt-1",
                                                msg.role === 'ai' ? "bg-neutral-900 border-neutral-800 text-red-500" : "bg-neutral-100 border-white text-black"
                                            )}>
                                                {msg.role === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                            </div>
                                            <div className={cn(
                                                "text-sm leading-relaxed font-light",
                                                msg.role === 'ai'
                                                    ? "text-neutral-300"
                                                    : "text-white text-right"
                                            )}>
                                                {msg.role === 'ai' ? (
                                                    <span className="font-sans">{msg.text}</span>
                                                ) : (
                                                    <span className="font-serif italic text-lg">{msg.text}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-4 max-w-[90%]">
                                            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Sparkles className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex items-center gap-1 h-8">
                                                <span className="w-1 h-1 bg-neutral-600 rounded-full animate-bounce"></span>
                                                <span className="w-1 h-1 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                <span className="w-1 h-1 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-3 m-3 mt-0 border border-neutral-800 bg-[#0A0A0A] rounded-full relative shrink-0">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                        className="relative flex items-center"
                                    >
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Type your message..."
                                            className="w-full bg-transparent border-none pl-4 pr-12 py-2 text-sm text-white focus:outline-none focus:ring-0 placeholder:text-neutral-600 font-light"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim() || isLoading}
                                            className="absolute right-1 p-2 bg-white rounded-full text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
