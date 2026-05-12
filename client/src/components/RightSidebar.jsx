import React, { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

  const { selectedUser, messages, deleteChat } = useContext(ChatContext)
  const { logout, onlineUsers } = useContext(AuthContext)

  const [msgImages, setMsgImages] = useState([])
  const [showConfirm, setShowConfirm] = useState(false) // ✅ added

  useEffect(() => {
    if (messages) {
      const images = messages
        .filter(msg => msg.image)
        .map(msg => msg.image)

      setMsgImages(images)
    } else {
      setMsgImages([])
    }
  }, [messages])

  if (!selectedUser) return null

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">

      {/* Profile */}
      <div className='pt-8 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className='w-20 aspect-square rounded-full'
        />

        <h1 className='px-10 text-xl font-medium flex items-center gap-2'>
          {onlineUsers?.includes(String(selectedUser._id)) && (
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          )}
          {selectedUser.fullName}
        </h1>

        <p className='px-10 text-center'>
          {selectedUser.bio || "No bio available"}
        </p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* Media */}
      <div className="px-5 text-xs pb-28">
        <p className="mb-2">Media</p>

        <div className='max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className='cursor-pointer'
              >
                <img
                  src={url}
                  className='w-full h-full object-cover rounded-md'
                />
              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-400">
              No media shared
            </p>
          )}
        </div>
      </div>

      {/* 🔥 ACTION BUTTONS */}
      <div className='absolute bottom-5 left-0 w-full flex flex-wrap justify-center gap-2 px-4'>

        {/* ❌ DELETE CHAT */}
        <button
          onClick={() => setShowConfirm(true)} // ✅ FIXED
          className='bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-4 rounded-full whitespace-nowrap'
        >
          Delete Chat
        </button>

        {/* 🔓 LOGOUT */}
        <button
          onClick={logout}
          className='bg-gradient-to-r from-purple-400 to-violet-600 text-white text-xs py-1.5 px-4 rounded-full whitespace-nowrap'
        >
          Logout
        </button>

      </div>

      {/* ✅ CUSTOM CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1f1f2e] p-6 rounded-xl text-center w-[300px]">

            <p className="mb-4 text-sm">
              Delete this chat permanently?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  deleteChat(selectedUser._id)
                  setShowConfirm(false)
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
              >
                Yes
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default RightSidebar