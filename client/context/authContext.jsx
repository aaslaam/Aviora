import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { authContext, backendUrl } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  // connect socket + listen for online users
  const connectSocket = useCallback((userData) => {
    if (!userData || socketRef.current) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    socketRef.current = newSocket;
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  }, []);

  // login / signup
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.sucess) {
        setAuthUser(data.user);
        connectSocket(data.user);
        setToken(data.token); // header set in effect below
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // logout + socket disconnect
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null); // header removed in effect below
    setAuthUser(null);
    setOnlineUsers([]);
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(null);
    toast.success("Logged Out Successfully");
  };

  // update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.post("/api/auth/update-profile", body);
      if (data.sucess) {
        setAuthUser(data.user);
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // keep axios header in sync with token (must run before auth check effect)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
  }, [token]);

  // token present: verify user, then connect socket
  // setState only inside promise callbacks, not sync in effect body
  useEffect(() => {
    if (!token) return;
    let ignore = false;
    axios
      .get("/api/auth/check")
      .then(({ data }) => {
        if (ignore) return;
        if (data.sucess) {
          setAuthUser(data.user);
          connectSocket(data.user);
        }
      })
      .catch((error) => {
        if (!ignore) toast.error(error.message);
      });
    return () => {
      ignore = true;
    };
  }, [token, connectSocket]);

  const value = {
    axios,
    onlineUsers,
    socket,
    authUser,
    login,
    logout,
    updateProfile,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
