// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSy...", // ⚠️ ตรวจสอบว่าตรงกับใน Firebase Console ของคุณ
  authDomain: "ideatrade-9548f.firebaseapp.com",
  projectId: "ideatrade-9548f",
  storageBucket: "ideatrade-9548f.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 👇 แก้ไขส่วนนี้เพื่อให้ทำงานจริง
if (window.location.hostname === "localhost") {
  // ต้องเรียกฟังก์ชันนี้ด้วยเพื่อให้ Auth เปลี่ยนไปใช้ Port 9099 ของ Emulator

  console.log("🚀 Connected to Firebase Auth Emulator (Port 9099)");
}