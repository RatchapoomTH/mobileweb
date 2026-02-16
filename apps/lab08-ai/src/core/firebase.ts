// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbIpcMjuuYDAvxSHQcGVayO152Px2gkSU",
  authDomain: "mobileweb-f3802.firebaseapp.com",
  projectId: "mobileweb-f3802",
  storageBucket: "mobileweb-f3802.firebasestorage.app",
  messagingSenderId: "945912545642",
  appId: "1:945912545642:web:b21af66011dd74463fa513",
  measurementId: "G-RN76M259F3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
