// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFireBase, getFirestore}  from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwmnxTZrGns_eA_HR0m_gR-oaG7ZZPa0o",
  authDomain: "pantry-1102b.firebaseapp.com",
  projectId: "pantry-1102b",
  storageBucket: "pantry-1102b.appspot.com",
  messagingSenderId: "426061325571",
  appId: "1:426061325571:web:16aba7e55a02e4d56d7536",
  measurementId: "G-JJ6EJPG5QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export{firestore}