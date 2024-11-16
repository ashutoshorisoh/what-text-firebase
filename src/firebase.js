
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWNns0ztxXD0Ri3wWSx7NrhUrc5nSDzKc",
  authDomain: "chat-clone-ef61e.firebaseapp.com",
  projectId: "chat-clone-ef61e",
  storageBucket: "chat-clone-ef61e.firebasestorage.app",
  messagingSenderId: "531846571213",
  appId: "1:531846571213:web:10d05cbd5eefbdd2847584"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize authentication
const provider = new GoogleAuthProvider(); // Set up Google Auth provider
const db = getFirestore(app); // Initialize Firestore


export {auth, app, provider, db}