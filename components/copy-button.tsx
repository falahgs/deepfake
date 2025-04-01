"use client";

import { useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';

interface CopyButtonProps {
  text: string;
  isJson?: boolean;
}

export function CopyButton({ text, isJson = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const formatText = (text: string) => {
    if (isJson) {
      try {
        const parsed = JSON.parse(text);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return text;
      }
    }

    // Format as plain text by:
    // 1. Remove any HTML tags
    // 2. Convert special characters
    // 3. Remove markdown formatting characters
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/`([^`]+)`/g, '$1')     // Remove inline code markdown
      .replace(/^#{1,6}\s/gm, '')      // Remove heading markdown
      .replace(/^\s*[-*+]\s/gm, '')    // Remove list markers
      .replace(/^\s*\d+\.\s/gm, '')    // Remove numbered list markers
      .trim();
  };

  const handleCopy = async () => {
    try {
      const formattedText = formatText(text);
      
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(formattedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = formattedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <FiCheck className="w-4 h-4 text-green-500" />
      ) : (
        <FiCopy className="w-4 h-4" />
      )}
    </button>
  );
} 