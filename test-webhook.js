// File: test-webhook.js

const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream'); 
const crypto = require('crypto');
const FormData = require('form-data');
const axios = require('axios');

// 1) CONFIGURE THESE:
const WEBHOOK_URL = 'https://054d-2a09-bac5-3b0c-172d-00-24f-7.ngrok-free.app/api/webhooks/create-item';
const WEBHOOK_SECRET = 'LlbFEjTDY2aLshEkzTb7gNiqaXbBR66pzVR32CoyGnNEDYr0hk';

// Your "item_created" test payload:
const payload = {
  event: 'item_created',
  item: {
    id: "item273sdf",
    userId: "D2A50B9416724E79B5974F0B73F8DB3A",
    marketplace: 'example',
    name: 'Test Item',
    description: 'This is just a test',
    price: '19.99',
    quantity: 5,
    categoryId: 42,
    condition_type: 0,
    size: 'M',
    brand: 'MockBrand',
    tags: ['test', 'nodejs'],
    media: []   // we’ll upload files instead of URLs
  }
};

// 2) BUILD the multipart/form-data body:
async function buildForm() {
    const form = new FormData();
    form.append('payload', JSON.stringify(payload));
  
    // Attach your files (streams)
    const images = [
      path.join(__dirname, 'fixtures', 'image1.png'),
      path.join(__dirname, 'fixtures', 'image2.jpg'),
    ];
    for (const img of images) {
      form.append('media', fs.createReadStream(img));
    }
  
    // Get total length
    await new Promise((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) return reject(err);
        form._length = length;
        resolve();
      });
    });
  
    return form;
  }
  
  // Collect the full multipart body into a Buffer
  function getRawBody(form) {
    return new Promise((resolve, reject) => {
      const bufs = [];
      const pass = new PassThrough();
      form.pipe(pass);
      pass.on('data', c => bufs.push(c));
      pass.on('end', () => resolve(Buffer.concat(bufs)));
      pass.on('error', reject);
    });
  }
  
  function computeSignature(rawBody, secret) {
    return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  }
  
  async function sendWebhook() {
    const form = await buildForm();
    const rawBody = await getRawBody(form);
    const signature = computeSignature(rawBody, WEBHOOK_SECRET);
  
    const headers = {
      ...form.getHeaders(),         // includes correct multipart boundary
      'Content-Length': form._length,
      'X-Paperclip-Signature': signature,
    };
  
    try {
      const resp = await axios.post(WEBHOOK_URL, rawBody, { headers });
      console.log('✅', resp.status, resp.data);
    } catch (err) {
      if (err.response) {
        console.error('❌', err.response.status, err.response.data);
      } else {
        console.error('❌', err.message);
      }
    }
}

sendWebhook();
