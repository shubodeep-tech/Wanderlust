const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { getEmbedding } = require("../services/embedding.service"); // ✅ one source only

const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX
const index = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) filter.category = category;
  const listings = await Listing.find(filter);
  res.render("listings/index", { listings });
};

const renderNewForm = (req, res) => {
  res.render("listings/new", { mapToken });
};

// CREATE
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
      filename: req.file ? req.file.filename : "default",
    };

    const text = `${newListing.title} ${newListing.description} ${newListing.location} ${newListing.category}`;

    try {
      newListing.embedding = await getEmbedding(text); // ✅ using one service
      console.log("Embedding OK:", newListing.embedding.length);
    } catch (err) {
      console.error("Embedding failed on create:", err.message);
      newListing.embedding = [];
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error(err);
    req.flash("error", "Could not create listing.");
    res.redirect("/listings/new");
  }
};

// SHOW
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

// EDIT
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

// UPDATE
const updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

  // ✅ update image if a new file was uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  const text = `${listing.title} ${listing.description} ${listing.location} ${listing.category}`;

  try {
    listing.embedding = await getEmbedding(text); // ✅ using one service
  } catch (err) {
    console.error("Embedding update failed for listing:", id, err.message);
    // ✅ keep old embedding rather than setting [] — stale is better than empty
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
const destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

// SEARCH
const searchListings = async (req, res) => {
  try {
    const searchText = req.query.query;
    if (!searchText) return res.redirect("/listings");

    const queryEmbedding = await getEmbedding(searchText); // ✅ one service

    let price = 100000;
    let location = "";

    const priceMatch = searchText.match(/(\d+)/);
    if (priceMatch) price = Number(priceMatch[1]);

    const words = searchText.toLowerCase().split(" ");
    for (let word of words) {
      if (word.length < 3) continue;
      const exists = await Listing.findOne({
        location: { $regex: word, $options: "i" },
      });
      if (exists) {
        location = word.toLowerCase();
        break;
      }
    }

    const results = await Listing.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 200,
          limit: 10,
        },
      },
    ]);

    res.render("listings/index", {
      listings: results,
      query: searchText,
    });

  } catch (err) {
    console.error(err);
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
  searchListings,
};