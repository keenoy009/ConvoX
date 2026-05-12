import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const App = () => {

  const { authUser, loading } = useContext(AuthContext)

  // 🔥 IMPORTANT: wait until auth check finishes
  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-[url('/src/assets/purplee.jpg')] bg-cover min-h-screen">
      <Toaster />

      <Routes>

        {/* Home */}
        <Route 
          path='/' 
          element={authUser ? <HomePage /> : <Navigate to="/login" />} 
        />

        {/* Login */}
        <Route 
          path='/login' 
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
        />

        {/* Profile */}
        <Route 
          path='/profile' 
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
        />

      </Routes>
    </div>
  )
}

export default App