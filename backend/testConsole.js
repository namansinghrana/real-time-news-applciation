const { io } = require("socket.io-client");

const socket = io("http://localhost:5000"); // Socket.io Client

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket server");

  // Subscribe to a category
  socket.emit("subscribe", { userId: "12345", category: "Tech" });
});

socket.on("new-news", (news) => {
  console.log("📩 Received News:", news);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from WebSocket server");
});
