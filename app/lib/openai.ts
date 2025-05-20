import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: 'https://api.proxyapi.ai/openai/v1',
});

export async function analyzeImage(imageBase64: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image of a secondhand item and provide the following details in JSON format: name, description, suggested price in GBP, and category (from these options: Clothing, Home Decor, Electronics, Furniture, Accessories, Music). Make the description appealing for a marketplace listing."
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content in response');

    // Parse the JSON response
    const result = JSON.parse(content);
    return {
      name: result.name,
      description: result.description,
      price: result.suggested_price,
      category: result.category,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
} 