// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCTKhMwzC2K-N13L9RLRtA7igyvb82q44Y",
    authDomain: "openlab-9e26b.firebaseapp.com",
    projectId: "openlab-9e26b",
    storageBucket: "openlab-9e26b.firebasestorage.app",
    messagingSenderId: "733961652082",
    appId: "1:733961652082:web:8dd1ef525f5013e7197feb",
    measurementId: "G-JVH2TZL4B4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);