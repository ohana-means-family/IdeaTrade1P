import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  // ✅ ฟังก์ชัน: ดึงวันและเวลาปัจจุบัน จัดรูปแบบเป็น "24 January 2026, 11:19"
  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }); // ชื่อเดือนภาษาอังกฤษเต็ม
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0'); // เติมเลข 0 ข้างหน้าถ้ามีหลักเดียว
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  // ข้อมูลจำลอง (Mock Data)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // ✅ แก้ตรงนี้: เรียกใช้ฟังก์ชัน getCurrentDate() เพื่อเอาเวลาปัจจุบัน
    lastLogin: getCurrentDate(), 
    isVerified: true
  });

  // (Optional) ถ้าอยากให้อัปเดตเวลาทุกครั้งที่เข้ามาหน้านี้ใหม่จริงๆ
  useEffect(() => {
    setUserData(prev => ({
        ...prev,
        lastLogin: getCurrentDate()
    }));
  }, []);

  return (
    <div className="profile-page-container">
      
      {/* Header: Account Title */}
      <h1 className="account-title">Account</h1>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'API' ? 'active' : ''}`}
          onClick={() => setActiveTab('API')}
        >
          API
        </button>
      </div>

      {/* ================= PROFILE TAB CONTENT ================= */}
      {activeTab === 'Profile' && (
        <div className="profile-content fade-in">
          
          {/* Status Section */}
          <div className="status-section">
            <div className="verified-badge">
              Account Verified <CheckCircleIcon />
            </div>
            {/* แสดงผลเวลา */}
            <p className="last-login">Last login: {userData.lastLogin}</p>
          </div>

          {/* Form Section */}
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <label>First name</label>
                <input 
                  type="text" 
                  className="custom-input"
                  value={userData.firstName}
                  onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="custom-input"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-group">
                <label>Last name</label>
                <input 
                  type="text" 
                  className="custom-input"
                  value={userData.lastName}
                  onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone number</label>
                <input 
                  type="tel" 
                  className="custom-input"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button className="btn-edit">Edit profile</button>
            <button className="btn-save">Save</button>
          </div>
        </div>
      )}

      {/* ================= API TAB CONTENT ================= */}
      {activeTab === 'API' && (
        <div className="api-content fade-in">
           <h2 className="text-xl mb-4">API Configuration</h2>
           <p className="text-gray-400">Manage your API keys here.</p>
        </div>
      )}
    </div>
  );
};

// SVG Icon - Checkmark สีเขียว
const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default Profile;