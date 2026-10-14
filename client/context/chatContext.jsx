import { createContext, useContext, useEffect, useState } from "react";
import { authContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({children}) =>{
    const [msgs,SetMsgs] = useState([])
    const [users,SetUsers] = useState([])
    const [selectedUsers,SetSelectedUsers] = useState(null)
    const [unseenMsgs,SetUnseenMsgs]        = useState({})

    const {axios,socket} = useContext(authContext)

    // func to get users for sidebar 

    const getUsers = async () => {
        try {
           const {data} =  axios.get("/api/users/messages/")
            if(data.sucess){
                SetUsers(data.users)
                SetUnseenMsgs(data.unseenMsgs)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // func to get msgs for selected user

    const getMsgs = async (userId) => {
        try {
       const {data} =  await axios.get(`/api/messages/${userId}`)
            if(data.sucess){
                SetMsgs(data.messages)   
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // func send msg selected user

    const sendMsgs = async (messageData) => {
        try {
       const {data} =  await axios.get(`/api/messages/send/${selectedUsers._id}`,messageData)
            if(data.sucess){
                SetMsgs((prevMsgs)=>[...prevMsgs,data.newMessage]{

                })   
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // func subscribe to msgs from user

    const subscribeToMsgs = async (params) => {
        if(!socket) return

        socket.on("newMessage",(newMessage)=>{
            if(selectedUsers && newMessage.senderId === selectedUsers._id ){
                newMessage.seen = true
                SetMsgs((prevMsgs)=>[...prevMsgs,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }else{
                SetUnseenMsgs((prevUnseenMsgs)=>{
                    ({
                        ...prevUnseenMsgs,[newMessage.senderId]
                        :
                        prevUnseenMsgs[newMessage.senderId]
                        ?
                        prevUnseenMsgs[newMessage.senderId]+1
                        :
                        1


                       
                    })
                })
            }
        })
    }

    // func unsuscribe msgs

       const UnSubscribeFromMsgs = async (params) => {
        if(socket)socket.off("newMessage")
       }

       useEffect(()=>{
        subscribeToMsgs()
        return ()=> UnSubscribeFromMsgs()
       },[socket,selectedUsers])

        const values ={
            msgs,users,selectedUsers,getUsers,getMsgs,sendMsgs,SetSelectedUsers,unseenMsgs,SetUnseenMsgs
        }
        return(
            <ChatContext.Provider>
                {children}
            </ChatContext.Provider>
        )
}