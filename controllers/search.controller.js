const Listing = require("../models/listing");
const { getEmbedding } = require("../services/embedding.service");
const { parseQuery } = require("../services/queryParser.service");

module.exports.searchListings = async (req, res) => {
  try {
    const { query } = req.query;

    
    const filters = await parseQuery(query, Listing);

  
    const embedding = await getEmbedding(query);
let mongoFilter = {};

if (filters.price) mongoFilter.price = filters.price;
if (filters.category) mongoFilter.category = filters.category;

if (filters.location) {
  mongoFilter.location = {
    $regex: filters.location,
    $options: "i"
  };
}

if (filters.rating) mongoFilter.rating = filters.rating;
  console.log("Filters:", mongoFilter);
    // 4. Pipeline
   let pipeline = [
  {
    $vectorSearch: {
      index: "listing_vector_index",
      path: "embedding",
      queryVector: embedding,
      numCandidates: 100,
      limit: 10,
      filter: mongoFilter
    }
  },

  
  {
    $addFields: {
      score: { $meta: "vectorSearchScore" }
    }
  },

  
  {
    $sort: {
      score: -1,   // best match first
      price: 1     // cheaper first if same score
    }
  },

  
  {
    $project: {
      embedding: 0
    }
  }
];

    // 5. EXECUTE QUERY (missing before)
    const results = await Listing.aggregate(pipeline);

    // 6. Render
    res.render("listings/index", { allListings: results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
};