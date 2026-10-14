import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const [msgs, SetMsgs] = useState([])
    const [users, SetUsers] = useState([])
    const [selectedUsers, SetSelectedUsers] = useState(null)
    const [unseenMsgs, SetUnseenMsgs] = useState({})

    const { axios, socket } = useContext(AuthContext)

    // func to get users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users")
            if (data.success) {
                SetUsers(data.users)
                SetUnseenMsgs(data.unSeenMsgs || {})
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // func to get msgs for selected user
    const getMsgs = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)
            if (data.success) {
                SetMsgs(data.msgs)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // func to send msg to selected user
    const sendMsgs = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/api/messages/send/${selectedUsers._id}`,
                messageData
            )
            if (data.success) {
                SetMsgs((prevMsgs) => [...prevMsgs, data.newMsg])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // func to subscribe to msgs from user
    const subscribeToMsgs = () => {
        if (!socket) return

        socket.on("newMsg", (newMessage) => {
            if (selectedUsers && newMessage.senderId === selectedUsers._id) {
                newMessage.seen = true
                SetMsgs((prevMsgs) => [...prevMsgs, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                SetUnseenMsgs((prevUnseenMsgs) => ({
                    ...prevUnseenMsgs,
                    [newMessage.senderId]: prevUnseenMsgs[newMessage.senderId]
                        ? prevUnseenMsgs[newMessage.senderId] + 1
                        : 1
                }))
            }
        })
    }

    // func to unsubscribe from msgs
    const unSubscribeFromMsgs = () => {
        if (socket) socket.off("newMsg")
    }

    useEffect(() => {
        subscribeToMsgs()
        return () => unSubscribeFromMsgs()
    }, [socket, selectedUsers])

    const values = {
        msgs, users, selectedUsers, getUsers, getMsgs, sendMsgs,
        SetSelectedUsers, unseenMsgs, SetUnseenMsgs
    }

    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    )
}