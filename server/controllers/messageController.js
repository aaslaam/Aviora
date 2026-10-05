import Message from "../Models/Message"

import {User }from "../Models/Users/"

// get all users except logged in user

const getUsersForSidebar = async ()=>{
    try {
    const userId =  req.user._id

    const filteredUsers = await User.find({_id}{$ne:userId}).select("-password")

    // count messages not seen

        const unSeenMsgs = {}

        const promises = filteredUsers(map(
            async (user) => {
                const msgs = await Message.find({
                    senderId:user._id,
                    recieverId:userId,
                    seen:true
                })
                if(msgs.length >0){
                    unSeenMsgs[user._id] = msgs.length
                }
            }

        ))
        await promises.all(promise)
        res.json({
            success:true,
            users:filteredUsers,
            unSeenMsgs
        })

    } catch (error) {
          console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// get all messages for selected user

export const getMsgs = async (params) => {
    try {
        const {id:selectedUserId} = req.params
        const myId = req.user._id

        const msgs = await Message.find({
            $or:[
                {senderId:myId,recieverId:selectedUserId},
                {senderId:selectedUserId,recieverId:myId}

            ]
        })
        await Message.updateMany({senderId:selectedUserId,recieverId:myId},{seen:true})
        res.json({success:true,msgs})
    } catch (error) {
          console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}
// api to mark  msgs seen using msg id

export const markMsgAsSeen = async (req,res) => {
    try {
        const {id} = req.params
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
         console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

