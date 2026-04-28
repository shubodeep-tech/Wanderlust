const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.post("/generate-description", aiController.generateDesc);

module.exports = router;