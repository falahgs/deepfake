'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-8">
          <Link 
            href="https://github.com/falahgata" 
            target="_blank"
            className="text-2xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            
          </Link>
          <Link 
            href="https://linkedin.com/in/falahgata" 
            target="_blank"
            className="text-2xl text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-600 transition-colors"
          >
            
          </Link>
        </div>
      </div>
    </footer>
  );
} 