import Together from "together-ai";
import { resizeImage, encodeImageToBase64 } from './utils/imageProcessing';

interface AIAnalysisResult {
  title: string;
  description: string;
  brand: string;
  price_low: number;
  price_avg: number;
  price_high: number;
  condition: 'new' | 'refurbished' | 'used' | 'bad';
  images_summary: string[];
  category_id: string;
}

// const together = new Together({ 
//   apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY 
// });

if (!process.env.NEXT_PUBLIC_TOGETHER_API_KEY) {
  console.error('Together API key is missing');
  throw new Error('API key not configured');
}

export async function analyzeImage(imageFile: File): Promise<AIAnalysisResult> {
  try {
    console.log('Starting image analysis...');

    // Validate and preprocess image
    if (!['image/jpeg', 'image/png'].includes(imageFile.type)) {
      throw new Error('Unsupported image type. Only JPEG and PNG are allowed.');
    }

    let processedFile = imageFile;
    if (imageFile.size > 5 * 1024 * 1024) {
      processedFile = await resizeImage(imageFile);
    }

    const imageData = await encodeImageToBase64(processedFile);

    const prompt = `Analyze this image and provide a detailed product listing in JSON format. Include:
      - title: Brief, catchy title with brand (max 50 chars)
      - description: Detailed product description
      - brand: Any visible brand names/logos
      - price_low: Minimum market price
      - price_avg: Average market price
      - price_high: Maximum market price
      - condition: Assess as 'new', 'refurbished', 'used', or 'bad'
      - category_id: Most appropriate category
      - images_summary: Key visual details, tags, serial numbers

    Format response as valid JSON only.`;

    // Call our API route instead of Together.ai directly
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
        prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze image');
    }

    const data = await response.json();
    console.log('API Response:', data);

    let fullResponse = '';
    for await (const token of data) {
      fullResponse += token.choices[0]?.delta?.content || '';
    }

    const result = JSON.parse(fullResponse) as AIAnalysisResult;
    validateResponse(result);
    return result;
  } catch (error) {
    console.error('Client Error:', error);
    throw error;
  }
}

function validateResponse(response: any): asserts response is AIAnalysisResult {
  const required = ['title', 'description', 'condition', 'price_avg'];
  for (const field of required) {
    if (!response[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
} 