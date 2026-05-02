async function parseQuery(query, Listing) {
  query = query.toLowerCase();
  let filters = {};

  if (query.includes("mountain"))                        filters.category = "mountains";
  if (query.includes("beach"))                           filters.category = "beaches";
  if (query.includes("luxury"))                          filters.category = "luxury";
  if (query.includes("castle"))                          filters.category = "castles";
  if (query.includes("farm"))                            filters.category = "farms";
  if (query.includes("camp"))                            filters.category = "camping";
  if (query.includes("arctic"))                          filters.category = "arctic";
  if (query.includes("lake"))                            filters.category = "lake";
  if (query.includes("nature"))                          filters.category = "nature";
  if (query.includes("room"))                            filters.category = "rooms";
  if (query.includes("trending"))                        filters.category = "trending";
  if (query.includes("city") || query.includes("urban")) filters.category = "iconic_cities";

  const priceMatch = query.match(/under (\d+)/);
  if (priceMatch) filters.price = { $lte: Number(priceMatch[1]) };

  const words = query.split(" ");
  for (let word of words) {
    if (word.length < 3) continue;
    const exists = await Listing.findOne({
      location: { $regex: new RegExp(word, "i") },
    });
    if (exists) {
      filters.location = word;
      break;
    }
  }

  return filters;
}

module.exports = { parseQuery };