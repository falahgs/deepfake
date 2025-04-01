'use client';

import { useRef, KeyboardEvent, useState } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { useChat } from "ai/react";
import { Examples } from "@/components/examples";
import { BsSendFill } from 'react-icons/bs';
import { SocialFooter } from '@/components/social-footer';
import { FiHelpCircle } from 'react-icons/fi';
import { MobileExamples } from '@/components/mobile-examples';

export function ChatInterface() {
  const [showMobileExamples, setShowMobileExamples] = useState(false);
  const { messages, handleSubmit, input, setInput, append, isLoading } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const handleExampleSelect = (prompt: string) => {
    append({
      role: "user",
      content: prompt,
    });
    setShowMobileExamples(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row flex-1">
        <div className="hidden md:block w-64 border-r dark:border-zinc-800">
          <Examples onSelectExample={handleExampleSelect} />
        </div>

        <div className="flex-1 flex flex-col">
          {/* ... rest of your chat interface ... */}
        </div>
      </div>

      <MobileExamples
        isOpen={showMobileExamples}
        onClose={() => setShowMobileExamples(false)}
        onSelectExample={handleExampleSelect}
      />
    </div>
  );
} 