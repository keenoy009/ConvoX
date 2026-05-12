import React, { useContext } from 'react'
import ChatContainer from '../components/ChatContainer'
import SideBar from '../components/SideBar'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const { selectedUser } = useContext(ChatContext)

  return (
    <div className='border w-full h-screen sm:px-[5%] sm:py-[3%] max-w-7xl mx-auto'>
      
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl
        overflow-hidden h-full grid grid-cols-1 relative ${
          selectedUser
            ? 'md:grid-cols-[1.2fr_2fr_1.2fr] xl:grid-cols-[1.3fr_2.5fr_1.3fr]'
            : 'md:grid-cols-2'
        }`}
      >

        {/* LEFT */}
        <SideBar />

        {/* CENTER */}
        <ChatContainer />

        {/* RIGHT — ONLY SHOW WHEN USER IS SELECTED */}
        {selectedUser && <RightSidebar />}

      </div>
        
    </div>
  )
}

export default HomePage