import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { getDoc, doc, collection, getDocs, addDoc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const formatTimestamp = (timestamp) => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
    return formattedTime;
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const [user1Id, user2Id] = id.split('-');
        const user1Ref = doc(db, 'users', user1Id);
        const user2Ref = doc(db, 'users', user2Id);
        const user1Doc = await getDoc(user1Ref);
        const user2Doc = await getDoc(user2Ref);

        if (user1Doc.exists() && user2Doc.exists()) {
          setChatUsers([user1Doc.data(), user2Doc.data()]);
        }

        if (![user1Id, user2Id].includes(auth.currentUser.uid)) {
          alert('You are not a participant of this chat');
          navigate('/home');
          return;
        }

        const chatRef = doc(db, 'chats', id);
        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
          await setDoc(chatRef, {
            participants: [user1Id, user2Id],
            createdAt: new Date(),
          });
        }

        const messagesQuery = collection(db, 'chats', id, 'messages');
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = messagesSnapshot.docs.map((doc) => doc.data());
        setMessages(messagesList);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [id, navigate]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const currentUserId = auth.currentUser.uid;
      const [user1Id, user2Id] = id.split('-');
      if (![user1Id, user2Id].includes(currentUserId)) {
        console.error("Current user is not part of this chat.");
        return;
      }

      const newMessageData = {
        text: newMessage,
        sender: currentUserId,
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'chats', id, 'messages'), newMessageData);

      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-400 p-5">
      <div className="flex items-center justify-between p-4 bg-green-500 text-white m-10">
        
        <button className="text-white" onClick={() => window.history.back()}>Back</button>
        <h1 className="text-xl font-semibold">Chating with </h1>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[75vh] max-h-[80vh] flex flex-col gap-2 p-4 space-y-4 bg-white ml-10 mr-10 mt-[-40px] mb-[-40px]">
        {messages.map((message, index) => {
          const isSender = message.sender === auth.currentUser.uid;
          const formattedTime = formatTimestamp(message.timestamp);
          return (
            <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${isSender ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                <strong>{isSender ? '' : ''} </strong>{message.text}
                <div className="text-xs text-white">{formattedTime}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-green-800 ml-10 mr-10 mt-[-40px] ">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="mt-2 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
