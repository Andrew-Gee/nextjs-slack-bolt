import { App } from '@slack/bolt'
import NextConnectReceiver from 'utils/NextConnectReceiver'

let app = null
let receiver = null

function createSlackApp() {
    receiver = new NextConnectReceiver({
        signingSecret: process.env.SLACK_SIGNING_SECRET || 'invalid',
        // The `processBeforeResponse` option is required for all FaaS environments.
        // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
        // before the Bolt framework responds to the request (e.g. `ack()`). This is
        // important because FaaS immediately terminate handlers after the response.
        processBeforeResponse: true,
    })

    // Initializes your app with your bot token and the AWS Lambda ready receiver
    app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        receiver: receiver,
        developerMode: false,
    })
}

export { createSlackApp, app, receiver }