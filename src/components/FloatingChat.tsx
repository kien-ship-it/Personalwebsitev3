import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, Sparkles, User, ArrowUp, MessageSquare } from 'lucide-react';
import { cn } from './ui/utils';

// Mock messages
const MOCK_MESSAGES = [
  { id: 1, role: 'ai', text: "Hello. I'm the system AI. How can I help you navigate this portfolio?" },
];

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMsg = { id: Date.now(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
        const aiResponses = [
            "That's an interesting perspective. Tell me more.",
            "I've noted that in the logs.",
            "Accessing data... Here is what I found regarding your query.",
            "The design system handles that case gracefully."
        ];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: randomResponse }]);
        setIsTyping(false);
    }, 1500);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
       {/* Container to catch pointer events only on the element */}
       <div className="pointer-events-auto">
            <motion.div
                layout
                onClick={() => !isOpen && setIsOpen(true)}
                className={cn(
                    "bg-[#050505] shadow-2xl overflow-hidden relative transition-colors duration-500",
                    isOpen 
                        ? "w-[90vw] md:w-[450px] h-[500px] rounded-3xl border border-orange-600/60 shadow-[0_0_50px_rgba(234,88,12,0.15)]" 
                        : "w-[300px] md:w-[340px] h-12 rounded-full border border-neutral-800 hover:border-neutral-600 cursor-pointer"
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
                <AnimatePresence mode="popLayout">
                    {!isOpen ? (
                        <motion.div
                            key="button-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            className="absolute inset-0 flex items-center justify-between pl-5 pr-1 max-w-[340px] mx-auto"
                        >
                            {/* Input Placeholder Look */}
                            <span className="text-sm font-light text-neutral-500 group-hover:text-neutral-300 transition-colors select-none">Ask a question...</span>
                            
                            {/* Icon Button */}
                            <div className="w-10 h-10 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-neutral-400" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex flex-col h-full w-[90vw] md:w-[450px]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-900 bg-[#050505] relative z-10 shrink-0">
                                <div className="flex items-center gap-2">
                                    <motion.div 
                                        layout
                                        exit={{ opacity: 0, transition: { duration: 0.05 } }}
                                        className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                                    />
                                    <motion.span 
                                        layout
                                        exit={{ opacity: 0, transition: { duration: 0.05 } }}
                                        className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold whitespace-nowrap"
                                    >
                                        System AI_v1.0
                                    </motion.span>
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
                                        disabled={!inputValue.trim()}
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
