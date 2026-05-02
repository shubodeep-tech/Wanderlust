const aiService = require("../services/ai.service");

module.exports.generateDesc = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const description = await aiService.generateDescription(title);

    res.json({ description });
  } catch (err) {
    console.error("AI ERROR:", err);

    res.status(500).json({
      description: "Nice place with great comfort and amazing stay experience.",
    });
  }
};