require('dotenv').config();
const { MessageFlags } = require('discord.js');
const { Configuration, OpenAIApi, Configuration, Configuration } = require("openai");

async function callChatGPT(prompt) {

    const Configuration = new Configuration({
        apiKey: process.env.OpenAIApi(Configuration)
    });

    try {
        const openai =  new OpenAIApi(Configuration);

        const response = await openai.createChatConpletion({
            model: "gpt-3.5-turbo",
            message: [{role: "user", content: "Hello World"}],
        });
        return response.data.choices[0].message;

    } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        return null;
    }
}

module.exports = {callChatGPT}