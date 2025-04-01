import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });

// Define response schema
const AnalysisResponseSchema = z.object({
  type: z.enum(['success', 'error']),
  data: z.object({
    title: z.string(),
    steps: z.array(z.object({
      step: z.number(),
      description: z.string(),
      formula: z.string().optional(),
      result: z.string().optional()
    })).optional(),
    finalAnswer: z.string().optional(),
    error: z.string().optional()
  })
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json(
        AnalysisResponseSchema.parse({
          type: 'error',
          data: {
            title: 'Error',
            error: 'No text provided'
          }
        }),
        { status: 400 }
      );
    }

    const response = await model.generateContent([
      { text: `You are a mathematical and physics puzzle solver. Analyze the following puzzle and provide response in this exact format:

# [Title of the Problem]

## Step 1: [Step Description]
Formula: [Formula used if applicable]
Result: [Intermediate result if applicable]

## Step 2: [Step Description]
Formula: [Formula used if applicable]
Result: [Intermediate result if applicable]

[Continue with more steps as needed]

## Final Answer: [The complete solution]

IMPORTANT: Always include a Final Answer section with a clear and complete solution.

Here's the puzzle to solve:

${text}` }
    ]);

    const result = await response.response.text();

    // Parse the markdown response into structured data
    const lines = result.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
    const title = lines[0].replace('# ', '');
    const steps = [];
    let currentStep: any = {};
    let finalAnswer = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('## Step')) {
        if (currentStep.step) steps.push(currentStep);
        currentStep = { 
          step: parseInt(line.match(/\d+/)?.[0] || '0'), 
          description: line.split(': ')[1] 
        };
      } else if (line.startsWith('Formula:')) {
        currentStep.formula = line.replace('Formula: ', '').trim();
      } else if (line.startsWith('Result:')) {
        currentStep.result = line.replace('Result: ', '').trim();
      } else if (line.startsWith('## Final Answer:')) {
        if (currentStep.step) steps.push(currentStep);
        currentStep = {};
        // Capture everything after "## Final Answer:" until the end or next section
        finalAnswer = line.replace('## Final Answer:', '').trim();
        // Check if there are more lines to add to the final answer
        while (i + 1 < lines.length && !lines[i + 1].startsWith('##')) {
          finalAnswer += '\n' + lines[++i].trim();
        }
      }
    }

    // Push the last step if exists
    if (currentStep.step) steps.push(currentStep);

    // If no final answer was found, add a default one
    if (!finalAnswer) {
      finalAnswer = "See the steps above for the complete solution.";
    }

    console.log('Parsed Response:', { title, steps, finalAnswer }); // Debug log

    return NextResponse.json(
      AnalysisResponseSchema.parse({
        type: 'success',
        data: {
          title,
          steps,
          finalAnswer
        }
      })
    );

  } catch (error) {
    console.error('Error analyzing text:', error);
    return NextResponse.json(
      AnalysisResponseSchema.parse({
        type: 'error',
        data: {
          title: 'Error',
          error: 'Failed to analyze text'
        }
      }),
      { status: 500 }
    );
  }
} 