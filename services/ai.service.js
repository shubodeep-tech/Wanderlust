const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    console.error("AI Error:", err.code);
    return `${title} is a wonderful place offering comfort and a memorable stay.`;
  }
};

module.exports = { generateDescription };