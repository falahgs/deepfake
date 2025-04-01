import React from 'react';
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaWordpress,
  FaMedium,
  FaPython,
  FaYoutube,
  FaAmazon,
} from 'react-icons/fa';
import { SiHuggingface, SiKaggle } from 'react-icons/si';

const socialLinks = [
  { icon: FaTwitter, url: 'https://x.com/FalahGatea', label: 'Twitter' },
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/falah-gatea-060a211a7/', label: 'LinkedIn' },
  { icon: FaGithub, url: 'https://github.com/falahgs', label: 'GitHub' },
  { icon: FaInstagram, url: 'https://www.instagram.com/falah.g.saleih/', label: 'Instagram' },
  { icon: FaFacebook, url: 'https://www.facebook.com/falahgs', label: 'Facebook' },
  { icon: FaWordpress, url: 'https://iraqprogrammer.wordpress.com/', label: 'WordPress' },
  { icon: FaMedium, url: 'https://medium.com/@falahgs', label: 'Medium' },
  { icon: FaPython, url: 'https://pypi.org/user/falahgs/', label: 'PyPI' },
  { icon: FaYoutube, url: 'https://www.youtube.com/@FalahgsGate', label: 'YouTube' },
  { icon: FaAmazon, url: 'https://www.amazon.com/stores/Falah-Gatea-Salieh/author/B0BYHXLP7R', label: 'Amazon' },
  { icon: SiHuggingface, url: 'https://huggingface.co/Falah', label: 'Hugging Face' },
  { icon: SiKaggle, url: 'https://www.kaggle.com/falahgatea', label: 'Kaggle' },
];

export function SocialFooter() {
  return (
    <footer className="w-full border-t dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map(({ icon: Icon, url, label }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Falah Gatea Salieh. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 