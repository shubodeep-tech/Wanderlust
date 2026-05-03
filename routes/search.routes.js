const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");
const wrapAsync = require("../utils/wrapAsync"); 


router.get("/", wrapAsync(searchController.searchListings)); 

module.exports = router;