import { Configuration, OpenAIApi } from "openai"

import { App } from "@slack/bolt"

export default async function handler(req, res) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })

    const openai = new OpenAIApi(configuration)

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        echo: false
    })

    if (response && response.data && response.data.choices && response.data.choices.length > 0) {
        let gptResponse = response.data.choices[0].text.trim()

        const app = new App({
            token: process.env.SLACK_BOT_TOKEN,
            receiver: receiver,
            developerMode: false,
        })

        await app.client.chat.postMessage({
            channel: res.body.channel,
            text: gptResponse
        })
    }

    res.status(200).json(null)
}