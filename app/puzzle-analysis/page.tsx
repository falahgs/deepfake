'use client';

import { useState, useCallback } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import ProcessingTimer from '../components/ProcessingTimer';
import CopyButton from '../components/CopyButton';
import ImageSlider from '../components/ImageSlider';

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

export default function PuzzleAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  }, []);

  const handleClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setProcessingTime(null);
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.data?.error || 'Failed to analyze image');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="h-[calc(100vh-13rem)] flex flex-col">
      <div className="flex-grow flex flex-col space-y-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Image Puzzle Solver</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="image-input" className="block text-sm font-medium text-gray-700 mb-2">
                Upload your puzzle image
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-input"
                  className="cursor-pointer flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div className="text-center">
                    <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </div>
                </label>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Clear selection"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <ImageSlider imageUrl={previewUrl} />
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors
                  ${isLoading || !selectedFile
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                <span>Analyze</span>
                <FiUpload className="w-4 h-4" />
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