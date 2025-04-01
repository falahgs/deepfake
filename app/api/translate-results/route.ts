import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: Request) {
  try {
    const { analysisResult } = await request.json();
    
    if (!analysisResult) {
      return NextResponse.json(
        { 
          error: 'No analysis results provided'
        },
        { status: 400 }
      );
    }

    // Create the content to translate based on the analysis result
    let contentToTranslate = `Video Authenticity Analysis\n\n`;
    
    // Add conclusion
    contentToTranslate += `Conclusion: ${analysisResult.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'} (${analysisResult.confidence}% confidence)\n\n`;
    
    // Add audio-video sync score
    if (analysisResult.analysisDetails?.audioVideoSyncScore !== undefined) {
      contentToTranslate += `Audio-Video Sync Score: ${analysisResult.analysisDetails.audioVideoSyncScore}/10\n\n`;
    }
    
    // Add facial inconsistencies
    if (analysisResult.analysisDetails?.facialInconsistencies?.length) {
      contentToTranslate += `Facial Inconsistencies:\n${analysisResult.analysisDetails.facialInconsistencies.map((item: string) => `- ${item}`).join('\n')}\n\n`;
    }
    
    // Add visual artifacts
    if (analysisResult.analysisDetails?.visualArtifacts?.length) {
      contentToTranslate += `Visual Artifacts:\n${analysisResult.analysisDetails.visualArtifacts.map((item: string) => `- ${item}`).join('\n')}\n\n`;
    }
    
    // Add temporal inconsistencies
    if (analysisResult.analysisDetails?.temporalInconsistencies?.length) {
      contentToTranslate += `Temporal Inconsistencies:\n${analysisResult.analysisDetails.temporalInconsistencies.map((item: string) => `- ${item}`).join('\n')}\n\n`;
    }
    
    // Add audio inconsistencies
    if (analysisResult.analysisDetails?.audioInconsistencies?.length) {
      contentToTranslate += `Audio Inconsistencies:\n${analysisResult.analysisDetails.audioInconsistencies.map((item: string) => `- ${item}`).join('\n')}\n\n`;
    }
    
    // Add explanation
    if (analysisResult.explanation) {
      contentToTranslate += `Expert Analysis:\n${analysisResult.explanation}\n`;
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      }
    });

    // Translate the content to Arabic
    const prompt = `Translate the following deepfake analysis results into Arabic. Maintain the formatting structure with headers and bullet points. Keep technical terms clear:

${contentToTranslate}

Provide ONLY the Arabic translation, maintaining the same structure with appropriate Arabic formatting.`;

    const result = await model.generateContent(prompt);
    const translatedText = await result.response.text();

    return NextResponse.json({
      success: true,
      translatedText
    });
  } catch (error) {
    console.error('Error translating results:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to translate results'
      },
      { status: 500 }
    );
  }
} 