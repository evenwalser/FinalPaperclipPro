const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/paperclip-item-created';
const WEBHOOK_SECRET = 'crBuxl5XgsIgl32WedmIdPWMZnAAF5l7y3Mz62fF'; // Replace with your actual webhook secret

// Sample item data
const itemData = {
  event: 'item_created',
  item: {
    id: 'test-item-' + Date.now(),
    userId: 'AFFB0D44D2954B40A7369A49A069B589',
    name: 'Test Item',
    description: 'This is a test item created via webhook',
    price: '29.99',
    quantity: 1,
    categoryId: 'test-category',
    condition_type: 0,
    size: 'M',
    brand: 'Test Brand',
    tags: ['test', 'webhook'],
    media: []
  }
};

async function createTestRequest() {
  const form = new FormData();

  // Add the JSON payload
  form.append('payload', JSON.stringify(itemData));

  // Add image files from fixtures directory
  const fixturesDir = path.join(__dirname, 'fixtures');
  const imageFiles = ['image1.png', 'image2.jpg'];

  for (const imageFile of imageFiles) {
    const imagePath = path.join(fixturesDir, imageFile);
    form.append('media', fs.createReadStream(imagePath));
  }

  // Get the raw form data for HMAC calculation
  const formBuffer = await new Promise((resolve, reject) => {
    const chunks = [];
    form.on('data', chunk => chunks.push(chunk));
    form.on('end', () => resolve(Buffer.concat(chunks)));
    form.on('error', reject);
  });

  // Calculate HMAC signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(formBuffer);
  const signature = hmac.digest('hex');

  // Send the request
  try {
    const response = await axios.post(WEBHOOK_URL, formBuffer, {
      headers: {
        ...form.getHeaders(),
        'x-paperclip-signature': signature
      }
    });

    console.log('Response status:', response.status);
    console.log('Response body:', response.data);
  } catch (error) {
    console.error('Error sending request:', error.response?.data || error.message);
  }
}

// Run the test
createTestRequest().catch(console.error); 