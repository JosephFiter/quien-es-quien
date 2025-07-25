// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgIquFk4xo_MYys-atmOvGALo9KiRe0f8",
  authDomain: "quienesquientarbut.firebaseapp.com",
  projectId: "quienesquientarbut",
  storageBucket: "quienesquientarbut.appspot.com", // Corregí "firebasestorage.app" a "appspot.com"
  messagingSenderId: "1099106784896",
  appId: "1:1099106784896:web:c3790d02a5c7852bcab865",
  // measurementId: "G-E77FERCY07" // Opcional, lo omitimos porque no usamos Analytics
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);