'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ShieldCheckIcon, LightBulbIcon, ArrowRightIcon, BeakerIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            DeepFake Detective
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered deepfake detection to identify manipulated videos through audio-video synchronization analysis and visual artifact detection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/video-deep-detection" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              <VideoCameraIcon className="w-5 h-5" />
              Analyze Video
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors">
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-gray-50 rounded-2xl my-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Detection Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio-Video Sync Analysis</h3>
              <p className="text-gray-600">
                Detects mismatches between lip movements and speech patterns to identify manipulated content.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BeakerIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Artifact Detection</h3>
              <p className="text-gray-600">
                Identifies digital artifacts, unnatural lighting, and inconsistent shadows that indicate manipulation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Temporal Consistency Check</h3>
              <p className="text-gray-600">
                Analyzes frame-to-frame consistency to detect unnatural movements and temporal anomalies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <h3 className="text-2xl font-semibold mb-4">1. Upload Your Video</h3>
                <p className="text-gray-600 mb-4">
                  Simply upload any video you want to analyze. Our system accepts most common formats including MP4, AVI, MOV, and WebM up to 100MB in size.
                </p>
                <Link href="/video-deep-detection" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                  Try it now <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:w-1/2 bg-gray-200 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                <VideoCameraIcon className="w-24 h-24 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <BeakerIcon className="w-24 h-24 text-gray-400" />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">2. AI-Powered Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our advanced AI system, powered by Google&apos;s Gemini model, analyzes every aspect of your video including audio-video synchronization, facial movements, and visual artifacts.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <h3 className="text-2xl font-semibold mb-4">3. Comprehensive Results</h3>
                <p className="text-gray-600 mb-4">
                  Receive a detailed analysis with confidence score, identified inconsistencies, and expert assessment of whether the video is authentic or a deepfake.
                </p>
              </div>
              <div className="md:w-1/2 bg-gray-200 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                <CheckCircleIcon className="w-24 h-24 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50 rounded-2xl my-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">What are deepfakes?</h3>
              <p className="text-gray-600">
                Deepfakes are synthetic media where a person in an existing image or video is replaced with someone else&apos;s likeness using artificial intelligence. They can manipulate facial expressions, voice, and actions to create convincing but fake content.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How accurate is the detection?</h3>
              <p className="text-gray-600">
                Our system leverages state-of-the-art AI technology to provide high-accuracy detection. However, as deepfake technology evolves, no detection system can be 100% perfect. We provide confidence levels with each analysis to indicate the certainty of our findings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Is my uploaded content secure?</h3>
              <p className="text-gray-600">
                Yes, we prioritize your privacy. Uploaded videos are processed securely, not stored permanently, and are automatically deleted after analysis. We never share your content with third parties.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">What types of deepfakes can be detected?</h3>
              <p className="text-gray-600">
                Our system can detect various types of deepfakes, including face swaps, lip sync manipulations, and synthetic voice generation. We analyze both visual and audio elements to identify inconsistencies across multiple dimensions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">How can I interpret the results?</h3>
              <p className="text-gray-600">
                The results include a clear verdict (authentic or deepfake), a confidence percentage, and detailed findings across different analytical categories. Higher confidence levels indicate greater certainty in the assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Verify Your Video?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Try our advanced deepfake detection technology now and get detailed analysis within minutes.
          </p>
          <Link href="/video-deep-detection" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg">
            Start Detection <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
} 