// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // ⚠️ เอาค่าของจริงจาก Firebase Console มาใส่ในช่องที่มีคำว่า "ใส่_..." นะครับ
  apiKey: "AIzaSyCBUZescPs_vvKwLy_lK_YvMilDPgQUYh4",
  authDomain: "ideatrade-9548f.firebaseapp.com",
  projectId: "ideatrade-9548f",
  storageBucket: "ideatrade-9548f.firebasestorage.app",
  messagingSenderId: "85469723841",
  appId: "1:85469723841:web:48e10083ce04af49fa6840",
  measurementId: "G-17CV8CYLXE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider();

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  // 🌟 ใส่ try-catch ป้องกันโค้ดรันซ้ำตอนที่ React รีเฟรชตัวเอง
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080); 
    console.log("🚀 Connected to Firebase Auth & Firestore Emulators");
  } catch (error) {
    console.log("⚡ Firebase Emulators already connected.");
  }
}