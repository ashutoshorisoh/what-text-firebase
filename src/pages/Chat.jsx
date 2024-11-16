import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase'; // Ensure auth is initialized in your firebase file
import { getDoc, doc, collection, getDocs, addDoc, setDoc } from 'firebase/firestore';

function Chat() {
  const { id } = useParams(); // Get chatId from URL
  const [chatUsers, setChatUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch chat users from Firestore (split the chatId into user1 and user2)
        const [user1Id, user2Id] = id.split('-'); // Get user1 and user2 from the chatId
        const user1Ref = doc(db, 'users', user1Id);
        const user2Ref = doc(db, 'users', user2Id);
        const user1Doc = await getDoc(user1Ref);
        const user2Doc = await getDoc(user2Ref);

        if (user1Doc.exists() && user2Doc.exists()) {
          setChatUsers([user1Doc.data(), user2Doc.data()]); // Set user details
        }

        // Check if the chat document exists, if not create it
        const chatRef = doc(db, 'chats', id);
        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
          await setDoc(chatRef, {
            participants: [user1Id, user2Id],
            createdAt: new Date(),
          });
        }

        // Fetch messages for the chat
        const messagesQuery = collection(db, 'chats', id, 'messages');
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = messagesSnapshot.docs.map((doc) => doc.data());
        setMessages(messagesList); // Set messages for the chat
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [id]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return; // Don't send empty messages

    try {
      const currentUserId = auth.currentUser.uid; // Get current user's UID
      const currentUser = chatUsers.find(user => user.uid === currentUserId);

      if (!currentUser) {
        console.error("Current user not found in chat users");
        return;
      }

      // Add the new message to the Firestore chat messages collection
      const newMessageData = {
        text: newMessage,
        sender: currentUser.name, // Assuming the current user is in the chatUsers array
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'chats', id, 'messages'), newMessageData);

      // Update the messages state to reflect the new message
      setMessages((prevMessages) => [...prevMessages, newMessageData]);

      // Clear the input after sending the message
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <h2>Chatting between {chatUsers[0]?.name} and {chatUsers[1]?.name}</h2>

      {/* Displaying messages */}
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}: </strong>{message.text}
          </div>
        ))}
      </div>

      {/* Input for sending new messages */}
      <div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
