const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { getEmbedding } = require("../services/embedding.service");
const { parseQuery } = require("../services/queryParser.service");

const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



const index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};
//  NEW FORM 
const renderNewForm = (req, res) => {
  res.render("listings/new.ejs", { mapToken });
};

// SHOW
const showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

    
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing, mapToken });
};

// CREATE 
const createListing = async (req, res) => {
  try {

    if (!req.user) {
      req.flash("error", "Login required");
      return res.redirect("/login");
    }

    if (!req.body.listing.category) {
      req.flash("error", "Select a category");
      return res.redirect("/listings/new");
    }

    const geoResponse = await geocodingClient
      .forwardGeocode({ query: req.body.listing.location, limit: 1 })
      .send();

    if (!geoResponse.body.features.length) {
      req.flash("error", "Invalid location");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.location = req.body.listing.location.trim().toLowerCase();
    newListing.category = req.body.listing.category.toLowerCase();
    newListing.geometry = geoResponse.body.features[0].geometry;

    newListing.image = {
      url: req.file
        ? req.file.path
        : "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      filename: req.file ? req.file.filename : "default"
    };

    const text = `${newListing.title} ${newListing.description} ${newListing.location} ${newListing.category}`;
    newListing.embedding = await getEmbedding(text);

    await newListing.save();

    req.flash("success", "Listing Created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
};

//EDIT FORM
const renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//  UPDATE 
const updateListing = async (req, res) => {
  const { id } = req.params;

const listing = await Listing.findByIdAndUpdate(
  id,
  { ...req.body.listing },
  { new: true, runValidators: true }
);

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }

  // Re-generate embedding on update
  const text = `${listing.title} ${listing.description} ${listing.location} ${listing.category}`;
  listing.embedding = await getEmbedding(text);

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

module.exports = {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
};
