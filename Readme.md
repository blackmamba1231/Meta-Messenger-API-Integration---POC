# Meta Messenger API Integration - POC

This is a proof-of-concept (POC) integration with Meta's Messenger API, allowing you to send and receive messages via a Facebook Page. This implementation follows the requirements specified in the test project, consisting of two main microservice endpoints:

- `GET /webhook` - Verifies the webhook and echoes the hub.challenge
- `POST /send` - Sends a message to a specified user via the Graph API

## Prerequisites

1. A Facebook account
2. A Facebook Page (you can create one if you don't have one)
3. A Meta Developer account (https://developers.facebook.com/)
4. Node.js and npm installed
5. ngrok or similar tool for creating public HTTPS tunnels to your local server

## Step 1: Create a Meta Business Developer App

1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Select "Business" as the app type
4. Fill in the required information and create the app
5. From the App Dashboard, click "Add Products" in the left sidebar
6. Find "Messenger" and click "Set Up"

## Step 2: Configure Messenger Settings

1. In your app's dashboard, navigate to "Messenger" → "Settings"
2. Under "Access Tokens", click "Add or Remove Pages"
3. Select the Facebook Page you want to use and follow the prompts to connect it
4. Once connected, click "Generate Token" to create a Page Access Token
5. Copy this token and save it securely - this will be your `PAGE_ACCESS_TOKEN`

## Step 3: Test the Graph API Connection

1. Go to the Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Select your app from the dropdown at the top right
3. Select your page from the "User or Page" dropdown
4. Set the version to v20.0
5. Enter `/me/messages` in the path field
6. Click "Submit" - you should get a 200 OK response

Alternatively, you can use curl or Postman to test the API:

```bash
curl -X POST \
  https://graph.facebook.com/v20.0/me/messages \
  -H 'Content-Type: application/json' \
  -d '{
    "recipient": {
      "id": "YOUR_RECIPIENT_PSID"
    },
    "message": {
      "text": "Hello from curl!"
    }
  }' \
  -G \
  -d access_token=YOUR_PAGE_ACCESS_TOKEN
```

## Step 4: Set Up This Application

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Update the `.env` file with your credentials:

```
# Meta API Credentials
PAGE_ACCESS_TOKEN=your_page_access_token_here
VERIFY_TOKEN=choose_a_random_string_for_verification
APP_ID=your_app_id_here
APP_SECRET=your_app_secret_here

# Test PSID (Page-Scoped ID for testing)
TEST_RECIPIENT_PSID=your_test_psid_here

# Server Configuration
PORT=3000
```

**Note**: For `VERIFY_TOKEN`, you can choose any random string. This will be used to verify your webhook.

## Step 5: Start the Local Server

```bash
npm start
```

You should see the server running on port 3000.

## Step 6: Use ngrok to Create a Public HTTPS URL

In a new terminal, run:

```bash
ngrok http 3000
```

This will create a public HTTPS URL that forwards to your local server. Copy the HTTPS URL (e.g., `https://a1b2c3d4.ngrok.io`).

## Step 7: Configure the Webhook

1. In your app's dashboard, navigate to "Messenger" → "Settings"
2. Under "Webhooks", click "Add Callback URL"
3. Enter your ngrok URL followed by `/webhook` (e.g., `https://a1b2c3d4.ngrok.io/webhook`)
4. Enter your `VERIFY_TOKEN` from the `.env` file
5. Click "Verify and Save"
6. After verification, select your page and subscribe to the "messages" field

## Step 8: Test the Integration

### Testing the Webhook

1. Send a message to your Facebook Page using your personal Facebook account
2. Check your server logs - you should see the incoming message event logged

### Testing the Send Endpoint

Use curl or Postman to send a message:

```bash
curl -X POST \
  http://localhost:3000/send \
  -H 'Content-Type: application/json' \
  -d '{
    "recipient_id": "YOUR_TEST_PSID",
    "text": "Hello from my bot!"
  }'
```

Or if you've set `TEST_RECIPIENT_PSID` in your `.env` file, you can simply run:

```bash
curl -X POST http://localhost:3000/send
```

## How to Get a User's PSID

The Page-Scoped ID (PSID) is a unique identifier for a user who interacts with your page. To get someone's PSID:

1. Have them send a message to your Facebook Page
2. The webhook will receive an event with the sender's PSID
3. Check your server logs - you'll see "Sender PSID: [the_psid]" printed
4. Use this PSID for testing the `/send` endpoint

## Completing the Test Project

To demonstrate successful completion of the test project, record a video showing:

1. Your Meta Developer App setup with Messenger integration
2. The page connection and generation of the Page Access Token
3. Testing the Graph API with the Explorer or Postman
4. Running your local server and setting up ngrok
5. Configuring the webhook in the Meta Developer dashboard
6. Sending a message to your page and showing the webhook logs
7. Using the `/send` endpoint to send a reply
8. Showing the end-to-end flow: personal account → page → webhook logs → /send reply → page responds in Messenger

## Additional Resources

- [Meta Messenger Platform Documentation](https://developers.facebook.com/docs/messenger-platform/)
- [Webhook Reference](https://developers.facebook.com/docs/messenger-platform/webhook)
- [Send API Reference](https://developers.facebook.com/docs/messenger-platform/reference/send-api/)
#
