import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { ConnectDB } from "./lib/db.js";
import { userRouter } from "./Routes/userRoutes.js";
import { msgsRouter } from "./Routes/msgsRoter.js";

const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users {userId: socketId}
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Socket disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", msgsRouter);

app.get("/api/status", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;

await ConnectDB();
if(process.env.NODE_ENV !== "production"){
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
// export vercel
export default server