const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports.generateDescription = async (title) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Write a catchy Airbnb-style description for "${title}" in 2-3 lines.`,
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("AI Error:", err.code);

    
    return `${title} is a wonderful place offering comfort, great location, and a memorable stay experience. Perfect for travelers looking for relaxation and convenience.`;
  }
}

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const result = await model.embedContent(text);

  return result.embedding.values;
}

module.exports = { getEmbedding };