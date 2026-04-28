const aiService = require("../services/ai.service");

module.exports.generateDesc = async (req, res) => {
  try {
    const { title } = req.query;

    const description = await aiService.generateDescription(title);

    res.json({ description });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate description" });
  }
};