import * as slackApp from '../../slack/slack_app.js';

import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios'

slackApp.createSlackApp();


slackApp.app.event('message', async ({ event, say }: { event: any; say: any }) => {
  const text = (event as any).text;

  if (text.startsWith("gpt ")) {
    let message: string = text.split("gpt ")[1];

    let slackMessage = await slackApp.app.client.chat.postMessage({
      channel: event.channel,
      text: "Please wait..."
    });

    axios.post('https://nextjs-slack-bolt.vercel.app/api/gpt', {
      prompt: message,
      channel: event.channel,
      ts: slackMessage.ts
    });

  }
});

// this is run just in case
const router = slackApp.receiver.start();

router.get('/api', (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    test: true,
  });
})

export default router;
