import Message from "../Models/Message.js";
import User from "../Models/Users.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // count messages not seen
        const unSeenMsgs = {};

        const promises = filteredUsers.map(async (user) => {
            const msgs = await Message.find({
                senderId: user._id,
                recieverId: userId,
                seen: false
            });
            if (msgs.length > 0) {
                unSeenMsgs[user._id] = msgs.length;
            }
        });
        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredUsers,
            unSeenMsgs
        });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// get all messages for selected user
export const getMsgs = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const msgs = await Message.find({
            $or: [
                { senderId: myId, recieverId: selectedUserId },
                { senderId: selectedUserId, recieverId: myId }
            ]
        });
        await Message.updateMany(
            { senderId: selectedUserId, recieverId: myId },
            { seen: true }
        );
        res.json({ success: true, msgs });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// api to mark msgs seen using msg id
export const markMsgAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// send Msgs to selected user
export const sendMsgs = async (req, res) => {
    try {
        const { image, text } = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMsg = await Message.create({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        // emit new msg to reciever
        const recieverSocketId = userSocketMap[recieverId];

        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMsg", newMsg);
        }

        res.json({ success: true, newMsg });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};