import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
  return (
    <div>
        <h1>Home</h1>
        <button onClick={()=> navigate('/')}>Back</button>
        <button onClick={()=>navigate('/chat/:id')}>Chat Window</button>
    </div>
  )
}

export default Home