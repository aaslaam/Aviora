import mongoose from "mongoose";

// messages model
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String },
    image: { type: String },
    audio: { type: String },
    audioDuration: { type: Number },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;