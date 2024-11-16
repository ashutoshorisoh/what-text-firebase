import React from 'react'
import { useNavigate } from 'react-router-dom'

function Chat() {
    const navigate = useNavigate()
  return (
    <div>
        <h1>Chat</h1>
        <button onClick={()=>{navigate('/home')}}>Back</button>
    </div>
  )
}

export default Chat