import * as slackApp from '../../slack/slack_app.js'

import axios from 'axios'

slackApp.createSlackApp()

slackApp.app.event('message', async ({ event, say }) => {
  let message = event.text

  if (!message) {
    return
  }

  message += "\r\nYou must use markdown when showing me code"

  
  axios.post('https://nextjs-slack-bolt.vercel.app/api/gpt', {
    prompt: message,
    channel: event.channel
  })
  
  // await say({
  //   text: ""
  // })

  // await slackApp.app.client.chat.postEphemeral({
  //   token: process.env.SLACK_BOT_TOKEN,
  //   channel: event.channel,
  //   user: event.user,
  //   text: "Loading"
  // })

  await new Promise(resolve => setTimeout(resolve, 500))
})

// this is run just in case
const router = slackApp.receiver.start()

router.get('/api', (req, res) => {
  res.status(200).json({
    test: true,
  })
})

export default router
