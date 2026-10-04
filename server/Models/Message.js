import mongoose from mongoose

// messages model
const messageSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,  ref:"User",required:true},
    recieverId:{type:mongoose.Schema.Types.ObjectId,  ref:"User",required:true},
    text:{type:string,},
    image:{type:string},
    seen:{type:Boolean,default:false},
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema)

export default Message