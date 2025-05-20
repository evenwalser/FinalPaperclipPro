const axios = require('axios');

const url = 'http://localhost:3000/api/webhooks/paperclip-item-get';
const itemId = 'item1238d593'; // This should match an existing item ID in your database

async function getItem() {
  try {
    const response = await axios.get(`${url}?id=${itemId}`);
    console.log('Response Status:', response.status);
    console.log('Item Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Error Message:', error.response.data.error);
    } else {
      console.error('Error:', error.message);
    }
  }
}

getItem().catch(console.error); 