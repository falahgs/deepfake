'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCode, FaMusic } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { SocialLinks } from '@/components/social-links';
import Image from 'next/image';

const skills = [
  "Deep Learning & Neural Networks",
  "Natural Language Processing",
  "Machine Learning Algorithms",
  "AI System Architecture",
  "Predictive Modeling",
  "Data Analysis & Visualization"
];

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden mb-8 animate-pulse">
            <div className="p-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 dark:bg-zinc-700 rounded-full mb-6"></div>
                <div className="h-8 bg-gray-200 dark:bg-zinc-700 w-64 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-zinc-700 w-48 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="text-center">
              {/* Profile Photo */}
              <div className="mb-6">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-zinc-700">
                  <Image
                    src="/logo.jpeg"
                    alt="Falah Gatea Salieh"
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 128px) 100vw, 128px"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Falah Gatea Salieh
              </h1>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
                AI & Machine Learning Developer
              </p>
              <div className="mt-2 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt className="mr-2" />
                <span>Iraq</span>
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} All rights reserved
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Experience Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FaCode className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Professional Background
              </h2>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              <p className="mb-4">
                Over 10 years of experience in AI and Machine Learning development.
              </p>
              <h3 className="font-semibold mb-2">Expertise:</h3>
              <ul className="space-y-2">
                {skills.map((skill) => (
                  <li key={skill} className="flex items-center">
                    <BsGraphUp className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personal Interests Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FaMusic className="text-2xl text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Interests
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Deep appreciation for classical music, relating its mathematical precision 
              and emotional depth to AI development.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Open to collaboration in AI and machine learning. Reach out via any of these platforms:
          </p>
          <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
            <SocialLinks />
          </div>
        </div>

        {/* Publications & Projects Preview */}
        <div className="mt-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Work
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <a 
              href="https://www.amazon.com/stores/Falah-Gatea-Salieh/author/B0BYHXLP7R"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">Amazon Author Page</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Check out my published books and publications
              </p>
            </a>
            <a 
              href="https://huggingface.co/Falah"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">Hugging Face Models</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Explore my AI models and contributions
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 