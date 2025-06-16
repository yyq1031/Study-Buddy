import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDCkBuvFPvLiWjCwTAI9ekoc5fMmdOMpUc",
  authDomain: "lifehack-839c6.firebaseapp.com",
  projectId: "lifehack-839c6",
  storageBucket: "lifehack-839c6.firebasestorage.app",
  messagingSenderId: "679073509845",
  appId: "1:679073509845:web:e4e02153cb8f9f1e324d5c",
  measurementId: "G-R3GE89WH7F"
};

const app = initializeApp(firebaseConfig);

export default app