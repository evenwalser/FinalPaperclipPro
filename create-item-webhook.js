const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');

const url = 'http://localhost:3000/api/webhooks/paperclip-item-created';
const secret = 'crBuxl5XgsIgl32WedmIdPWMZnAAF5l7y3Mz62fF';

// Point to your real fixture files
const imagePath1 = './fixtures/image1.png';
const imagePath2 = './fixtures/image2.jpg';

// Fully buffer the images first
const img1Buffer = fs.readFileSync(imagePath1);
const img2Buffer = fs.readFileSync(imagePath2);

const payload = {
  event: 'item_created',
  item: {
    id: 'item1238d593',
    name: 'Sample Item',
    description: 'This is a sample item',
    price: '19.99',
    quantity: 1,
    categoryId: 'cat456',
    condition_type: 0,
    size: 'M',
    brand: 'SampleBrand',
    tags: ['tag1', 'tag2'],
    media: [],
    userId: 'AFFB0D44D2954B40A7369A49A069B589'
  }
};

const form = new FormData();
form.append('payload', JSON.stringify(payload));

// Append Buffers with filenames/content types
form.append('media', img1Buffer, {
  filename: 'image1.png',
  contentType: 'image/png'
});
form.append('media', img2Buffer, {
  filename: 'image2.jpg',
  contentType: 'image/jpeg'
});

// Now getBuffer works without error
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

axios
  .post(url, buffer, { headers })
  .then(response => {
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
  })
  .catch(error => {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    );
  });
