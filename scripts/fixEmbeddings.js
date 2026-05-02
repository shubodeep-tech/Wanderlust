require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { getEmbedding } = require("../services/embedding.service");

async function fixEmbeddings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const listings = await Listing.find();

    for (let l of listings) {
      const text = `${l.title} ${l.description} ${l.location} ${l.category}`;

      const embedding = await getEmbedding(text);

      if (!embedding || embedding.length === 0) {
        console.log("Failed:", l._id);
        continue;
      }

      await Listing.updateOne(
        { _id: l._id },
        { $set: { embedding: embedding } }
      );

      console.log("Updated:", l._id);
    }

    console.log("All embeddings updated");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixEmbeddings();