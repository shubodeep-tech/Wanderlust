const { getEmbedding } = require("../services/embedding.service");

async function generateEmbedding(text) {
  return await getEmbedding(text);
}

module.exports = generateEmbedding;