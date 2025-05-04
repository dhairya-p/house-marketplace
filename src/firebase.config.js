// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwLvYHTKOdUlc1GDYT6ZM3Fg0Y8kOIW6E",
  authDomain: "house-marketplace-app-2eecc.firebaseapp.com",
  projectId: "house-marketplace-app-2eecc",
  storageBucket: "house-marketplace-app-2eecc.firebasestorage.app",
  messagingSenderId: "233060009310",
  appId: "1:233060009310:web:778bd0003189fbbfd0bbcf",
  measurementId: "G-MQZ6M6KVN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();