const { pipeline } = require("@xenova/transformers");

let embedderPromise = null;

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2").then((m) => {
      console.log(" Embedding model loaded");
      return m;
    });
  }
  return embedderPromise;
}

async function getEmbedding(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

module.exports = { getEmbedding };