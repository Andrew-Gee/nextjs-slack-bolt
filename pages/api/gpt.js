import { Configuration, OpenAIApi } from "openai"

export default async function handler(req, res) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })

    const openai = new OpenAIApi(configuration)

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.query.prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        echo: true
    })


    if (response && response.data && response.data.choices && response.data.choices.length > 0) {
        res.status(200).json(response.data.choices[0].text.trim())
        return
    }

    res.status(200).json(null)
}