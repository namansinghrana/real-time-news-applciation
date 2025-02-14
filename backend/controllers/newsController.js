const News = require("../models/News");

// Get all news articles
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ timestamp: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 📌 Get Trending News (Aggregation)
const getTrendingNews = async (req, res) => {
  try {
    const trendingNews = await News.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          latestArticles: { $push: "$$ROOT" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json(trendingNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Post News Article (Triggers WebSocket)
const postNewsArticle = async (req, res) => {
  try {
    const news = await News.create(req.body);

    // Emit real-time event using WebSockets
    req.io.to(news.category).emit("new-news", news);

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Subscribe to a news category
const subscribeToCategory = async (req, res) => {
  try {
    const { userEmail, category } = req.body;

    if (!userEmail || !category) {
      return res.status(400).json({ error: "Email and category are required" });
    }

    res.json({ message: `Subscribed to ${category} news successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { getAllNews, getTrendingNews, postNewsArticle, subscribeToCategory };
