import express from "express";

import { protectRoute } from "../middlewear/auth.js";
import { markMsgAsSeen, getUsersForSidebar, getMsgs, sendMsgs } from "../controllers/messageController.js";

export const msgsRouter = express.Router();

msgsRouter.get("/users", protectRoute, getUsersForSidebar);
msgsRouter.get("/:id", protectRoute, getMsgs);
msgsRouter.put("/mark/:id", protectRoute, markMsgAsSeen);
msgsRouter.post("/send/:id", protectRoute, sendMsgs);

export default msgsRouter;