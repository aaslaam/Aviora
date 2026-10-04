import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { ConnectDB } from "./lib/db.js";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "5mb" }));
app.use(cors());

app.get("/api/status", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;

await ConnectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});