// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeRoNiFD085uJDvTBFZRPdQcoGGODUaNU",
  authDomain: "farmers-fisher-information-sys.firebaseapp.com",
  projectId: "farmers-fisher-information-sys",
  storageBucket: "farmers-fisher-information-sys.appspot.com",
  messagingSenderId: "1040047246341",
  appId: "1:1040047246341:web:5c1c8ded71f79e3fbc606c",
  measurementId: "G-5S8VZQJZ6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage()