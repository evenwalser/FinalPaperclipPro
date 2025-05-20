const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');

const url = 'http://localhost:3000/api/webhooks/paperclip-item-updated';
const secret = 'crBuxl5XgsIgl32WedmIdPWMZnAAF5l7y3Mz62fF';

// Point to your real fixture files
const imagePath1 = './fixtures/image1.png';
const imagePath2 = './fixtures/image2.jpg';

// Fully buffer the images first
const img1Buffer = fs.readFileSync(imagePath1);
// const img2Buffer = fs.readFileSync(imagePath2);

const payload = {
  event: 'item_updated',
  item: {
    id: 'item1238d593', // This should match an existing item ID in your database
    name: 'Updated Sample Item',
    description: 'This is an updated sample item2',
    price: '29.99',
    quantity: 2,
    categoryId: 'cat456',
    condition_type: 1, // Changed to Refurbished
    size: 'L', // Changed size
    brand: 'UpdatedBrand',
    tags: ['tag1', 'tag2', 'tag3'], // Added a tag
    media: [],
    userId: 'AFFB0D44D2954B40A7369A49A069B589'
  }
};

// Function to send JSON payload
async function sendJsonPayload() {
  const jsonPayload = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(jsonPayload)
    .digest('hex');

  try {
    const response = await axios.post(url, jsonPayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-paperclip-signature': signature
      }
    });
    console.log('JSON Response Status:', response.status);
    console.log('JSON Response Data:', response.data);
  } catch (error) {
    console.error(
      'JSON Error:',
      error.response ? error.response.data : error.message
    );
  }
}

// Function to send multipart form data
async function sendMultipartPayload() {
  const form = new FormData();
  form.append('payload', JSON.stringify(payload));

  // Append Buffers with filenames/content types
  form.append('media', img1Buffer, {
    filename: 'image1.png',
    contentType: 'image/png'
  });
  // form.append('media', img2Buffer, {
  //   filename: 'image2.jpg',
  //   contentType: 'image/jpeg'
  // });

  // Get the buffer for HMAC
  const buffer = form.getBuffer();

  // Compute HMAC over the entire multipart body
  const signature = crypto
    .createHmac('sha256', secret)
    .update(buffer)
    .digest('hex');

  // Merge in the multipart headers + your signature
  const headers = {
    ...form.getHeaders(),
    'x-paperclip-signature': signature
  };

  try {
    const response = await axios.post(url, buffer, { headers });
    console.log('Multipart Response Status:', response.status);
    console.log('Multipart Response Data:', response.data);
  } catch (error) {
    console.error(
      'Multipart Error:',
      error.response ? error.response.data : error.message
    );
  }
}

// Run both tests
async function runTests() {
  console.log('Testing JSON payload...');
  await sendJsonPayload();
  
  console.log('\nTesting multipart form data...');
  await sendMultipartPayload();
}

runTests().catch(console.error); 