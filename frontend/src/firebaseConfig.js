// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config (the one you shared earlier)
const firebaseConfig = {
  apiKey: "AIzaSyDz-X0hYbmppSA4jkITbmrh-k-i0nB8PH0",
  authDomain: "contribout.firebaseapp.com",
  projectId: "contribout",
  storageBucket: "contribout.firebasestorage.app",
  messagingSenderId: "552523079526",
  appId: "1:552523079526:web:96086e713fd44547b532a7",
  measurementId: "G-N3JKS2EGC0",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }