import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './ProtectedRoute'
import Home from './pages/Home'
import Chat from './pages/Chat'
import { AuthProvider } from './Context/AuthContext'
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/home' element={<ProtectedRoute element={<Home/>} />} />
          <Route path='/chat/:id' element={<ProtectedRoute element={<Chat/>}/>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App