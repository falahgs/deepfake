import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import os from 'os';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const { analysisResult, translatedText, language = 'en' } = await request.json();
    
    if (!analysisResult) {
      return NextResponse.json(
        { 
          error: 'No analysis results provided'
        },
        { status: 400 }
      );
    }

    const isDeepfake = analysisResult.isDeepfake || false;
    const confidence = analysisResult.confidence || 0;
    const analysisDetails = analysisResult.analysisDetails || {};
    const explanation = analysisResult.explanation || '';

    // Create a temporary directory
    const tempDir = path.join(os.tmpdir(), 'deepfake-reports-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Create random filename
    const filename = `deepfake-analysis-${Date.now()}.txt`;
    const filePath = path.join(tempDir, filename);

    // Set language-specific content
    const isArabic = language === 'ar';
    
    // If Arabic is requested and we have translated text, use it
    let content = '';
    
    if (isArabic && translatedText) {
      content = translatedText;
    } else {
      // Generate text content based on analysis results
      
      // Add title
      content += isArabic ? 'تحليل أصالة الفيديو\n\n' : 'VIDEO AUTHENTICITY ANALYSIS\n\n';
      
      // Add conclusion
      content += isArabic ? 'الخلاصة: ' : 'Conclusion: ';
      content += isArabic 
        ? (isDeepfake ? 'مزيف (ديب فيك)' : 'أصلي') 
        : (isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC');
      content += '\n';
      
      // Add confidence
      content += isArabic ? 'مستوى الثقة: ' : 'Confidence: ';
      content += `${confidence}%\n\n`;
      
      // Add audio-video sync score
      if (analysisDetails.audioVideoSyncScore !== undefined) {
        content += isArabic ? 'درجة تزامن الصوت والفيديو: ' : 'Audio-Video Sync Score: ';
        content += `${analysisDetails.audioVideoSyncScore}/10\n\n`;
      }
      
      // Add facial inconsistencies
      if (analysisDetails.facialInconsistencies?.length) {
        content += isArabic ? 'التناقضات في الوجه:\n' : 'Facial Inconsistencies:\n';
        
        analysisDetails.facialInconsistencies.forEach((item: string) => {
          content += `- ${item}\n`;
        });
        
        content += '\n';
      }
      
      // Add visual artifacts
      if (analysisDetails.visualArtifacts?.length) {
        content += isArabic ? 'العيوب البصرية:\n' : 'Visual Artifacts:\n';
        
        analysisDetails.visualArtifacts.forEach((item: string) => {
          content += `- ${item}\n`;
        });
        
        content += '\n';
      }
      
      // Add temporal inconsistencies
      if (analysisDetails.temporalInconsistencies?.length) {
        content += isArabic ? 'عدم اتساق التسلسل الزمني:\n' : 'Temporal Inconsistencies:\n';
        
        analysisDetails.temporalInconsistencies.forEach((item: string) => {
          content += `- ${item}\n`;
        });
        
        content += '\n';
      }
      
      // Add audio inconsistencies
      if (analysisDetails.audioInconsistencies?.length) {
        content += isArabic ? 'التناقضات الصوتية:\n' : 'Audio Inconsistencies:\n';
        
        analysisDetails.audioInconsistencies.forEach((item: string) => {
          content += `- ${item}\n`;
        });
        
        content += '\n';
      }
      
      // Add expert analysis
      if (explanation) {
        content += isArabic ? 'تحليل الخبير:\n' : 'Expert Analysis:\n';
        content += `${explanation}\n`;
      }
    }

    // Write to text file
    await writeFile(filePath, content);
    
    // Read the file as Buffer
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');
    
    // Clean up temporary files
    try {
      fs.unlinkSync(filePath);
      fs.rmdirSync(tempDir);
    } catch (err: any) {
      console.error('Error cleaning up temp files:', err);
    }

    return NextResponse.json({
      success: true,
      filename,
      fileBase64: base64Data
    });
  } catch (error) {
    console.error('Error generating text file:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate text file'
      },
      { status: 500 }
    );
  }
} 