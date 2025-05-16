// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_APIKEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.PUBLIC_FIREBASE_APPID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENTID
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
const analytics = getAnalytics(app);