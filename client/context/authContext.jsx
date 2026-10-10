import axios from "axios"
import {  createContext, useState , useEffect} from "react";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client"
export const authContext = createContext()


export const backendUrl = import.meta.env.VITE_BACKEND
axios.defaults.baseURL = backendUrl

export const AuthProvider = ({children})=>{
    const {token,setToken} = useState(localStorage.getItem("token"))
    const {authUser,setAuthUser} = useState(null)
    const {socket,setSocket} = useState(null)
    const {onlineUsers,setOnlineUsers} = useState([])


    // check if user is auth then connect to socket

    const checkAuth = async (params) => {
        try {
          const {data} = await axios.get("/api/auth/check")
          if(data.sucess){
            setAuthUser(data.user)
            conncetSocket(data.user)
          }
        } catch (error) {
              toast.error(error.message)
        }
    }

    // login func handle user auth 
    const login = async (state,credentials) => {
           try {
             const {data} = axios.post(`/api/auth/${state}`,credentials) 
             if(data.sucess){
            setAuthUser(data.user)
            conncetSocket(data.user)
            axios.defaults.headers.common["token"] = data.token 
            setToken(data.token)
            localStorage.setItem("token",data.token)
            toast.sucess(data.message)
            
          }else{
            toast.error(data.message)

          }
           } catch (error) {
            toast.error(error.message)
            
           }

    }

    // logout and socket disc func

    const logout = async () => {
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        axios.defaults.headers.common["token"] = null
        toast.success("Logged Out Sucessfully")
        socket.disconnect()
    }


    // CONNECT func to handle socket connection and online use updates
    const conncetSocket = (userData)=>{
        if(userData || socket?.connected) return
        const newSocket = io(backendUrl,{
            query:{
                 userId:userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds)
        })
    }

    useEffect(() => {
      if(token){
        axios.defaults.headers.common["token"] = token 
      }
    }, [])
    
    const value  = {
        axios,
        onlineUsers,
        socket,
        authUser
    }
    return(
         <authContext.Provider value={value}>
                {
                    children
                }
        </authContext.Provider>
    )
   
}