import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from "@/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // --- ขั้นตอนที่ 1: ลองหาด้วย UID ก่อน (วิธีมาตรฐาน) ---
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("✅ เจอข้อมูลด้วย UID!");
            setUserData(docSnap.data());
          } else {
            // --- ขั้นตอนที่ 2: ถ้าไม่เจอ (เช่นกรณี UID บั๊กเป็นอีเมล) ให้ค้นหาด้วย Field email แทน ---
            console.log("🔍 ไม่เจอ UID... กำลังค้นหาด้วย Email แทน");
            const userEmail = user.email || user.uid; // เผื่อกรณี email ไปอยู่ในช่อง uid
            
            const q = query(collection(db, "users"), where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              console.log("🎯 เจอข้อมูลด้วยการค้นหา Email!");
              setUserData(querySnapshot.docs[0].data());
            } else {
              console.log("❌ หาไม่เจอทั้ง UID และ Email");
              setUserData({});
            }
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          setUserData({});
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, setUserData, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};