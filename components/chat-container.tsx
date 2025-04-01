'use client';

import { useRef, KeyboardEvent, useState } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { useChat } from "ai/react";
import { ExamplesDropdown } from "@/components/examples-dropdown";
import { BsSendFill } from 'react-icons/bs';
import { FiTrash2 } from 'react-icons/fi';
import { SocialFooter } from '@/components/social-footer';

export function ChatContainer() {
  const {
    messages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    reload,
    stop,
    setMessages
  } = useChat({
    onFinish: () => {
      // Scroll to bottom when message is complete
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const handleExampleSelect = (prompt: string) => {
    append({
      role: "user",
      content: prompt,
    });
  };

  const handleClearChat = () => {
    // Stop any ongoing responses
    stop();
    // Clear all messages
    setMessages([]);
    // Clear input
    setInput('');
    // Reset the chat state
    reload();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col">
              <div
                ref={messagesContainerRef}
                className="flex-1 flex flex-col gap-6 overflow-y-auto px-4 md:px-8 py-4"
              >
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    toolInvocations={message.toolInvocations}
                    reasoningMessages={[]}
                  />
                ))}
                {isLoading && (
                  <div className="text-sm text-gray-500 animate-pulse">
                    AI is thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t dark:border-zinc-800 p-4 sticky bottom-0 bg-white dark:bg-zinc-900">
                <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3 pr-32 outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-300"
                      placeholder={isLoading ? "AI is thinking..." : "Send a message..."}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <ExamplesDropdown onSelect={handleExampleSelect} />
                      <button
                        type="button"
                        onClick={handleClearChat}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        disabled={messages.length === 0 || isLoading}
                        title="Clear chat"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button
                        type="submit"
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                        disabled={!input.trim() || isLoading}
                      >
                        <BsSendFill className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
} 