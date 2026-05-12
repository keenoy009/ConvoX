import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Socket setup
export const io = new Server(server, {
    cors: { origin: "*" }
});

// Store sockets
export const userSocketMap = {}; 
// { userId: [socketIds] }

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;
    console.log("User Connected:", userId);

    // ✅ FIX 1: prevent invalid userId
    if (userId && userId !== "undefined") {

        if (userSocketMap[userId]) {

            // ✅ FIX 2: prevent duplicates
            if (!userSocketMap[userId].includes(socket.id)) {
                userSocketMap[userId].push(socket.id);
            }

        } else {
            userSocketMap[userId] = [socket.id];
        }

        // Emit only if valid user
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
        console.log("User Disconnected:", userId);

        if (userId && userSocketMap[userId]) {

            userSocketMap[userId] = userSocketMap[userId].filter(
                (id) => id !== socket.id
            );

            if (userSocketMap[userId].length === 0) {
                delete userSocketMap[userId];
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// DB
await connectDB();

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log("Server running on PORT:", PORT)
);