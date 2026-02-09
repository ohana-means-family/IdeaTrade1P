import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  // Mock Data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    lastLogin: '',
    isVerified: true
  });

  useEffect(() => {
    // Logic จัดการ Last Login
    const storedProfile = localStorage.getItem("userProfile");
    let profile = storedProfile ? JSON.parse(storedProfile) : {};
    let timestamp = profile.loginTime; 

    if (!timestamp) {
      timestamp = new Date();
      profile.loginTime = timestamp;
      localStorage.setItem("userProfile", JSON.stringify(profile));
    } else {
      timestamp = new Date(timestamp);
    }

    const day = timestamp.getDate();
    const month = timestamp.toLocaleString('en-US', { month: 'long' });
    const year = timestamp.getFullYear();
    const hours = String(timestamp.getHours()).padStart(2, '0');
    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
    
    // Format: 13 May 2026, 14:32
    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

    setUserData(prev => ({
        ...prev,
        lastLogin: formattedDate
    }));
  }, []);

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
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="dark-input"
                    value={userData.lastName}
                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
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
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
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
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="form-actions">
                <button className="btn-save-changes">
                  <LockIcon /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Profile Summary Only (Pro Plan Removed) --- */}
          <div className="sidebar-column">
            
            {/* User Info Card */}
            <div className="card profile-summary-card">
              <div className="avatar-circle">
                <UserIconLarge />
              </div>
              <h3 className="user-fullname">{userData.firstName} {userData.lastName}</h3>
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