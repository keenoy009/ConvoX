import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // ✅ Get users
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages || {});
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ✅ Get messages
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);

                setUnseenMessages((prev) => ({
                    ...prev,
                    [userId]: 0
                }));

                await axios.put(`/api/messages/mark-all/${userId}`);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ✅ Send message
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 🔥 DELETE FULL CHAT
    const deleteChat = async (userId) => {
        try {
            const { data } = await axios.delete(`/api/messages/delete/${userId}`);

            if (data.success) {
                setMessages([]); // clear UI
                toast.success("Chat deleted");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // 🔥 DELETE SINGLE MESSAGE
    const deleteMessage = async (messageId) => {
        try {
            const { data } = await axios.delete(`/api/messages/delete-message/${messageId}`);

            if (data.success) {
                setMessages((prev) =>
                    prev.filter((msg) => msg._id !== messageId)
                );
                toast.success("Message deleted");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ✅ SOCKET LISTENER
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = async (newMessage) => {

            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;

                setMessages((prev) => [...prev, newMessage]);

                try {
                    await axios.put(`/api/messages/mark/${newMessage._id}`);
                } catch (err) {
                    console.log(err);
                }

            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]:
                        (prev[newMessage.senderId] || 0) + 1
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };

    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        deleteChat,      // ✅ added
        deleteMessage    // ✅ added
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};