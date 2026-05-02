const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type : String,
    required : true,
  },
  description: String,
  image: {
    url : String,
    filename :String,
  },
  price: Number,
  location: String,
  country: String,

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
 geometry: {
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], 
    required: true
  }
},
 category: {
    type: String,
   enum: [
     "trending",
      "rooms",
      "iconic_cities",
      "mountains",
      "castles",
      "beaches",
      "farms",
      "camping",
      "arctic",
      "luxury",
      "nature",
      "lake"
  ],
    required: true, 
  },
   embedding: {
  type: [Number],
},

});


listingSchema.pre("save", async function (next) {
  if (!this.embedding || this.embedding.length === 0) {
    const generateEmbedding = require("../utils/embedding");

    const text = `${this.title} ${this.description} ${this.location} ${this.category}`;

    this.embedding = await generateEmbedding(text);
  }
  next();
});

module.exports = mongoose.model("Listing", listingSchema);