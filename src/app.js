require('dotenv').config({ path: './.env' });

const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./webhook');
const senderRoutes = require('./sender');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Meta Messenger API Integration POC - Server is running');
});

// Webhook endpoint - handles GET for verification and POST for receiving messages
app.use('/webhook', webhookRoutes);

// Sender endpoint - handles POST requests to send messages
app.use('/send', senderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Webhook URL: GET /webhook');
  console.log('Sender URL: POST /send');
  console.log('\nIMPORTANT: Use ngrok or similar tool to expose this server to the internet');
  console.log('Example: ngrok http 3000');
});