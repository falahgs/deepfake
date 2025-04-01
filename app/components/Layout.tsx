'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaMedium, FaWordpress, FaPython, FaYoutube, FaAmazon, FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaFacebook } from 'react-icons/fa';
import { SiKaggle, SiHuggingface } from 'react-icons/si';
import { BiWorld } from 'react-icons/bi';

const socialLinks = [
  { icon: FaMedium, url: 'https://medium.com/@falahgs', label: 'Medium' },
  { icon: FaWordpress, url: 'https://iraqprogrammer.wordpress.com/', label: 'WordPress' },
  { icon: FaPython, url: 'https://pypi.org/user/falahgs/', label: 'PyPI' },
  { icon: FaYoutube, url: 'https://www.youtube.com/@FalahgsGate', label: 'YouTube' },
  { icon: FaAmazon, url: 'https://www.amazon.com/stores/Falah-Gatea-Salieh/author/B0BYHXLP7R', label: 'Amazon' },
  { icon: SiHuggingface, url: 'https://huggingface.co/Falah', label: 'Hugging Face' },
  { icon: FaTwitter, url: 'https://x.com/FalahGatea', label: 'Twitter' },
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/falah-gatea-060a211a7/', label: 'LinkedIn' },
  { icon: FaGithub, url: 'https://github.com/falahgs', label: 'GitHub' },
  { icon: FaInstagram, url: 'https://www.instagram.com/falah.g.saleih/', label: 'Instagram' },
  { icon: FaFacebook, url: 'https://www.facebook.com/falahgs', label: 'Facebook' },
  { icon: SiKaggle, url: 'https://www.kaggle.com/falahgatea', label: 'Kaggle' },
  { icon: BiWorld, url: 'https://civitai.com/user/falahgs', label: 'Civitai' }
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/video-deep-detection', label: 'Deepfake Detection' },
  { href: '/about', label: 'About' },
  { href: '/profile', label: 'Profile' }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              DeepFake Detective
            </Link>
            <div className="space-x-6">
              <nav className="flex space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href ? 'bg-gray-100 dark:bg-zinc-800' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 pb-24">
        {children}
      </main>

      <footer className="bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 fixed bottom-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center mb-2">
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    title={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} Falah Gatea. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 