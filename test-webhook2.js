const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

// Configuration
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/paperclip-item-created';
const WEBHOOK_SECRET = 'crBuxl5XgsIgl32WedmIdPWMZnAAF5l7y3Mz62fF';

// Sample item data
const itemData = {
  event: 'item_created',
  item: {
    id: '12345',
    name: 'Test Item',
    description: 'This is a test item',
    price: '29.99',
    quantity: 1,
    condition_type: 0,
    size: 'M',
    brand: 'Test Brand',
    userId: 'AFFB0D44D2954B40A7369A49A069B589',
    categoryId: 'cat123',
    tags: ['test', 'sample'],
    media: []
  }
};

async function sendTestWebhook() {
  try {
    const form = new FormData();
    form.append('payload', JSON.stringify(itemData));

    // Validate and add test image
    const testImagePath = path.resolve(__dirname, 'fixtures', 'image1.png');
    if (!fs.existsSync(testImagePath)) {
      throw new Error(`Test image not found at: ${testImagePath}`);
    }

    form.append('media', fs.createReadStream(testImagePath));

    // Calculate HMAC signature
    const rawBody = await new Promise((resolve, reject) => {
      const chunks = [];
      form.on('data', chunk => chunks.push(chunk));
      form.on('end', () => resolve(Buffer.concat(chunks)));
      form.on('error', reject);
    });

    if (!WEBHOOK_SECRET) {
      throw new Error('Webhook secret is required');
    }

    const signature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    // Send the request with timeout
    const response = await axios.post(WEBHOOK_URL, form, {
      headers: {
        ...form.getHeaders(),
        'x-paperclip-signature': signature
      },
      timeout: 5000 // 5 second timeout
    });

    console.log('Webhook sent successfully');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Server responded with error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Error setting up request:', error.message);
    }
    process.exit(1);
  }
}

// Run the test if called directly
if (require.main === module) {
  sendTestWebhook();
}