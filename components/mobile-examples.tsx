'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface MobileExamplesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExample: (prompt: string) => void;
}

const examples = [
  "Explain how a binary search algorithm works",
  "What is the difference between var, let, and const?",
  "How does React's virtual DOM work?",
  "Explain the concept of closures in JavaScript"
];

export function MobileExamples({ isOpen, onClose, onSelectExample }: MobileExamplesProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 rounded-t-xl shadow-lg z-50 p-4 pb-20 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Example Questions</h3>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectExample(example);
                    onClose();
                  }}
                  className="text-left p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 