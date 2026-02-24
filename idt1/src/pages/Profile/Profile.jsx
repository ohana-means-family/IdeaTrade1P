import React, { useState, useEffect } from 'react';
import './Profile.css';

// ✅ Import Firebase Auth และ Firestore
import { auth, db } from "@/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false); // สถานะปุ่ม Save

  // ข้อมูล State ของผู้ใช้
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    lastLogin: '',
    isVerified: true
  });

  // ================= 1. ดึงข้อมูลจาก Firebase ตอนเปิดหน้า =================
  useEffect(() => {
    // ใช้ onAuthStateChanged เพื่อรอให้ Firebase โหลดข้อมูล User ปัจจุบันเสร็จก่อน
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1.1 จัดการเวลา Last Login ดึงจากระบบ Firebase ตรงๆ
        const lastSignIn = new Date(user.metadata.lastSignInTime);
        const day = lastSignIn.getDate();
        const month = lastSignIn.toLocaleString('en-US', { month: 'long' });
        const year = lastSignIn.getFullYear();
        const hours = String(lastSignIn.getHours()).padStart(2, '0');
        const minutes = String(lastSignIn.getMinutes()).padStart(2, '0');
        const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

        // 1.2 เซ็ต Email และ LastLogin ทันที
        setUserData(prev => ({
          ...prev,
          email: user.email || '',
          lastLogin: formattedDate
        }));

        // 1.3 ดึงข้อมูล ชื่อ นามสกุล เบอร์โทร จาก Firestore (Collection 'users')
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("✅ เจอข้อมูลใน Firestore:", docSnap.data()); // 👈 เพิ่ม log ตรงนี้
            const data = docSnap.data();
            setUserData(prev => ({
              ...prev,
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              phone: data.phone || ''
            }));
          } else {
            console.log("ℹ️ ยังไม่มีข้อมูลโปรไฟล์ใน Firestore (เป็นผู้ใช้ใหม่)"); // 👈 เพิ่ม log ตรงนี้
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // ================= 2. ฟังก์ชันบันทึกข้อมูลลง Firestore =================
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("กรุณาล็อกอินใหม่อีกครั้ง");

    setIsSaving(true);
    try {
      // อ้างอิงไปที่ตาราง 'users' -> แถวที่ชื่อเดียวกับ UID ของผู้ใช้
      const docRef = doc(db, "users", user.uid);
      
      // บันทึกข้อมูลลง Firestore (ใช้ merge: true เพื่อไม่ให้ข้อมูลอื่นที่อาจมีอยู่แล้วหายไป)
      await setDoc(docRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: user.email, // เซฟอีเมลเก็บไว้ดูในฐานข้อมูลด้วย
        updatedAt: new Date()
      }, { merge: true });

      // ดึงโปรไฟล์ใน LocalStorage มาอัปเดตด้วย เพื่อให้ Sidebar หรือส่วนอื่นเปลี่ยนตามทันที
      const storedProfile = localStorage.getItem("userProfile");
      let profile = storedProfile ? JSON.parse(storedProfile) : {};
      localStorage.setItem("userProfile", JSON.stringify({
        ...profile,
        firstName: userData.firstName,
        lastName: userData.lastName
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. See console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page-container">
      
      {/* Header Title */}
      <h1 className="page-title">Your account</h1>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
        >
          <UserIcon /> Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'API' ? 'active' : ''}`}
          onClick={() => setActiveTab('API')}
        >
          <CodeIcon /> API
        </button>
      </div>

      {/* ================= PROFILE TAB CONTENT ================= */}
      {activeTab === 'Profile' && (
        <div className="profile-layout fade-in">
          
          {/* --- LEFT COLUMN: Form --- */}
          <div className="card form-card">
            <h2 className="card-header">My Account Information</h2>
            
            <div className="form-content">
              {/* Row 1: First Name & Last Name */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className="dark-input"
                    value={userData.firstName}
                    onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="dark-input"
                    value={userData.lastName}
                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="dark-input"
                    value={userData.email}
                    disabled // อีเมลไม่ควรแก้ได้จากตรงนี้
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Row 3: Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    className="dark-input"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="form-actions">
                <button 
                  className="btn-save-changes" 
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ opacity: isSaving ? 0.7 : 1 }}
                >
                  <LockIcon /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Profile Summary --- */}
          <div className="sidebar-column">
            
            {/* User Info Card */}
            <div className="card profile-summary-card">
              <div className="avatar-circle">
                <UserIconLarge />
              </div>
              <h3 className="user-fullname">
                {userData.firstName || userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}` 
                  : "Idea Trade User"}
              </h3>
              <div className="verified-badge">
                <CheckCircleIcon /> Account Verified
              </div>
              <p className="last-login-text">Last Login: {userData.lastLogin}</p>
            </div>

          </div>
        </div>
      )}

      {/* ================= API TAB CONTENT ================= */}
      {activeTab === 'API' && (
        <div className="api-content fade-in">
           <div className="card">
                <h2 className="card-header">API Configuration</h2>
                <div style={{padding: '20px', color: '#9ca3af'}}>
                    Manage your API keys here.
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Icons Components ---
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CodeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const CheckCircleIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#10b981" stroke="none"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 17.292l-4.5-4.5 1.762-1.762 2.738 2.735 7.738-7.738 1.762 1.762-9.5 9.5z"/></svg>;
const UserIconLarge = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default Profile;