import express from "express";
import cors from "cors";
import  "dotenv/config";
import http from "http";

const app = express();
const server = http.createServer(app);  

app.use(express.json({limit: "5mb"}));
app.use(cors());

app.use("/api/status",(req,res)=>{
    res.send("Server is running!")
})
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})