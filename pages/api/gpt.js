import * as slackApp from '../../slack/slack_app.js'

import { Configuration, OpenAIApi } from "openai"

const markdownLanguageRegex = /(```)([a-z]+)(\s+.+?\s+```)/gis

async function waitForObject(object) {
    let timeout = 60000 // 1 minute in ms
    let startTime = Date.now()
    while (object == null && (Date.now() - startTime) < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }
}

export default async function handler(req, res) {
    if (!slackApp.app) {
        await waitForObject(slackApp.app)

        if (!slackApp.app) {
            res.end()
            return
        }
    }

    slackApp.app.client.chat.update({
        channel: req.body.channel,
        ts: req.body.ts,
        text: "......"
    })

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

        gptResponse = gptResponse.replace(markdownLanguageRegex, "$1$3")
        gptResponse = gptResponse.replaceAll("**", "*")

        if (gptResponse.startsWith(".\n")) {
            gptResponse = gptResponse.split(".\n")[1]
        }

        await slackApp.app.client.chat.update({
            channel: req.body.channel,
            ts: req.body.ts,
            text: gptResponse
        })
    }

    res.end()
}