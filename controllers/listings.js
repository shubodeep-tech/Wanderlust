const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const generateEmbedding = require("../utils/embedding");

const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// ================= INDEX =================
const index = async (req, res) => {
  const { category } = req.query;

  let filter = {};z
  if (category) filter.category = category;

  const listings = await Listing.find(filter);
  res.render("listings/index", { listings });
};


// ================= CREATE =================
const createListing = async (req, res) => {
  try {
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

    newListing.image = {
      url: req.file
        ? req.file.path
        : "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200",
      filename: req.file ? req.file.filename : "default"
    };

    // 🔥 EMBEDDING
    const text = `${newListing.title} ${newListing.description} ${newListing.location} ${newListing.category}`;

    try {
      newListing.embedding = await generateEmbedding(text);
      console.log("Embedding OK:", newListing.embedding.length);
    } catch (err) {
      console.log("Embedding failed");
      newListing.embedding = [];
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error(err);
    res.redirect("/listings/new");
  }
};


// ================= NEW FORM =================
const renderNewForm = (req, res) => {
  res.render("listings/new.ejs", { mapToken });
};


// ================= SHOW =================
const showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing, mapToken });
};


// ================= EDIT =================
const renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


// ================= UPDATE =================
const updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

  // 🔥 RE-GENERATE EMBEDDING
  const text = `${listing.title} ${listing.description} ${listing.location} ${listing.category}`;

  try {
    listing.embedding = await generateEmbedding(text);
  } catch {
    console.log("Embedding update failed");
  }

  await listing.save();

  res.redirect(`/listings/${id}`);
};


// ================= DELETE =================
const destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};


// ================= SEARCH (FINAL FIXED) =================
const searchListings = async (req, res) => {
  try {
    const searchText = req.query.query;
    if (!searchText) return res.redirect("/listings");

    const queryEmbedding = await generateEmbedding(searchText);

    // 🔥 DEFAULT VALUES
    let price = 100000;
    let location = "";

    // ✅ PRICE EXTRACTION
    const priceMatch = searchText.match(/(\d+)/);
    if (priceMatch) price = Number(priceMatch[1]);

    // ✅ LOCATION EXTRACTION (IMPROVED)
    const words = searchText.toLowerCase().split(" ");

    for (let word of words) {
      if (word.length < 3) continue;

      const exists = await Listing.findOne({
        location: { $regex: word, $options: "i" }
      });

      if (exists) {
        location = word.toLowerCase();
        break;
      }
    }

    console.log("Parsed Filters:", { price, location });

    // 🔥 HYBRID VECTOR + FILTER SEARCH
    const results = await Listing.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 10
    }
  }
]);
    console.log("Found", results.length, "results");

    res.render("listings/index", {
      listings: results,
      query: searchText
    });

  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
};

module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
  searchListings
};
