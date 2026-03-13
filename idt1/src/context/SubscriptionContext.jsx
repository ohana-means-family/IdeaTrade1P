import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [accessData, setAccessData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFreeAccess, setIsFreeAccess] = useState(false);

  useEffect(() => {
    let unsubscribeDoc = null; 

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // 🟢 เพิ่มตรงนี้ 1: เคลียร์ Listener เก่าทิ้งทันทีที่มีการเปลี่ยนสถานะ Auth (เช่น กด Sign Out)
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (user) {
        setIsFreeAccess(false);
        setLoading(true);
        
        const handleFallbackLocalData = () => {
          const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
          if (savedProfile.role === "member") {
            const futureDate = Date.now() + (30 * 24 * 60 * 60 * 1000); 
            setAccessData({ fortune: futureDate }); 
          } else {
            setAccessData({});
          }
        };

        try {
          const docRef = doc(db, 'users', user.uid);
          
          // 🟢 ตรงนี้ unsubscribeDoc จะเก็บฟังก์ชันไว้เคลียร์ตัวเองรอบหน้า
          unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setAccessData(docSnap.data().subscriptions || {});
            } else {
              handleFallbackLocalData();
            }
            setLoading(false);
          }, (error) => {
            console.error("Error fetching subscriptions realtime:", error);
            handleFallbackLocalData();
            setLoading(false);
          });

        } catch (error) {
          console.error("Catch error setting up snapshot:", error);
          handleFallbackLocalData();
          setLoading(false);
        }
      } else {
        setIsFreeAccess(true);
        setAccessData({});
        
        const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        if (savedProfile.role === "free") {
          setIsFreeAccess(true);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc(); 
    };
  }, []);

  return (
    <SubscriptionContext.Provider value={{ accessData, loading, isFreeAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);