const crypto = require('crypto');
const fetch = require('node-fetch');

// Webhook secret from your environment
const WEBHOOK_SECRET = 'crBuxl5XgsIgl32WedmIdPWMZnAAF5l7y3Mz62fF';

// Test item data
const testItem = {
  event: "item_created",
  item: {
    id: "test-item-" + Date.now(),
    userId: "AFFB0D44D2954B40A7369A49A069B589",
    name: "Test Item",
    description: "This is a test item description",
    price: "29.99",
    quantity: 1,
    categoryId: "test-category",
    condition_type: 0, // 0 for New
    size: "M",
    brand: "Test Brand",
    color: "Blue",
    logo_url: "https://example.com/logo.png",
    tags: ["test", "sample"],
    media: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
};

// Function to compute HMAC signature
function computeHMAC(rawBody, secret) {
  return crypto.createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
}

async function testWebhook() {
  try {
    // Convert test data to JSON string
    const jsonData = JSON.stringify(testItem);
    
    // Compute signature
    const signature = computeHMAC(jsonData, WEBHOOK_SECRET);
d
    // Send request to webhook endpoint
    const response = await fetch('http://localhost:3000/api/webhooks/paperclip-item-created', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paperclip-signature': signature
      },
      body: jsonData
    });

    // Get response
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

// Run the test
testWebhook(); 