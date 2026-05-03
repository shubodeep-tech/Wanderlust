const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const User = require("../models/user");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

// ✅ only allow real image types
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"), false);
  }
};

const upload = multer({ storage, fileFilter }); // ✅ fileFilter added

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/wishlist", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("listings/wishlist", { listings: user.wishlist });
});

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

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