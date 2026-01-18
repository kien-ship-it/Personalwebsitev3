import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
    aiResponse: string;
    setAiResponse: (response: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
    resetConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [aiResponse, setAiResponse] = useState<string>("Hello! Ask me anything about my experience, skills, or projects.");
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const resetConversation = () => {
        setAiResponse("Hello! Ask me anything about my experience, skills, or projects.");
        setIsLoading(false);
        setIsVisible(false);
    };

    return (
        <ChatContext.Provider value={{ aiResponse, setAiResponse, isLoading, setIsLoading, isVisible, setIsVisible, resetConversation }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
