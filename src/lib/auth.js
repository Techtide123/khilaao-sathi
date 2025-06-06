// lib/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";


// Signup with Email and Password
export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login with Email and Password
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Login/Signup with Google
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
