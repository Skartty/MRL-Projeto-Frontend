// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyAjgQ--Oux_X7H9uPw6kPf5gpM_EtJERsc",
  authDomain: "mrl-frontend-app.firebaseapp.com",
  databaseURL: "https://mrl-frontend-app-default-rtdb.firebaseio.com",
  projectId: "mrl-frontend-app",
  storageBucket: "mrl-frontend-app.firebasestorage.app",
  messagingSenderId: "854672512951",
  appId: "1:854672512951:web:ed18a444318c8ec790ba32",
  measurementId: "G-296F533W8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };