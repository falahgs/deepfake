'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  imageUrl: string;
}

export default function ImageSlider({ imageUrl }: ImageSliderProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  return (
    <div className="relative">
      <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', transition: 'transform 0.2s' }}>
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
          title="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
          title="Reset zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
          title="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 