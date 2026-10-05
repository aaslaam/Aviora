import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import { ConnectDB } from "./lib/db.js";
import {userRouter}  from "./Routes/userRoutes.js"
import {msgsRouter}  from "./Routes/msgsRoter.js"

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "5mb" }));
app.use(cors());
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