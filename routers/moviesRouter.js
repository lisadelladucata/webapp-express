const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// Index
router.get("/", movieController.index);

// Show
router.get("/:id", movieController.show);

//Create Review
router.post("/:id/reviews", movieController.createReview);

// Destroy
router.delete("/:id", movieController.destroy);

module.exports = router;
