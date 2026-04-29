const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const rateLimit = require("express-rate-limit");


const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: "Too many requests. Try again later."
  }
});


router.post(
  "/generate-description",
  isLoggedIn,
  aiLimiter,
  wrapAsync(aiController.generateDesc) 
);

module.exports = router;