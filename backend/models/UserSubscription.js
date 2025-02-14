const mongoose = require("mongoose");

const UserSubscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },  // Unique identifier for the user
  subscribedCategories: [{ type: String, enum: ["Tech", "Business", "Sports"], required: true }],
});

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema);
