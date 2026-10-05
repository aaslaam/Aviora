import  express from "express";

import { protectRoute } from "../middlewear/auth.js";
import { markMsgAsSeen,getUsersForSidebar,getMsgs } from "../controllers/messageController.js";

const msgsRouter = express.Router()

msgsRouter.post("/users",protectRoute,getUsersForSidebar)
msgsRouter.post("/:id",protectRoute,getMsgs)
msgsRouter.put("mark/:id",protectRoute,markMsgAsSeen)

export default msgsRouter
