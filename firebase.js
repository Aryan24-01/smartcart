// firebase.js (MODULAR v10 WORKING VERSION)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2nrJfi2Rm9Gy6Lzh9ac4rUSsLKhgncWM",
  authDomain: "smartcart-b54df.firebaseapp.com",
  projectId: "smartcart-b54df",
  storageBucket: "smartcart-b54df.firebasestorage.app",
  messagingSenderId: "879916926556",
  appId: "1:879916926556:web:13005f2abd5d18bfc44899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);