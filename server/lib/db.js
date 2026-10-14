import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (error) {
    process.exit(1);
  }
};
