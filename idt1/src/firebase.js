// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth";

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
export const googleProvider = new GoogleAuthProvider();

// ✅ เพิ่มคำสั่งเชื่อมต่อ Auth Emulator เพื่อให้คุยกับ Backend รู้เรื่อง
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  console.log("🚀 Connected to Firebase Auth Emulator (Port 9099)");
}