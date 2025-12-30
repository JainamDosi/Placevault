"use client";
import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = (value) => {
    setIsChatOpen(value !== undefined ? value : !isChatOpen);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, setIsChatOpen: toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
