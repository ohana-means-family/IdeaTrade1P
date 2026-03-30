import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App.jsx';

// 🟢 Import ตัว Provider ทั้งสองตัว
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext.jsx'; 

// 🟢 สั่ง Render แค่รอบเดียว และเอา Provider ซ้อนกัน
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ให้ AuthProvider อยู่ข้างนอกสุด */}
    <AuthProvider>
      <SubscriptionProvider>
        <App />
      </SubscriptionProvider>
    </AuthProvider>
  </StrictMode>
);