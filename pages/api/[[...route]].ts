import { Configuration, OpenAIApi } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

import { App } from '@slack/bolt';
import NextConnectReceiver from 'utils/NextConnectReceiver';
import axios from 'axios'

const receiver = new NextConnectReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || 'invalid',
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true,
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver,
  developerMode: false,
});

app.event('message', async ({ event, say }) => {
  const text = (event as any).text;

  if (text.startsWith("gpt ")) {
    let message: string = text.split("gpt ")[1];

    axios.post('https://nextjs-slack-bolt.vercel.app/api/gpt', {
      prompt: message,
      channel: event.channel
    })

    await say({
      text: "Please wait...",
    });
  }
});

// this is run just in case
const router = receiver.start();

router.get('/api', (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    test: true,
  });
})

export default router;
