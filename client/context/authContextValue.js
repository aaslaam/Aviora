import { createContext } from "react";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND;
axios.defaults.baseURL = backendUrl;
export const authContext = createContext();
