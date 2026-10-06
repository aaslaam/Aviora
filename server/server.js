import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import {server} from "socket.io"

import { ConnectDB } from "./lib/db.js";
import {userRouter}  from "./Routes/userRoutes.js"
import {msgsRouter}  from "./Routes/msgsRoter.js"

const app = express();
const server = http.createServer(app);

// intialize socket.io server

const io = new Server(server, {
    cors:{origin:"*"}
}) 

// store online users

export const userSocketMap = {

} // {userId:socketId}

// Socket.io connection hander

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId
    console.log("User Connected");

    if(useId)userSocketMap[userId] = socket.id

    // Emit online users to all clients

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    // Socket disconnection 
        socket.on("disconnect",()=>{
            console.log("User Disc");
            delete userSocketMap[userId]
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
            
        })
})

// middleWare setup
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// routes setup
app.use("/api/auth",userRouter)
app.use("/api/messages",msgsRouter)


app.get("/api/status", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;

await ConnectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});