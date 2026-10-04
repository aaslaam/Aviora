import mongoose from "mongoose";
export const ConnectDB = async () => {
    try {
        mongoose.connection.on('connected',()=>{
            console.log("DB connected");
            
        })
        await mongoose.connect(`${process.env.MONGO_URI}/chat-app`);
    } catch (error) {
        console.log(error);
    }

}