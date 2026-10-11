import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const backendUrl = import.meta.env.VITE_BACKEND;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();
export const authContext = AuthContext; // alias, old imports still work

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // connect socket, send userId so server fill userSocketMap
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: { userId: userData._id },
        });
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    // check token valid on load
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // login / signup. state = "login" or "signup"
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
            }
            return data;
        } catch (error) {
            console.log(error.message);
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["token"];
        socket?.disconnect();
        setSocket(null);
    };

    // update profile, server return updated user
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
            }
            return data;
        } catch (error) {
            console.log(error.message);
            return { success: false, message: error.message };
        }
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};