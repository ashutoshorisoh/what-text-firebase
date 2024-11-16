import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

function Login() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // For Register form
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Sign in with Google
      const user = result.user;

      const userRef = doc(db, "users", user.uid); // Firestore reference for user document
      const userDoc = await getDoc(userRef); // Check if user exists

      if (!userDoc.exists()) {
        // If user does not exist in Firestore, add their details
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });
        console.log("User added to Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }

      setIsAuthenticated(true); // Set authentication state
      navigate('/home'); // Navigate to the home page
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const handleEmailPasswordLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid); // Firestore reference for user document
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If user does not exist in Firestore, add their details
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
        });
        console.log("User added to Firestore.");
      }

      setIsAuthenticated(true); // Set authentication state
      navigate('/home'); // Navigate to the home page
    } catch (error) {
      console.error("Error during email/password sign-in:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid); // Firestore reference for user document
      await setDoc(userRef, {
        displayName: username, // Store the username as displayName
        email: user.email,
        uid: user.uid, // Store the user uid
      });

      console.log("User registered in Firestore.");
      setIsLogin(true); // Switch to login after registration
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
  <div className="w-full sm:w-96 bg-white p-8 rounded-xl shadow-lg space-y-6">
    {isLogin ? (
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">Login</h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Login with Google
        </button>
        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <button
            onClick={handleEmailPasswordLogin}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Login with Email/Password
          </button>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(false)}
            className="text-blue-500 hover:text-blue-600 font-medium transition duration-200"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    ) : (
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">Register</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <button
            onClick={handleRegister}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Register
          </button>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(true)}
            className="text-blue-500 hover:text-blue-600 font-medium transition duration-200"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    )}
  </div>
</div>

  );
}

export default Login;
