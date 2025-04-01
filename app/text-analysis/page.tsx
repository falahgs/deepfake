'use client';

import { useState, useEffect } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import ProcessingTimer from '../components/ProcessingTimer';
import CopyButton from '../components/CopyButton';

// Loading Animation Component
function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Puzzle</h3>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

interface Step {
  step: number;
  description: string;
  formula?: string;
  result?: string;
}

interface AnalysisResult {
  type: 'success' | 'error';
  data: {
    title: string;
    steps?: Step[];
    finalAnswer?: string;
    error?: string;
  };
}

export default function TextAnalysisPage() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/text-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.data?.error || 'Failed to analyze text');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError(null);
    setProcessingTime(null);
  };

  const formatResultForCopy = () => {
    if (!result || result.type !== 'success') return '';

    let text = `${result.data.title}\n\n`;
    
    if (result.data.steps) {
      result.data.steps.forEach(step => {
        text += `Step ${step.step}: ${step.description}\n`;
        if (step.formula) text += `Formula: ${step.formula}\n`;
        if (step.result) text += `Result: ${step.result}\n`;
        text += '\n';
      });
    }

    if (result.data.finalAnswer) {
      text += `Final Answer: ${result.data.finalAnswer}\n`;
    }

    return text;
  };

  const handleTimerComplete = (time: number) => {
    setProcessingTime(time);
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="h-[calc(100vh-13rem)] flex flex-col">
        <div className="flex-grow flex flex-col space-y-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-13rem)] flex flex-col">
      <div className="flex-grow flex flex-col space-y-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Puzzle Solver</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="puzzle-input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your puzzle
              </label>
              <div className="relative">
                <textarea
                  id="puzzle-input"
                  rows={4}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                  placeholder="Type your mathematical, physics, or logical puzzle here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                {input && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Clear input"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors
                  ${isLoading || !input.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                <span>Analyze</span>
                <FiSend className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Processing Timer */}
        {(isLoading || processingTime) && (
          <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center">
            <ProcessingTimer
              isProcessing={isLoading}
              onComplete={handleTimerComplete}
            />
          </div>
        )}

        {/* Results */}
        {result?.type === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{result.data.title}</h2>
              <CopyButton text={formatResultForCopy()} />
            </div>
            {result.data.steps?.map((step, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-gray-700">Step {step.step}: {step.description}</h3>
                {step.formula && (
                  <div className="mt-2 text-gray-600">
                    <strong>Formula:</strong> {step.formula}
                  </div>
                )}
                {step.result && (
                  <div className="mt-2 text-gray-600">
                    <strong>Result:</strong> {step.result}
                  </div>
                )}
              </div>
            ))}
            {result.data.finalAnswer && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <strong className="text-blue-800">Final Answer:</strong>
                <p className="mt-2 text-blue-700">{result.data.finalAnswer}</p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 