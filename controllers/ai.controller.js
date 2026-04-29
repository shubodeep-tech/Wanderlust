const aiService = require("../services/ai.service");

module.exports.generateDesc = async (req, res) => {
  try {
    const { title } = req.body;

    const description = await aiService.generateDescription(title);

    res.json({ description });
  } catch (err) {
    console.error("❌ AI ERROR:", err);
    

  }
};