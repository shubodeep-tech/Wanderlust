const Listing = require("../models/listing");
const { getEmbedding } = require("../services/embedding.service");
const { parseQuery } = require("../services/queryParser.service");

const VALID_CATEGORIES = [
  "trending", "rooms", "iconic_cities", "mountains",
  "castles", "beaches", "farms", "camping",
  "arctic", "luxury", "nature", "lake"
];

module.exports.searchListings = async (req, res) => {
  try {
    const { query } = req.query;
    const filters = await parseQuery(query, Listing);
    const embedding = await getEmbedding(query);

    console.log("Parsed Filters:", filters);

    
    if (filters.category && !VALID_CATEGORIES.includes(filters.category)) {
      delete filters.category;
    }

    let vectorFilter = {};
    if (filters.price) vectorFilter.price = filters.price;

    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 150,
          limit: 50,
          ...(Object.keys(vectorFilter).length && { filter: vectorFilter }),
        },
      },
      { $addFields: { score: { $meta: "vectorSearchScore" } } },
      ...(filters.location
        ? [{ $match: { location: { $regex: filters.location, $options: "i" } } }]
        : []),
      ...(filters.category
        ? [{ $match: { category: filters.category } }]
        : []),
      { $sort: { score: -1, price: 1 } },
      { $limit: 10 },
      { $project: { embedding: 0 } },
    ];

    const results = await Listing.aggregate(pipeline);
    console.log(`Found ${results.length} results`);

    res.render("listings/index", {
      listings: results,
      query: query || "",
    });

  } catch (err) {
    console.error(err);
    res.render("listings/index", {
      listings: [],
      query: req.query.query || "",
    });
  }
};