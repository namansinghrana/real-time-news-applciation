const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const newsRoutes = require("./routes/newsRoutes");
const UserSubscription = require("./models/UserSubscription"); // Import Subscription Model
const News = require("./models/News"); // ✅ Import News Model
const User = require("./models/User"); // Import User Model


dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server and WebSocket
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Attach WebSocket to request object (for controllers)
app.use((req, res, next) => {
  req.io = io;
  next();
});



// ✅ API Routes
app.post("/api/user", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({ userId }); // Create a new user if they don't exist
    await user.save();
  }

  res.status(200).json({ message: "User authenticated", user });
});

app.use("/api/news", newsRoutes);
app.get("/api/news", async (req, res) => {
  try {
    const { categories } = req.query;
    const filter = categories ? { category: { $in: categories.split(",") } } : {}; // Filter based on categories
    const news = await News.find(filter).sort({ publishedAt: -1 }).limit(10);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});


// ✅ Subscription API Routes
app.post("/api/subscribe", async (req, res) => {
  const { userId, category } = req.body;

  if (!userId || !category) return res.status(400).json({ error: "Missing userId or category" });

  let userSubscription = await UserSubscription.findOne({ userId });

  if (!userSubscription) {
    userSubscription = new UserSubscription({ userId, subscribedCategories: [] });
  }

  if (!userSubscription.subscribedCategories.includes(category)) {
    userSubscription.subscribedCategories.push(category);
    await userSubscription.save();
  }

  res.status(200).json({ message: "Subscription updated", subscribedCategories: userSubscription.subscribedCategories });
});

app.post("/api/unsubscribe", async (req, res) => {
  const { userId, category } = req.body;

  if (!userId || !category) return res.status(400).json({ error: "Missing userId or category" });

  let userSubscription = await UserSubscription.findOne({ userId });

  if (!userSubscription) return res.status(404).json({ error: "User not found" });

  userSubscription.subscribedCategories = userSubscription.subscribedCategories.filter((c) => c !== category);
  await userSubscription.save();

  res.status(200).json({ message: "Unsubscribed successfully", subscribedCategories: userSubscription.subscribedCategories });
});

app.get("/api/subscriptions/:userId", async (req, res) => {
  const { userId } = req.params;

  const userSubscription = await UserSubscription.findOne({ userId });

  if (!userSubscription) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ subscribedCategories: userSubscription.subscribedCategories });
});

// ✅ WebSocket Handling
io.on("connection", (socket) => {
  console.log("🔵 New Client Connected:", socket.id);
  // Handle subscription to category
  socket.on("subscribe", ({ userId, category }) => {
    console.log(`User ${userId} subscribed to ${category}`);
    socket.join(category);  // User joins WebSocket room for the category
  });

  socket.on("error", (err) => {
    console.error("❌ WebSocket Error:", err);
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ News Posting API (Fixed Placement)
app.post("/api/news", async (req, res) => {
  try {
    const { title, category, content } = req.body;

    const news = await News.create({ title, category, content });

    // Broadcast news only to subscribed users
    io.to(category).emit("new-news", news);

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to post news" });
  }
});

// Start Server
server.listen(5000, () => console.log("Server running on port 5000"));
