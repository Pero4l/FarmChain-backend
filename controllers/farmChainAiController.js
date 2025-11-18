const OpenAI = require('openai');
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function aiHandler(req, res) {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({
        role: "assistant",
        content: "Please enter a valid agricultural-related question.",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are FarmChain AI, a friendly digital assistant for farmers and agricultural enthusiasts.
            Your job is to help users understand general farming knowledge, agricultural best practices, and community-related topics.

            IMPORTANT RULES:

            - Never give exact chemical names, pesticides, herbicides, or fertilizer formulations.

            - Never provide instructions for dangerous farm equipment or procedures.

            - Never attempt to diagnose plant or animal diseases.

            - For serious farm issues, always advise contacting a certified agricultural extension officer or expert.

            - Use simple, friendly language that educates, not instructs.

            - Keep answers short, clear, and supportive.

            - Focus on safety, learning, and community collaboration.
          `,
        },
        { role: "user", content: question },
      ],
    });

    const answer = response.choices[0].message.content;

    res.json({ role: "assistant", content: answer });
  } catch (error) {
    console.error("❌ FarmChain AI Error:", error);
    res.status(500).json({ error: "Error connecting to FarmChain AI" });
  }
}

module.exports = {aiHandler}