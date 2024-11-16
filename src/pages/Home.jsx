import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Import the Firestore database instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from Firestore on component mount
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users')); // Get the 'users' collection
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(), // This will give you the user data
        }));
        setUsers(usersList); // Set the users data to the state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => navigate('/')}>Back</button>
      <button onClick={() => navigate('/chat/:id')}>Chat Window</button>
      
      {/* Map through the users and render their names */}
      {users.map((user) => (
        <button key={user.id}>{user.name}</button> // Display the user's name
      ))}
    </div>
  );
}

export default Home;
