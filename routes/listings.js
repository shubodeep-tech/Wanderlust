const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const User = require("../models/user");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
console.log("isLoggedIn:", typeof isLoggedIn);
console.log("validateListing:", typeof validateListing);
console.log("createListing:", typeof listingController.createListing);
console.log("index:", typeof listingController.index);
console.log("upload:", typeof upload.single);

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

// WISHLIST PAGE
router.get("/wishlist", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.render("listings/wishlist", {
    listings: user.wishlist,
  });
});


router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// WISHLIST ADD 
router.post("/:id/wishlist", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!user.wishlist.some((id) => id.equals(listing._id))) {
    user.wishlist.push(listing._id);
    await user.save();
  }

  req.flash("success", "Added to wishlist!");
  res.redirect(`/listings/${listing._id}`);
});


router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

  module.exports = router;