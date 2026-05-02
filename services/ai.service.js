const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDescription = async (title) => {
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
  console.error("❌ AI ERROR:", err);

  return res.status(500).json({
    description: "Nice place with great comfort and amazing stay experience."
  });
}
};

const getEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

module.exports = { generateDescription, getEmbedding };
