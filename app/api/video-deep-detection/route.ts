import { NextResponse } from "next/server";
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { writeFile } from 'fs/promises';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Define response schema
const DeepfakeAnalysisResponseSchema = z.object({
  type: z.enum(['success', 'error']),
  data: z.object({
    title: z.string(),
    isDeepfake: z.boolean().optional(),
    confidence: z.number().optional(),
    analysisDetails: z.object({
      audioVideoSyncScore: z.number().optional(),
      facialInconsistencies: z.array(z.string()).optional(),
      visualArtifacts: z.array(z.string()).optional(),
      temporalInconsistencies: z.array(z.string()).optional(),
      audioInconsistencies: z.array(z.string()).optional(),
    }).optional(),
    explanation: z.string().optional(),
    error: z.string().optional()
  })
});

/**
 * Uploads the given file to Gemini.
 */
async function uploadToGemini(filePath: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: path.basename(filePath),
  });
  
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 */
async function waitForFilesActive(files: any[]) {
  console.log("Waiting for file processing...");
  
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    let attempts = 0;
    const maxAttempts = 12; // 2 minutes maximum wait
    
    while (file.state === "PROCESSING" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds
      file = await fileManager.getFile(name);
      attempts++;
    }
    
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process after ${attempts} attempts`);
    }
  }
  
  console.log("All files are ready for processing");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;

    if (!videoFile) {
      return NextResponse.json(
        DeepfakeAnalysisResponseSchema.parse({
          type: 'error',
          data: {
            title: 'Error',
            error: 'No video file provided'
          }
        }),
        { status: 400 }
      );
    }

    // Create a temporary directory for the video
    const tempDir = path.join(os.tmpdir(), 'video-analysis-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Save the video file
    const videoPath = path.join(tempDir, videoFile.name || 'video.mp4');
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    await writeFile(videoPath, videoBuffer);
    
    // Detect mime type based on filename
    const mimeType = videoFile.type || "video/mp4";
    
    // Upload file to Gemini
    try {
      const uploadedFile = await uploadToGemini(videoPath, mimeType);
      
      // Wait for file to be processed
      await waitForFilesActive([uploadedFile]);
      
      // Create generative model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro-exp-03-25",
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 4096,
        }
      });
      
      // Start chat session with error handling
      try {
        const chatSession = model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  fileData: {
                    mimeType: uploadedFile.mimeType,
                    fileUri: uploadedFile.uri,
                  },
                },
              ],
            },
            {
              role: "user",
              parts: [
                {
                  text: `You are an expert video forensics analyst specializing in deepfake detection. Analyze this video and provide a detailed assessment of whether it is likely real or a deepfake.

Focus on these key areas:
1. Audio-Video Synchronization: Analyze if lip movements match speech patterns.
2. Facial Inconsistencies: Look for unnatural facial movements, expressions, blinking patterns, or boundary artifacts.
3. Visual Artifacts: Identify glitches, blurs, unnatural lighting, or inconsistent shadows.
4. Temporal Inconsistencies: Detect any unnatural movements between frames or inconsistent motion.
5. Audio Inconsistencies: Analyze for audio artifacts, unnatural voice patterns, or mismatched environmental sounds.

Format your response in this exact structure:

# Video Authenticity Analysis

## Conclusion
[Clear statement if the video is likely REAL or a DEEPFAKE]
[Confidence level as a percentage]

## Audio-Video Synchronization
[Score from 0-10, where 10 is perfect sync]
[Brief explanation of findings]

## Facial Analysis
- [Specific facial inconsistency 1]
- [Specific facial inconsistency 2]
- [etc.]

## Visual Artifacts
- [Specific artifact 1]
- [Specific artifact 2]
- [etc.]

## Temporal Consistency
- [Specific temporal inconsistency 1]
- [Specific temporal inconsistency 2]
- [etc.]

## Audio Analysis
- [Specific audio inconsistency 1]
- [Specific audio inconsistency 2]
- [etc.]

## Summary
[Overall assessment explaining the final determination, synthesizing all findings]`
                },
              ],
            },
          ],
        });
        
        // Send message to get detailed analysis
        try {
          const result = await chatSession.sendMessage("Continue your analysis and give me your final detailed assessment in the exact format I requested.");
          
          // Check if response exists and contains text
          if (!result.response || typeof result.response.text !== 'function') {
            console.error('Invalid response from model:', result);
            return NextResponse.json(
              DeepfakeAnalysisResponseSchema.parse({
                type: 'error',
                data: {
                  title: 'Error',
                  error: 'Invalid response from AI model'
                }
              }),
              { status: 500 }
            );
          }
          
          const analysisText = result.response.text();
          
          // Clean up temporary files
          try {
            fs.rmSync(tempDir, { recursive: true, force: true });
          } catch (cleanupError) {
            console.error('Error cleaning up temporary files:', cleanupError);
          }
          
          // Parse the markdown response
          try {
            const lines = analysisText.split('\n').filter(line => line.trim() !== '');
            
            // Extract key information
            let isDeepfake = false;
            let confidence = 0;
            let audioVideoSyncScore = 0;
            let facialInconsistencies: string[] = [];
            let visualArtifacts: string[] = [];
            let temporalInconsistencies: string[] = [];
            let audioInconsistencies: string[] = [];
            let explanation = '';
            
            // Parse conclusion
            const conclusionIndex = lines.findIndex(line => line.includes('## Conclusion'));
            if (conclusionIndex !== -1 && conclusionIndex + 1 < lines.length) {
              isDeepfake = lines[conclusionIndex + 1].toLowerCase().includes('deepfake');
              
              // Extract confidence
              const confidenceMatch = lines[conclusionIndex + 1].match(/(\d+)%/) || 
                                    lines[conclusionIndex + 2].match(/(\d+)%/);
              if (confidenceMatch && confidenceMatch[1]) {
                confidence = parseInt(confidenceMatch[1], 10);
              }
            }
            
            // Parse audio-video sync score
            const syncIndex = lines.findIndex(line => line.includes('## Audio-Video Synchronization'));
            if (syncIndex !== -1 && syncIndex + 1 < lines.length) {
              const scoreMatch = lines[syncIndex + 1].match(/(\d+)/) || 
                                lines[syncIndex + 2].match(/(\d+)/);
              if (scoreMatch && scoreMatch[1]) {
                audioVideoSyncScore = parseInt(scoreMatch[1], 10);
              }
            }
            
            // Parse findings by section
            let currentSection = '';
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              
              if (line.startsWith('## ')) {
                currentSection = line.replace('## ', '').trim();
                continue;
              }
              
              if (line.startsWith('- ') || line.startsWith('* ')) {
                const item = line.replace(/^[-*]\s+/, '').trim();
                
                switch (currentSection) {
                  case 'Facial Analysis':
                    facialInconsistencies.push(item);
                    break;
                  case 'Visual Artifacts':
                    visualArtifacts.push(item);
                    break;
                  case 'Temporal Consistency':
                    temporalInconsistencies.push(item);
                    break;
                  case 'Audio Analysis':
                    audioInconsistencies.push(item);
                    break;
                }
              }
            }
            
            // Extract summary explanation
            const summaryIndex = lines.findIndex(line => line.includes('## Summary'));
            if (summaryIndex !== -1) {
              explanation = lines.slice(summaryIndex + 1)
                .filter(line => !line.startsWith('## '))
                .join('\n');
            }
            
            return NextResponse.json(
              DeepfakeAnalysisResponseSchema.parse({
                type: 'success',
                data: {
                  title: 'Video Authenticity Analysis',
                  isDeepfake,
                  confidence,
                  analysisDetails: {
                    audioVideoSyncScore,
                    facialInconsistencies,
                    visualArtifacts,
                    temporalInconsistencies,
                    audioInconsistencies,
                  },
                  explanation
                }
              })
            );
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            return NextResponse.json(
              DeepfakeAnalysisResponseSchema.parse({
                type: 'error',
                data: {
                  title: 'Error',
                  error: 'Failed to parse response'
                }
              }),
              { status: 500 }
            );
          }
        } catch (sendError) {
          console.error('Error sending message:', sendError);
          return NextResponse.json(
            DeepfakeAnalysisResponseSchema.parse({
              type: 'error',
              data: {
                title: 'Error',
                error: 'Failed to send message'
              }
            }),
            { status: 500 }
          );
        }
      } catch (chatSessionError) {
        console.error('Error starting chat session:', chatSessionError);
        return NextResponse.json(
          DeepfakeAnalysisResponseSchema.parse({
            type: 'error',
            data: {
              title: 'Error',
              error: 'Failed to start chat session'
            }
          }),
          { status: 500 }
        );
      }
    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        DeepfakeAnalysisResponseSchema.parse({
          type: 'error',
          data: {
            title: 'Error',
            error: 'Failed to upload file'
          }
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing video:', error);
    
    // Make sure we always return a proper error message in JSON format
    let errorMessage = 'Failed to analyze video';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    }
    
    try {
      return NextResponse.json(
        DeepfakeAnalysisResponseSchema.parse({
          type: 'error',
          data: {
            title: 'Error',
            error: errorMessage
          }
        }),
        { status: 500 }
      );
    } catch (zodError) {
      // If schema validation fails, return a simpler error response
      console.error('Schema validation error:', zodError);
      return NextResponse.json(
        {
          type: 'error',
          data: {
            title: 'Error',
            error: errorMessage
          }
        },
        { status: 500 }
      );
    }
  }
} 