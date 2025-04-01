'use client';

import { useState, useRef, useEffect } from 'react';
import { FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const examples = [
  "How many 'r's are in the word strawberry?",
  "If a train travels 120 km in 2 hours, what is its average speed?",
  "If all A are B, and some B are C, what can we conclude about A and C?",
  "Explain how photosynthesis works, step by step.",
  "How does React's virtual DOM work?",
  "Explain the concept of closures in JavaScript"
];

interface ExamplesDropdownProps {
  onSelect: (prompt: string) => void;
}

export function ExamplesDropdown({ onSelect }: ExamplesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
      >
        <FiHelpCircle className="w-5 h-5" />
        <span className="hidden md:inline text-sm">Examples</span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              className="fixed md:absolute bottom-0 md:bottom-full left-0 md:left-1/2 right-0 md:-translate-x-1/2 md:mb-2 
                w-full md:w-80 bg-white dark:bg-zinc-800 rounded-t-xl md:rounded-lg shadow-lg 
                border dark:border-zinc-700 overflow-hidden z-50"
            >
              <div className="p-4 md:p-3">
                <div className="md:hidden w-12 h-1 bg-gray-300 dark:bg-zinc-600 rounded-full mx-auto mb-4" />
                
                <div className="text-center md:text-left mb-3">
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    Try these examples
                  </h3>
                </div>

                <div className="flex flex-col gap-2 max-h-[60vh] md:max-h-[400px] overflow-y-auto px-1">
                  {examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onSelect(example);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-zinc-700 
                        rounded-md text-sm transition-colors break-words
                        text-gray-700 dark:text-gray-200"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 