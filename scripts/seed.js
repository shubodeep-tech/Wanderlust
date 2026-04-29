if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { getEmbedding } = require("../services/embedding.service");

const sampleListings = [
  {
    title: "Goa Beach Villa",
    description: "Beautiful beachfront villa with stunning ocean views and private pool",
    price: 5000,
    location: "goa",
    country: "India",
    category: "beaches",
    image: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [73.8278, 15.4989] }
  },
  {
    title: "Manali Mountain Retreat",
    description: "Cozy wooden cottage with breathtaking Himalayan views and fireplace",
    price: 7500,
    location: "manali",
    country: "India",
    category: "mountains",
    image: {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [77.1887, 32.2396] }
  },
  {
    title: "Manali Snow Villa",
    description: "Luxury stay with snow capped peaks, perfect for adventure lovers",
    price: 6000,
    location: "manali",
    country: "India",
    category: "mountains",
    image: {
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [77.1887, 32.2396] }
  },
  {
    title: "Delhi Luxury Suite",
    description: "Modern luxury suite in the heart of New Delhi near India Gate",
    price: 12000,
    location: "delhi",
    country: "India",
    category: "iconic_cities",
    image: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [77.2090, 28.6139] }
  },
  {
    title: "Mumbai Sea View Room",
    description: "Elegant room overlooking the Arabian Sea with rooftop access",
    price: 8000,
    location: "mumbai",
    country: "India",
    category: "rooms",
    image: {
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [72.8777, 19.0760] }
  },
  {
    title: "Kerala Backwater Farm",
    description: "Peaceful farm stay surrounded by coconut trees and backwaters",
    price: 3500,
    location: "kerala",
    country: "India",
    category: "farms",
    image: {
      url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [76.2711, 10.8505] }
  },
  {
    title: "Jaisalmer Desert Camp",
    description: "Authentic desert camping experience under the stars in Thar desert",
    price: 4000,
    location: "jaisalmer",
    country: "India",
    category: "camping",
    image: {
      url: "https://images.unsplash.com/photo-1537565266759-34c8a919c26d?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [70.9083, 26.9157] }
  },
  {
    title: "Udaipur Lake Palace",
    description: "Royal heritage palace stay with lake views and Rajasthani cuisine",
    price: 25000,
    location: "udaipur",
    country: "India",
    category: "luxury",
    image: {
      url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [73.6833, 24.5854] }
  },
  {
    title: "Coorg Nature Cottage",
    description: "Misty forest cottage surrounded by coffee plantations and wildlife",
    price: 4500,
    location: "coorg",
    country: "India",
    category: "nature",
    image: {
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [75.8069, 12.4244] }
  },
  {
    title: "Goa Luxury Beach Resort",
    description: "5-star beachfront resort with infinity pool and spa in North Goa",
    price: 15000,
    location: "goa",
    country: "India",
    category: "luxury",
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      filename: "default"
    },
    geometry: { type: "Point", coordinates: [73.7463, 15.5524] }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");

    await Listing.deleteMany({});
    console.log("🗑️  Cleared old listings");

    for (let data of sampleListings) {
      const listing = new Listing(data);
      const text = `${listing.title} ${listing.description} ${listing.location} ${listing.category}`;
      listing.embedding = await getEmbedding(text);
      await listing.save();
      console.log(" Seeded:", listing.title);
    }

    console.log("\n🎉 All listings seeded with embeddings!");
    process.exit(0);
  } catch (err) {
    console.error(" Error:", err);
    process.exit(1);
  }
}

seed();