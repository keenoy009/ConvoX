import React, { useEffect, useRef, useState, useContext } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from "react-hot-toast";

const ChatContainer = () => {

  const { 
    messages, 
    selectedUser, 
    setSelectedUser, 
    sendMessage, 
    getMessages,
    deleteMessage
  } = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef()
  const [input, setInput] = useState('')

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return
    await sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file")
      return
    }

    const reader = new FileReader()

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ""
    }

    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!selectedUser) return null

  return (
    <div className='h-full overflow-hidden relative backdrop-blur-lg'>

      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
        />

        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}

          {onlineUsers?.includes(String(selectedUser._id)) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className='md:hidden w-7 cursor-pointer'
        />
      </div>

      {/* Messages */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>

        {messages?.map((msg) => {

          const isMe = String(msg.senderId) === String(authUser?._id)

          return (
            <div
              key={msg._id}
              className={`group flex ${isMe ? "justify-end" : "justify-start"} mb-4`}
            >

              <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>

                {/* Avatar */}
                <img
                  src={
                    isMe
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser.profilePic || assets.avatar_icon
                  }
                  className="w-7 h-7 rounded-full"
                />

                {/* Message */}
                <div className="flex flex-col relative">

                  {/* 🗑 DELETE BUTTON */}
                  {isMe && (
                    <button
                      onClick={() => deleteMessage(msg._id)} // ❌ removed confirm
                      className="hidden group-hover:flex items-center justify-center absolute -top-2 right-0 text-xs w-5 h-5 rounded-full bg-red-500 text-white"
                    >
                      ×
                    </button>
                  )}

                  {/* Content */}
                  {msg.image ? (
                    <img
                      src={msg.image}
                      className="max-w-[220px] rounded-lg"
                    />
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        isMe
                          ? "bg-purple-500 text-white rounded-br-none"
                          : "bg-gray-300 text-black rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Time */}
                  <span className="text-[10px] text-gray-400 mt-1">
                    {formatMessageTime(msg.createdAt)}
                  </span>

                </div>
              </div>
            </div>
          )
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* Input */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
            type="text"
            placeholder="Send a message"
            className='flex-1 text-sm p-3 outline-none text-white bg-transparent'
          />

          <input
            type="file"
            id='image'
            hidden
            onChange={handleSendImage}
          />

          <label htmlFor="image">
            <img src={assets.gallery_icon} className="w-5 mr-2 cursor-pointer" />
          </label>

        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-7 cursor-pointer"
        />
      </div>

    </div>
  )
}

export default ChatContainer