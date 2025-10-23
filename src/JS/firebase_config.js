// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, FacebookAuthProvider, signInWithPopup, GoogleAuthProvider  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyBu3Afgel9YlVzn255NovXF3oWg0aTJisk",
  authDomain: "mrl-desenvolvimento.firebaseapp.com",
  databaseURL: "https://mrl-desenvolvimento-default-rtdb.firebaseio.com",
  projectId: "mrl-desenvolvimento",
  storageBucket: "mrl-desenvolvimento.firebasestorage.app",
  messagingSenderId: "1085003346219",
  appId: "1:1085003346219:web:b2500242491be8769e956e",
  measurementId: "G-V2N7S49PLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
const db = getFirestore(app);

export { db, analytics, auth, provider, signInWithPopup };