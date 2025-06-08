
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log('Webhook verification request received:');
  console.log(`Mode: ${mode}, Token: ${token}`);

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('Webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      // Verification failed
      console.error('Webhook verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
    // Missing parameters
    console.error('Missing query parameters for webhook verification');
    res.sendStatus(400);
  }
});

// POST endpoint for receiving message events
router.post('/', (req, res) => {
    const body = req.body;
    console.log('Received POST:', JSON.stringify(body, null, 2));
  
    // Handle real Messenger events
    if (body.object === 'page') {
      console.log('Messenger event:', JSON.stringify(body, null, 2));
      res.sendStatus(200);
      return;
    }
  
    // Handle Facebook's sample/test events
    if (body.field === 'messages' && body.value) {
      console.log('Sample message event from Facebook:', JSON.stringify(body.value, null, 2));
      res.sendStatus(200);
      return;
    }
  
    // Unknown event type
    console.log('Unknown event type:', JSON.stringify(body, null, 2));
    res.sendStatus(200);
  });

module.exports = router;