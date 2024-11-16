import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; // Import Firestore and Firebase Auth
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth state listener

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State to store the list of users
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Set the current user
      } else {
        setCurrentUser(null); // No user logged in
        navigate('/login'); // Redirect to login if no user is logged in
      }
    });

    // Cleanup the listener when component is unmounted
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Fetch users from Firestore on component mount
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Get the 'users' collection
        const usersList = querySnapshot.docs.map(doc => ({
          uid: doc.id, // Use doc.id as uid
          ...doc.data(), // Extract the user data from Firestore document
        }));
        setUsers(usersList); // Set the users data to the state
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Unable to fetch users. Please check your permissions.');
      }
    };

    if (currentUser) {
      fetchUsers(); // Fetch users only if currentUser is available
    }
  }, [currentUser]); // Dependency array includes currentUser to refetch when the user state changes

  // Function to generate the unique chat ID based on user IDs
  const generateChatId = (uid1, uid2) => {
    const chatId = [uid1, uid2].sort().join('-'); // Sort to ensure chat ID is always the same order
    return chatId;
  };

  // Function to handle user click for chat navigation
  const handleUserClick = (clickedUserId) => {
    if (currentUser) {
      const chatId = generateChatId(currentUser.uid, clickedUserId); // Generate the chat ID using current user ID and clicked user ID
      navigate(`/chat/${chatId}`); // Navigate to the chat window with the generated chat ID
    }
  };

  return (
    <div>
      <h1>Home</h1>
      {currentUser ? (
        <>
          <button onClick={() => navigate('/')}>Back</button>
          
          {/* Map through the users and render a button for each user */}
          {users
            .filter((user) => user.uid !== currentUser.uid) // Filter out the current user from the list
            .map((user) => (
              <button key={user.uid} onClick={() => handleUserClick(user.uid)}>
                {user.displayName}
              </button>
            ))}
        </>
      ) : (
        <div>Please log in to view users.</div> // Message if no user is logged in
      )}
    </div>
  );
}

export default Home;
