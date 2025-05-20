const crypto = require('crypto');
const fs = require('fs');

// Replace with your actual shared secret
const secret = 'LlbFEjTDY2aLshEkzTb7gNiqaXbBR66pzVR32CoyGnNEDYr0hk';

// Must be EXACTLY the raw string you put in Postman
const body = fs.readFileSync('payload.json', 'utf8');

// Compute HMAC
const signature = crypto.createHmac('sha256', secret)
  .update(body)
  .digest('hex');

console.log('Signature:', signature);
