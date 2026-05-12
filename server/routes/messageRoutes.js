import express from "express";
import { protectRoute } from "../middleware/auth.js";

import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
  deleteMessage,
  deleteChat
} from "../controllers/messageController.js";

const messageRouter = express.Router();


// ================= USERS =================
messageRouter.get("/users", protectRoute, getUsersForSidebar);


// ================= MESSAGES =================

// Get messages between users
messageRouter.get("/:id", protectRoute, getMessages);

// Send message
messageRouter.post("/send/:id", protectRoute, sendMessage);


// ================= SEEN =================

// Mark message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);


// ================= DELETE =================

// 🔥 Delete SINGLE message
messageRouter.delete("/delete-message/:id", protectRoute, deleteMessage);

// 🔥 Delete FULL chat
messageRouter.delete("/delete/:id", protectRoute, deleteChat);


export default messageRouter;