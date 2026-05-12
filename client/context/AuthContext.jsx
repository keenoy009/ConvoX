import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

   const [token, setToken] = useState(localStorage.getItem("token"));
   const [authUser, setAuthUser] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const [socket, setSocket] = useState(null);
   const [loading, setLoading] = useState(true);

   // ✅ CHECK AUTH
   const checkAuth = async () => {
      try {
         const { data } = await axios.get("/api/auth/check");

         if (data.success) {
            setAuthUser(data.user);
         }
      } catch (error) {
         console.log(error.message);
      } finally {
         setLoading(false);
      }
   };

   // ✅ LOGIN
   const login = async (state, credentials) => {
      try {
         const { data } = await axios.post(`/api/auth/${state}`, credentials);

         if (data.success) {
            const user = data.user || data.userData;

            setAuthUser(user);

            axios.defaults.headers.common["token"] = data.token;
            setToken(data.token);
            localStorage.setItem("token", data.token);

            toast.success(data.message);
            return { success: true };
         } else {
            toast.error(data.message);
            return { success: false };
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      }
   };

   // ✅ LOGOUT
   const logout = () => {
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);

      axios.defaults.headers.common["token"] = null;

      if (socket) {
         socket.disconnect();
         setSocket(null);
      }

      toast.success("Logged out successfully");
   };

   // ✅ 🔥 UPDATE PROFILE (ADDED)
   const updateProfile = async (updatedData) => {
      try {
         const { data } = await axios.put("/api/auth/update-profile", updatedData);

         if (data.success) {
            setAuthUser(data.user); // update UI instantly
            toast.success("Profile updated");
            return { success: true };
         } else {
            toast.error(data.message);
            return { success: false };
         }
      } catch (error) {
         console.error(error);
         toast.error(error.response?.data?.message || "Update failed");
         return { success: false };
      }
   };

   // 🔥 SOCKET CONNECTION
   useEffect(() => {
      if (!authUser) return;

      if (socket) {
         socket.disconnect();
      }

      const newSocket = io(backendUrl, {
         query: { userId: authUser._id },
         transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
         console.log("Connected:", newSocket.id);
      });

      newSocket.off("getOnlineUsers");

      newSocket.on("getOnlineUsers", (userIds) => {
         const normalized = userIds.map((id) => String(id));
         setOnlineUsers(normalized);
      });

      newSocket.on("disconnect", () => {
         console.log("Disconnected");
      });

      return () => {
         newSocket.disconnect();
      };

   }, [authUser]);

   // 🔐 TOKEN SETUP
   useEffect(() => {
      if (token) {
         axios.defaults.headers.common["token"] = token;
      }
      checkAuth();
   }, []);

   const value = {
      axios,
      authUser,
      onlineUsers,
      socket,
      login,
      logout,
      updateProfile, // ✅ added here
      loading
   };

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
};