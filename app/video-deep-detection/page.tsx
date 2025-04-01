'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowUpTrayIcon, SparklesIcon, ExclamationTriangleIcon, CheckCircleIcon, ClipboardIcon, TrashIcon, ClockIcon, LanguageIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import ClientOnly from '../components/ClientOnly';

type AnalysisResult = {
  type: 'success' | 'error';
  data: {
    title: string;
    isDeepfake?: boolean;
    confidence?: number;
    analysisDetails?: {
      audioVideoSyncScore?: number;
      facialInconsistencies?: string[];
      visualArtifacts?: string[];
      temporalInconsistencies?: string[];
      audioInconsistencies?: string[];
    };
    explanation?: string;
    error?: string;
  };
};

export default function VideoDeepfakeDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const videoFile = acceptedFiles[0];
    if (!videoFile.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    // Clean up previous URL if it exists
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    setFileName(videoFile.name);
    setVideoUrl(URL.createObjectURL(videoFile));
    setAnalysisResult(null);
    setAnalysisError(null);
  }, [videoUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB max size
  });

  const analyzeVideo = async () => {
    if (!videoUrl) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    
    try {
      // Start the timer
      if (timer) {
        clearInterval(timer);
      }
      
      const startTime = Date.now();
      const newTimer = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(Math.floor((currentTime - startTime) / 1000));
      }, 1000);
      setTimer(newTimer);
      
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('video', blob, fileName || 'video.mp4');

      const analysisResponse = await fetch('/api/video-deep-detection', {
        method: 'POST',
        body: formData,
      });

      let errorMessage = 'Failed to analyze video';
      
      if (!analysisResponse.ok) {
        // Try to parse as JSON first
        try {
          const errorData = await analysisResponse.json();
          errorMessage = errorData.data?.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try to get the text
          try {
            const errorText = await analysisResponse.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error('Error reading response as text:', textError);
          }
        }
        throw new Error(errorMessage);
      }

      // Try to parse the successful response as JSON
      let result;
      try {
        result = await analysisResponse.json();
      } catch (jsonError) {
        console.error('Error parsing successful response:', jsonError);
        throw new Error('Invalid response format from server');
      }
      
      setAnalysisResult(result);
      
      if (result.type === 'error') {
        setAnalysisError(result.data.error || 'Unknown error occurred');
        toast.error(result.data.error || 'Failed to analyze video');
      } else {
        toast.success('Video analysis complete');
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to analyze video');
    } finally {
      // Stop the timer
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      setIsAnalyzing(false);
    }
  };

  const handleClearAll = () => {
    if (!videoUrl) return;
    
    URL.revokeObjectURL(videoUrl);
    setVideoUrl('');
    setFileName('');
    setAnalysisResult(null);
    setAnalysisError(null);
    
    if (videoRef.current) {
      videoRef.current.src = '';
      videoRef.current.load();
    }
    
    toast.success('All cleared');
  };

  const handleCopyResults = () => {
    if (!analysisResult?.data) return;
    
    const { isDeepfake, confidence, analysisDetails, explanation } = analysisResult.data;
    
    let textToCopy = `Video Deepfake Analysis Results\n\n`;
    textToCopy += `Conclusion: ${isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'} (${confidence}% confidence)\n\n`;
    
    if (analysisDetails?.audioVideoSyncScore !== undefined) {
      textToCopy += `Audio-Video Sync Score: ${analysisDetails.audioVideoSyncScore}/10\n\n`;
    }
    
    if (analysisDetails?.facialInconsistencies?.length) {
      textToCopy += `Facial Inconsistencies:\n${analysisDetails.facialInconsistencies.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    
    if (analysisDetails?.visualArtifacts?.length) {
      textToCopy += `Visual Artifacts:\n${analysisDetails.visualArtifacts.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    
    if (analysisDetails?.temporalInconsistencies?.length) {
      textToCopy += `Temporal Inconsistencies:\n${analysisDetails.temporalInconsistencies.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    
    if (analysisDetails?.audioInconsistencies?.length) {
      textToCopy += `Audio Inconsistencies:\n${analysisDetails.audioInconsistencies.map(item => `• ${item}`).join('\n')}\n\n`;
    }
    
    if (explanation) {
      textToCopy += `Expert Analysis:\n${explanation}\n`;
    }

    copyToClipboard(textToCopy);
  };

  // Separate function for clipboard operations with fallbacks
  const copyToClipboard = (text: string) => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Method 1: Using Clipboard API
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success('Results copied to clipboard');
        })
        .catch((err) => {
          console.error('Clipboard API failed:', err);
          // Try fallback method
          copyUsingFallback(text);
        });
      return;
    }

    // Method 2: Fallback for browsers without clipboard API
    copyUsingFallback(text);
  };

  // Fallback method using execCommand
  const copyUsingFallback = (text: string) => {
    try {
      // Ensure we're in browser environment
      if (typeof document === 'undefined') return false;
      
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('execCommand Error:', err);
      }
      
      document.body.removeChild(textArea);
      
      if (success) {
        toast.success('Results copied to clipboard');
      } else {
        toast.error('Unable to copy to clipboard');
      }
      
      return success;
    } catch (err) {
      console.error('Fallback clipboard error:', err);
      toast.error('Failed to copy results');
      return false;
    }
  };

  const renderConfidenceIndicator = (confidence?: number) => {
    if (confidence === undefined) return null;
    
    const getColor = () => {
      if (confidence >= 80) return 'bg-red-500';
      if (confidence >= 60) return 'bg-orange-500';
      if (confidence >= 40) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Confidence: {confidence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className={`h-2.5 rounded-full ${getColor()}`} 
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderDetailList = (title: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, index) => (
            <li key={index} className="text-sm">{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSyncScore = (score?: number) => {
    if (score === undefined) return null;
    
    const getColor = () => {
      if (score >= 8) return 'text-green-500';
      if (score >= 5) return 'text-yellow-500';
      return 'text-red-500';
    };

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Audio-Video Synchronization</h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getColor()}`}>{score}/10</span>
          <span className="text-sm text-gray-500">
            {score >= 8 ? 'Excellent sync' : score >= 5 ? 'Moderate sync issues' : 'Poor synchronization'}
          </span>
        </div>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTranslateToArabic = async () => {
    if (!analysisResult?.data) return;
    
    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/translate-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult: analysisResult.data
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to translate results');
      }
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
      toast.success('Results translated to Arabic');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate results');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownloadReport = async (language: 'en' | 'ar' = 'en') => {
    if (!analysisResult?.data) return;
    
    setIsGeneratingReport(true);
    
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult: analysisResult.data,
          translatedText: language === 'ar' ? translatedText : undefined,
          language,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate the report');
      }
      
      const data = await response.json();
      
      if (!data.fileBase64) {
        throw new Error('No file data received');
      }
      
      // Create a blob and download it
      try {
        const binaryString = atob(data.fileBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { 
          type: 'text/plain;charset=utf-8' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deepfake-analysis${language === 'ar' ? '-arabic' : ''}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        
        toast.success('Report downloaded');
      } catch (blobError) {
        console.error('Error creating download blob:', blobError);
        throw new Error('Failed to process file data');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Cleanup any URLs or timers when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup video URL if it exists
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      
      // Cleanup timer if it exists
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    };
  }, [videoUrl, timer]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Video Deepfake Detection</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a video to analyze for signs of deepfake manipulation. Our advanced AI will check for audio-video synchronization issues, facial inconsistencies, and other artifacts.
        </p>
      </div>

      <ClientOnly
        fallback={
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  {/* Placeholder for icon */}
                </div>
                <p className="text-lg font-medium mb-2">
                  Loading...
                </p>
                <p className="text-sm text-gray-500">
                  Please wait while the application loads.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Advanced Deepfake Detection</h3>
              <p className="text-gray-600 max-w-md">
                Loading application...
              </p>
            </div>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                {isDragActive
                  ? "Drop the video here"
                  : "Drag and drop a video file, or click to select"}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: MP4, AVI, MOV, WebM (Max: 100MB)
              </p>
            </div>

            {videoUrl && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">Preview</h2>
                  <button 
                    onClick={handleClearAll}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Clear
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden bg-black">
                  <video 
                    ref={videoRef}
                    src={videoUrl} 
                    controls 
                    className="w-full h-auto"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{fileName}</p>
                <button
                  onClick={analyzeVideo}
                  disabled={isAnalyzing}
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white ${
                    isAnalyzing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      Analyze for Deepfakes
                    </>
                  )}
                </button>
                
                {isAnalyzing && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>Processing time: {formatTime(elapsedTime)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            {analysisError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Analysis Error</h3>
                    <p className="text-sm text-red-700 mt-1">{analysisError}</p>
                  </div>
                </div>
              </div>
            )}

            {analysisResult?.type === 'success' && analysisResult.data && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {analysisResult.data.isDeepfake ? (
                      <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="h-8 w-8 text-green-500" />
                    )}
                    <h2 className="text-2xl font-bold">
                      {analysisResult.data.isDeepfake ? 'Likely Deepfake Detected' : 'Likely Authentic Video'}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopyResults}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      title="Copy results to clipboard"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {renderConfidenceIndicator(analysisResult.data.confidence)}
                
                {renderSyncScore(analysisResult.data.analysisDetails?.audioVideoSyncScore)}
                
                <div className="space-y-6">
                  {renderDetailList('Facial Inconsistencies', analysisResult.data.analysisDetails?.facialInconsistencies)}
                  {renderDetailList('Visual Artifacts', analysisResult.data.analysisDetails?.visualArtifacts)}
                  {renderDetailList('Temporal Inconsistencies', analysisResult.data.analysisDetails?.temporalInconsistencies)}
                  {renderDetailList('Audio Inconsistencies', analysisResult.data.analysisDetails?.audioInconsistencies)}
                </div>

                {analysisResult.data.explanation && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Expert Analysis</h3>
                    <p className="text-sm whitespace-pre-line">{analysisResult.data.explanation}</p>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-3">
                  <button
                    onClick={handleTranslateToArabic}
                    disabled={isTranslating}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-gray-300 text-sm ${
                      isTranslating ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {isTranslating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Translating...
                      </>
                    ) : (
                      <>
                        <LanguageIcon className="h-4 w-4" />
                        Translate to Arabic
                      </>
                    )}
                  </button>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDownloadReport('en')}
                      disabled={isGeneratingReport}
                      className={`flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-md border border-gray-300 text-sm ${
                        isGeneratingReport ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {isGeneratingReport ? (
                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          TXT
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDownloadReport('ar')}
                      disabled={isGeneratingReport}
                      className={`flex items-center justify-center gap-1 py-2 px-3 rounded-md border border-gray-300 text-sm ${
                        isGeneratingReport ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                      title="Download in Arabic"
                    >
                      عربي
                    </button>
                  </div>
                </div>
                
                {/* Translated text section */}
                {translatedText && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 p-4 bg-gray-50 rounded-md overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">Arabic Translation</h3>
                      <button 
                        onClick={() => translatedText && copyToClipboard(translatedText)}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
                        title="Copy Arabic text"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="whitespace-pre-line text-right" dir="rtl" lang="ar">
                      {translatedText}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {!analysisResult && !analysisError && !isAnalyzing && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
                <SparklesIcon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Deepfake Detection</h3>
                <p className="text-gray-600 max-w-md">
                  Our AI analyzes multiple aspects of the video including facial movements, audio-video synchronization, 
                  and visual artifacts to determine if a video has been manipulated.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-1">Audio-Video Sync</h4>
                    <p className="text-sm text-gray-500">Detects lip sync issues</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-1">Facial Analysis</h4>
                    <p className="text-sm text-gray-500">Spots unnatural expressions</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-1">Visual Artifacts</h4>
                    <p className="text-sm text-gray-500">Identifies digital glitches</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <h4 className="font-medium mb-1">Temporal Analysis</h4>
                    <p className="text-sm text-gray-500">Checks frame consistency</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    </div>
  );
} 