const express = require("express");
const multer = require("multer");
const router = express.Router();
const movieController = require("../controllers/movieController");

const storage = multer.diskStorage({
  destination: "public/movies",
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Index
router.get("/", movieController.index);

// Show
router.get("/:id", movieController.show);

//Create Review
router.post("/:id/reviews", movieController.createReview);

//store
router.post("/", upload.single("image"), movieController.store);

// Destroy
router.delete("/:id", movieController.destroy);

module.exports = router;
