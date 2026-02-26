import React, { useState, useEffect } from 'react';
import './Subscriptions.css';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "/src/firebase"; 
// ✅ 1. เพิ่ม import สำหรับ onAuthStateChanged
import { onAuthStateChanged } from "firebase/auth"; 

const ManageSubscription = () => {
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [summary, setSummary] = useState({ monthly: 0, yearly: 0 });

  useEffect(() => {
    // ✅ 2. สร้างฟังก์ชันจัดรูปแบบและคำนวณยอด (ใช้ร่วมกันทั้งระบบจริงและ Demo)
    const processAndSetSubscriptions = (savedSubs) => {
      const activeSubs = savedSubs.map((sub, index) => {
        // แปลงวันที่ซื้อให้สวยงาม (กัน error กรณีไม่มีวันที่)
        const dateObj = new Date(sub.purchaseDate || new Date());
        const dateStr = dateObj.toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        });

        // คำนวณราคาเป็นตัวเลขเพื่อเอาไปรวมยอด (ลบลูกน้ำและ THB ออก)
        const priceValue = parseInt(String(sub.price).replace(/,/g, '').replace(' THB', '')) || 0;

        return {
          ...sub, // เอาข้อมูลเดิมมาด้วย
          key: `sub-${index}`, 
          statusDetail: `Paid on ${dateStr}`,
          priceValue: priceValue 
        };
      });

      setMySubscriptions(activeSubs);

      // --- 🧮 คำนวณยอดรวมจากข้อมูล ---
      const totalM = activeSubs
        .filter(s => s.cycle === 'Monthly')
        .reduce((sum, item) => sum + item.priceValue, 0);

      const totalY = activeSubs
        .filter(s => s.cycle === 'Yearly')
        .reduce((sum, item) => sum + item.priceValue, 0);

      setSummary({ monthly: totalM, yearly: totalY });
    };

    // ✅ 3. ฟังก์ชันสำหรับโหลดโหมด Demo (ไม่ได้ล็อกอิน)
    const loadDemoSubscriptions = () => {
      try {
        const saved = localStorage.getItem('userProfile');
        const savedSubs = saved ? JSON.parse(saved).mySubscriptions || [] : [];
        processAndSetSubscriptions(savedSubs);
      } catch (e) {
        console.error("Error loading demo subscriptions:", e);
      }
    };

    // ✅ 4. ดักจับสถานะล็อกอินและดึงข้อมูลให้ถูกแหล่ง
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // 🔥 โหมดล็อกอินจริง: ดึงจาก Firebase
          try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              processAndSetSubscriptions(userData.mySubscriptions || []);
            } else {
              processAndSetSubscriptions([]);
            }
          } catch (e) {
            console.error("Error loading subscriptions from Firebase:", e);
          }
        } else {
          // 🔥 โหมด DEMO: ดึงจาก LocalStorage
          loadDemoSubscriptions();
        }
    });

    // ดักฟัง Event กรณีมีการกดซื้อ Demo จากหน้าอื่น
    window.addEventListener("storage", loadDemoSubscriptions);

    // Cleanup function
    return () => {
      unsubscribe();
      window.removeEventListener("storage", loadDemoSubscriptions);
    };

  }, []);

  return (
    <div className="sub-page-container">
      
      {/* Header & Summary */}
      <div className="sub-header">
        <h1>Your subscriptions</h1>
        <div className="sub-summary">
          <span>Monthly <span className="bold">{summary.monthly.toLocaleString()} THB</span></span>
          <span className="ml-4">Yearly <span className="bold">{summary.yearly.toLocaleString()} THB</span></span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sub-toolbar">
        <div className="search-wrapper">
          <SearchIcon />
          <input type="text" placeholder="Search tool..." className="search-input" />
        </div>
        <button className="btn-add-tool">
          <PlusIcon /> Add new Tools
        </button>
      </div>

      {/* Table Header */}
      <div className="sub-table-header">
        <div className="col-name">Tool name</div>
        <div className="col-cycle">Cycle</div>
        <div className="col-status">Status / Date</div>
        <div className="col-price">Price</div>
        <div className="col-actions">Actions</div>
        <div className="col-payment">Payment Method</div>
      </div>

      {/* Content Section */}
      {mySubscriptions.length > 0 ? (
        <div className="sub-section">
          <h3 className="section-title">ACTIVE TOOLS</h3>
          
          {mySubscriptions.map((item) => (
            <div key={item.key} className="sub-card-row">
              <div className="col-name font-bold">{item.name}</div>
              
              {/* แสดง Cycle จริงที่ดึงมา */}
              <div className="col-cycle" style={{ textTransform: 'capitalize' }}>
                {item.cycle}
              </div>
              
              <div className="col-status status-wrapper">
                <div className="status-indicator active">
                  <CheckCircleIcon />
                  <div>
                    <span className="status-text">Active </span>
                    <span className="status-date">{item.statusDetail}</span>
                  </div>
                </div>
              </div>

              <div className="col-price font-bold">{item.price}</div>
              
              <div className="col-actions">
                <button className="btn-action pay">
                  Pay
                </button>
              </div>
              
              <div className="col-payment">{item.paymentMethod}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-state" style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
          <p>You don't have any active subscriptions yet.</p>
        </div>
      )}

    </div>
  );
};

// --- Icons ---
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default ManageSubscription;