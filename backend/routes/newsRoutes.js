const express = require("express");
const {
  getAllNews,
  getTrendingNews,
  postNewsArticle,
  subscribeToCategory
} = require("../controllers/newsController");

const router = express.Router();

router.get("/", getAllNews);
router.get("/trending", getTrendingNews);
router.post("/", postNewsArticle);
router.post("subscribe", subscribeToCategory);
module.exports = router;
