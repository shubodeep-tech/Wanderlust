const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { getEmbedding } = require("../services/embedding.service");
const { parseQuery } = require("../services/queryParser.service");

const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const redisClient = require("../utils/redis");


module.exports.index = async (req, res) => {
  const { q } = req.query;

  try {
    if (q && q.trim() !== "") {
  console.log("🤖 Semantic Search:", q);

  const filters = await parseQuery(q, Listing);
  const embedding = await getEmbedding(q);

  let mongoFilter = {};

  if (filters.price) mongoFilter.price = filters.price;
  if (filters.category) mongoFilter.category = filters.category;

  if (filters.location) {
    mongoFilter.location = filters.location.toLowerCase();
  }

  if (filters.rating) mongoFilter.rating = filters.rating;

  let results = await Listing.aggregate([
    {
      $vectorSearch: {
        index: "listing_vector_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 100,
        limit: 20,
        filter: mongoFilter,
      },
    },
    {
      $addFields: {
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $sort: {
        score: -1,
        price: 1,
      },
    },
  ]);

  // ✅ FALLBACK
  if (results.length === 0) {
    console.log("⚠️ No filtered results, using fallback");

    results = await Listing.aggregate([
      {
        $vectorSearch: {
          index: "listing_vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 20,
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ]);
  }

  
  return res.render("listings/index", {
    allListings: results,
    query: q,
    filters,
  });
}

  

    const allListings = await Listing.find({});

    return res.render("listings/index", {
      allListings: allListings,   
      query: "",                  
      filters: {}               
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs", { mapToken: process.env.MAPBOX_TOKEN });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing, mapToken: process.env.MAPBOX_TOKEN });
};

module.exports.createListing = async (req, res) => {
  const geoResponse = await geocodingClient
    .forwardGeocode({ query: req.body.listing.location, limit: 1 })
    .send();
  if (!geoResponse.body.features.length) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.location = newListing.location.toLowerCase();

  newListing.geometry = geoResponse.body.features[0].geometry;
  if (req.file) {
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };
} else {
  newListing.image = {
    url: "https://via.placeholder.com/400",
    filename: "default",
  };
}

  // 🔥 Generate embedding BEFORE saving
const text = `${newListing.title} ${newListing.description} ${newListing.location} ${newListing.category}`;

const embedding = await getEmbedding(text);

newListing.embedding = embedding;

// Save
await newListing.save();
  // 🔥 CLEAR CACHE HERE
await redisClient.del("listings:all");
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }
  
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.semanticSearch = async (req, res) => {
  const { q, maxPrice, category, location } = req.query;
  if (!q || !q.trim()) return res.redirect("/listings");

  const queryEmbedding = await getEmbedding(q);

  const matchFilter = {};
  if (maxPrice) matchFilter.price = { $lte: Number(maxPrice) };
  if (category) matchFilter.category = category;
  if (location) matchFilter.location = new RegExp(location, "i");

  const results = await Listing.aggregate([
    {
      $vectorSearch: {
        index: "listing_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 50,
        filter: matchFilter
      },
    },
    { $match: matchFilter },
    {
      $project: {
        title: 1, description: 1, image: 1,
        price: 1, location: 1, country: 1,
        category: 1, geometry: 1, owner: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  res.render("listings/index", { allListings: results });
};

