import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

function Login() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const Navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // The signed-in user info

      // Create a reference to the user document in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef); // Get the document for the user

      if (!userDoc.exists()) {
        // If the user does not exist, add them to Firestore
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        console.log("User added to Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }

      // After successful login and Firestore check, set authentication state and navigate
      setIsAuthenticated(true);
      Navigate('/home');

    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default Login;
