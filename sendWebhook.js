// tests/sendWebhook.js
    // npm install dotenv
const crypto = require('crypto');

async function sendTest() {
  // Read from .env or fall back to hard-coded (remove the fallback in prod!)
  const secret = 'LlbFEjTDY2aLshEkzTb7gNiqaXbBR66pzVR32CoyGnNEDYr0hk';

  if (!secret) {
    console.error('Missing PAPERCLIP_WEBHOOK_SECRET in environment');
    process.exit(1);
  }

  // Build your test payload
  const payload = {
    event: "item_created",
    item: {
      id: "test-item-abc1234",
      userId: "9AE5E69D753A4ECF9E7C4992C15E064F",
      name: "Test Item Name",
      description: "This is a description for testing the webhook.",
      price: "19.99",
      quantity: 2,
      condition_type: 0,        // 0 = New, 1 = Refurbished, 4 = Used
      size: "M",
      brand: "Acme Co.",
      tags: ["test", "webhook", "paperclip"],
      media: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/300"
      ]
    }
  };

  // Stringify exactly as your Next.js handler will see it
  const rawBody = JSON.stringify(payload);

  // Compute HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  try {
    // Node 20+ has fetch built in
    const res = await fetch(
      'http://localhost:3000/api/webhooks/paperclip-item-created',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Paperclip-Signature': signature
        },
        body: rawBody
      }
    );

    console.log('Status:', res.status);
    console.log('Response:', await res.json());
  } catch (err) {
    console.error('Error sending webhook:', err);
    process.exit(1);
  }
}

sendTest();
