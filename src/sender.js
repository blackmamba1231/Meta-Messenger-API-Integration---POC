/**
 * Message Sender for Meta Messenger API
 * Handles sending messages to users via the Graph API
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();
const GRAPH_API_URL = 'https://graph.facebook.com/v20.0/me/messages';


async function callSendAPI(recipientId, messageData) {
  try {
    const requestBody = {
      recipient: {
        id: recipientId
      },
      message: messageData
    };

    const url = `${GRAPH_API_URL}?access_token=${process.env.PAGE_ACCESS_TOKEN}`;
    
    console.log('Sending message to Facebook API:');
    console.log(JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post(url, requestBody);
    
    console.log('Message sent successfully:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error sending message to Facebook API:');
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}

router.post('/', async (req, res) => {
  try {
    const recipientId = req.body.recipient_id || process.env.TEST_RECIPIENT_PSID;
    
    const messageText = req.body.text || 'Hello from my bot';
    
    if (!recipientId) {
      console.error('No recipient ID provided and TEST_RECIPIENT_PSID not set in .env');
      return res.status(400).json({
        success: false,
        error: 'No recipient ID provided. Either send recipient_id in the request body or set TEST_RECIPIENT_PSID in .env'
      });
    }
    
    // Send the message
    const messageData = {
      text: messageText
    };
    
    const result = await callSendAPI(recipientId, messageData);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: result
    });
  } catch (error) {
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      details: error.message
    });
  }
});

module.exports = router;