import { Configuration, OpenAIApi } from "openai"

import { WebClient } from '@slack/web-api'

const markdownLanguageRegex = /(```)([a-z]+)(\s+.+?\s+```)/gis

export default async function handler(req, res) {
    const web = new WebClient(process.env.SLACK_BOT_TOKEN)

    // await web.chat.update({
    //     channel: req.body.channel,
    //     ts: req.body.ts,
    //     text: "......"
    // })

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

        // await web.chat.update({
        //     channel: req.body.channel,
        //     ts: req.body.ts,
        //     text: gptResponse
        // })

        await web.chat.postMessage({
            channel: req.body.channel,
            text: gptResponse
        })
    }

    res.end()
}