// src/firebase.ts
// Firebase config & initialization

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ Replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA8eEod-PJPf4J2bst54f6i_r2l6dr4tBY",
  authDomain: "project-gallery-cf72e.firebaseapp.com",
  projectId: "project-gallery-cf72e",
  storageBucket: "project-gallery-cf72e.firebasestorage.app",
  messagingSenderId: "499969993445",
  appId: "1:499969993445:web:747e7fd9c91f960454c20c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
