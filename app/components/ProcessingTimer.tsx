'use client';

import { useState, useEffect, useRef } from 'react';

interface ProcessingTimerProps {
  isProcessing: boolean;
  onComplete?: (time: number) => void;
}

export default function ProcessingTimer({ isProcessing, onComplete }: ProcessingTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle timer
  useEffect(() => {
    if (!mounted) return;

    const handleTick = () => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTimeRef.current;
        setElapsedTime(elapsed);
      }
    };

    if (isProcessing) {
      // Reset states when processing starts
      setElapsedTime(0);
      setFinalTime(null);
      startTimeRef.current = Date.now();

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Start new interval
      intervalRef.current = setInterval(handleTick, 10);
    } else {
      // When processing stops
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (startTimeRef.current && elapsedTime > 0) {
        const finalElapsedTime = Date.now() - startTimeRef.current;
        setFinalTime(finalElapsedTime);
        if (onComplete) {
          onComplete(finalElapsedTime);
        }
      }

      startTimeRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isProcessing, mounted, onComplete]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  // Return null for server-side rendering and initial client render
  if (!mounted) {
    return (
      <div className="flex items-center justify-center space-x-4 bg-white rounded-xl p-6 shadow-lg opacity-0">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0">
            <div className="w-full h-full rounded-full border-4" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-800 tabular-nums">0.000s</span>
            </div>
          </div>
        </div>
        <div className="text-left min-w-[140px]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-gray-300 rounded-full" />
              <span className="font-medium text-gray-800">Initializing</span>
            </div>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center space-x-4 bg-white rounded-xl p-6 shadow-lg
        transform transition-all duration-500 ease-in-out
        ${isProcessing || finalTime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="relative w-24 h-24">
        {/* Circular Progress */}
        <div className="absolute inset-0">
          <div
            className={`w-full h-full rounded-full border-4 transition-all duration-300
              ${isProcessing ? 'animate-[spin_2s_linear_infinite]' : ''}`}
            style={{
              borderColor: 'rgba(219, 234, 254, 1)',
              borderTopColor: isProcessing ? '#2563eb' : '#60a5fa',
              borderRightColor: isProcessing ? '#93c5fd' : 'rgba(219, 234, 254, 1)',
              borderBottomColor: isProcessing ? '#93c5fd' : 'rgba(219, 234, 254, 1)'
            }}
          />
        </div>
        {/* Timer Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-lg font-semibold text-gray-800 tabular-nums">
              {formatTime(finalTime ?? elapsedTime)}
            </span>
          </div>
        </div>
      </div>
      <div className="text-left min-w-[140px]">
        {isProcessing ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="font-medium text-gray-800">Processing</span>
            </div>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        ) : finalTime ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="font-medium text-gray-800">Completed</span>
            </div>
            <p className="text-sm text-blue-600 font-medium">
              {formatTime(finalTime)}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-gray-300 rounded-full" />
              <span className="font-medium text-gray-800">Ready</span>
            </div>
            <p className="text-sm text-gray-500">Start processing...</p>
          </div>
        )}
      </div>
    </div>
  );
} 