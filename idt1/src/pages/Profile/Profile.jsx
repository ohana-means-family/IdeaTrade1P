// src/pages/Profile.jsx
import React, { useState } from 'react'; 
import './Profile.css';
import { useSubscription } from '@/context/SubscriptionContext'; 
import { db } from "@/firebase"; 
import { doc, setDoc } from "firebase/firestore";

const Profile = () => {
  // 🟢 1. ดึง loading ออกมาจาก useSubscription ด้วย
  const { currentUser, userData, setUserData, loading } = useSubscription();
  
  const [activeTab, setActiveTab] = useState('Profile');
  const [isSaving, setIsSaving] = useState(false);

  // 🟢 2. แก้ไขเงื่อนไขการ Loading
  // ถ้ายังโหลดไม่เสร็จ (loading เป็น true) ให้ขึ้น Loading
  // แต่ถ้าโหลดเสร็จแล้ว (loading เป็น false) แม้ userData จะยังว่าง ก็ให้แสดงหน้า Profile เปล่าๆ ให้ผู้ใช้กรอกได้
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  // กรณีโหลดเสร็จแล้วแต่ไม่มีข้อมูล (userData ยัง null) ให้เซ็ตเป็น object ว่างเพื่อไม่ให้พ่น Error ตอน render input
  const displayData = userData || { firstName: '', lastName: '', email: currentUser?.email || '', phone: '' };

  const handleSave = async () => {
    if (!currentUser) return alert("กรุณาล็อกอินใหม่อีกครั้ง");

    setIsSaving(true);
    try {
      // เซฟลง Firestore โดยใช้ UID ปัจจุบัน
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, {
        firstName: displayData.firstName,
        lastName: displayData.lastName,
        phone: displayData.phone,
        email: displayData.email,
        updatedAt: new Date()
      }, { merge: true });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-4 md:p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-6 text-left">Account Settings</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 w-full overflow-x-auto hide-scrollbar">
          <button 
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors text-sm
              ${activeTab === 'Profile' ? 'bg-[#007bff] text-white' : 'bg-[#1b1d28]/40 border border-gray-700/30 text-gray-400 hover:bg-[#1b1d28]/60'}`}
            onClick={() => setActiveTab('Profile')}
          >
            <UserIcon /> Profile
          </button>
          <button 
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors text-sm
              ${activeTab === 'API' ? 'bg-[#007bff] text-white' : 'bg-[#1b1d28]/40 border border-gray-700/30 text-gray-400 hover:bg-[#1b1d28]/60'}`}
            onClick={() => setActiveTab('API')}
          >
            <CodeIcon /> API
          </button>
        </div>

        {activeTab === 'Profile' && (
          <div className="w-full">
            <div className="bg-transparent w-full flex flex-col gap-6">
              <div className="flex flex-col gap-1 w-full">
                <h2 className="text-lg md:text-xl font-bold text-white text-left">Personal Information</h2>
              </div>
              
              <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col md:flex-row gap-5 w-full">
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <label className="text-sm font-medium text-gray-400 text-left">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#111827]/50 border border-gray-700/50 rounded-lg p-3.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      value={displayData.firstName || ''}
                      onChange={(e) => setUserData({...displayData, firstName: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <label className="text-sm font-medium text-gray-400 text-left">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#111827]/50 border border-gray-700/50 rounded-lg p-3.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      value={displayData.lastName || ''}
                      onChange={(e) => setUserData({...displayData, lastName: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-medium text-gray-400 text-left">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-[#111827]/30 border border-gray-700/30 rounded-lg p-3.5 text-gray-500 text-sm cursor-not-allowed"
                    value={displayData.email || ''}
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-medium text-gray-400 text-left">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-[#111827]/50 border border-gray-700/50 rounded-lg p-3.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    value={displayData.phone || ''}
                    onChange={(e) => setUserData({...displayData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="w-full pt-2">
                  <button 
                    className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white text-sm font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20" 
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ opacity: isSaving ? 0.7 : 1 }}
                  >
                    <EditIcon /> {isSaving ? "Saving..." : "Save Profile"} 
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Icons --- (เหมือนเดิม)
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CodeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:8}}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;

export default Profile;