const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true, // ✅ fixed
  },

  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v === "" || v === null || v === undefined
          ? "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },

  price: Number,
  location: String,
  country: String,
});

module.exports = mongoose.model("Listing", listingSchema);