// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARogb6S407cole8hfdn6Zwx5lEXts3P80",
  authDomain: "mobileweb-f3802.firebaseapp.com",
  projectId: "mobileweb-f3802",
  storageBucket: "mobileweb-f3802.firebasestorage.app",
  messagingSenderId: "945912545642",
  appId: "1:945912545642:web:405a382fb2296d083fa513",
  measurementId: "G-38FTF1ML94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);