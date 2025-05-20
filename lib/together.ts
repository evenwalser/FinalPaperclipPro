// Define expected response type
// type TogetherAIResponse = {
//   title: string;
//   description: string;
//   price_avg: number;
//   category_id: string;
//   condition?: string;
// };

export async function analyzeImage(imageData: string | FormData | File): Promise<any> {
  try {
    console.log('Starting image analysis...');
    const formData = new FormData();

    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:image')) {
        const response = await fetch(imageData);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      } else if (imageData.startsWith('https')) {
        formData.append('image', imageData); 
      } else {
        throw new Error('Invalid image format');
      }
    } else if (imageData instanceof File) {
      formData.append('image', imageData);
    } else if (imageData instanceof FormData) {
      // Optionally, merge the passed FormData into the new FormData
      // For example, if you expect keys like 'image' or 'image_url':
      Array.from(imageData.entries()).forEach(([key, value]) => {
        formData.append(key, value);
      });
    } else {
      throw new Error('Invalid image format');
    }

    // Send to our API route
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}