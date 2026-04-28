async function parseQuery(query, Listing) {
  query = query.toLowerCase();

  let filters = {};

  // CATEGORY
  if (query.includes("villa")) filters.category = "villa";
  if (query.includes("hotel")) filters.category = "hotel";

  // PRICE
  const priceMatch = query.match(/under (\d+)/);
  if (priceMatch) {
    filters.price = { $lte: Number(priceMatch[1]) };
  }

  if (query.includes("cheap") || query.includes("lowest")) {
    filters.sortPrice = 1;
  }

  if (query.includes("expensive") || query.includes("luxury")) {
    filters.sortPrice = -1;
  }

  // RATING
  const ratingMatch = query.match(/(\d) star/);
  if (ratingMatch) {
    filters.rating = { $gte: Number(ratingMatch[1]) };
  }

 
  const words = query.split(" ");

  for (let word of words) {
    const exists = await Listing.findOne({
      location: { $regex: new RegExp(`^${word}$`, "i") }
    });

    if (exists) {
      filters.location = word;
      break;
    }
  }

  return filters;
}

module.exports = { parseQuery };