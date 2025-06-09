
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDgCr3bxrXL1iCJlgscSVbHTcTRp_5kQGo",
  authDomain: "khilaao-sathi.firebaseapp.com",
  projectId: "khilaao-sathi",
  storageBucket: "khilaao-sathi.firebasestorage.app",
  messagingSenderId: "784324113746",
  appId: "1:784324113746:web:e9bb4de0ccc9eb7f9d768b"
};

// ✅ Initialize the app
const app = initializeApp(firebaseConfig);

// ✅ Setup auth, db, and provider
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Export app too if used somewhere else
export { app, auth, db, googleProvider };