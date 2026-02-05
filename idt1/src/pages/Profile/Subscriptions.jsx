import React, { useState } from 'react';
import './Subscriptions.css'; // อย่าลืมสร้างไฟล์ CSS นี้นะครับ

const ManageSubscription = () => {
  // Mock Data ตามรูปภาพ
  const subscriptions = [
    {
      id: 1,
      category: 'RECENTLY ENDED',
      name: 'Rubber Thai',
      cycle: 'monthly',
      status: 'inactive', // inactive, active
      statusDetail: 'Ended 26 jan 2026',
      price: '2500BH',
      action: 'Renew',
      paymentMethod: 'credit card'
    },
    {
      id: 2,
      category: 'ENDING SOON',
      name: 'S50',
      cycle: 'monthly',
      status: 'active',
      statusDetail: 'Ends in 5 days',
      price: '2500BH',
      action: 'pay',
      paymentMethod: 'credit card'
    },
    {
      id: 3,
      category: 'ACTIVE',
      name: 'BidAsk',
      cycle: 'monthly',
      status: 'active',
      statusDetail: 'paid 10 jan 2026',
      price: '2500BH',
      action: 'pay',
      paymentMethod: 'credit card'
    },
    {
      id: 4,
      category: 'ACTIVE',
      name: 'BidAsk', // สมมติว่าเป็นตัวอื่นหรือตัวเดิมตามรูป
      cycle: 'monthly',
      status: 'active',
      statusDetail: 'paid 10 jan 2026',
      price: '2500BH',
      action: 'pay',
      paymentMethod: 'credit card'
    },
    {
      id: 5,
      category: 'ACTIVE',
      name: 'BidAsk',
      cycle: 'monthly',
      status: 'active',
      statusDetail: 'paid 10 jan 2026',
      price: '2500BH',
      action: 'pay',
      paymentMethod: 'credit card'
    }
  ];

  // Group Data ตาม Category
  const groupedSubs = {
    'RECENTLY ENDED': subscriptions.filter(s => s.category === 'RECENTLY ENDED'),
    'ENDING SOON': subscriptions.filter(s => s.category === 'ENDING SOON'),
    'ACTIVE': subscriptions.filter(s => s.category === 'ACTIVE'),
  };

  return (
    <div className="sub-page-container">
      
      {/* Header */}
      <div className="sub-header">
        <h1>Your subscriptions</h1>
        <div className="sub-summary">
          <span>Monthly <span className="bold">800BH</span></span>
          <span className="ml-4">Yearly <span className="bold">20000BH</span></span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sub-toolbar">
        <div className="search-wrapper">
          <SearchIcon />
          <input type="text" placeholder="search" className="search-input" />
        </div>
        <button className="btn-add-tool">
          <PlusIcon /> Add new tool
        </button>
      </div>

      {/* Table Header */}
      <div className="sub-table-header">
        <div className="col-name">Tool name</div>
        <div className="col-cycle">Cycle</div>
        <div className="col-status">status</div>
        <div className="col-price">Price</div>
        <div className="col-actions">Actions</div>
        <div className="col-payment">payment method</div>
      </div>

      {/* Content Rows */}
      {Object.keys(groupedSubs).map((category) => (
        groupedSubs[category].length > 0 && (
          <div key={category} className="sub-section">
            <h3 className="section-title">{category}</h3>
            
            {groupedSubs[category].map((item) => (
              <div key={item.id} className="sub-card-row">
                <div className="col-name font-bold">{item.name}</div>
                <div className="col-cycle">{item.cycle}</div>
                
                {/* Status Column with Logic */}
                <div className="col-status status-wrapper">
                  {item.status === 'inactive' ? (
                    <div className="status-indicator inactive">
                      <XCircleIcon />
                      <div>
                        <span className="status-text">Inactive</span>
                        <span className="status-date">{item.statusDetail}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="status-indicator active">
                      <CheckCircleIcon />
                      <div>
                        <span className="status-text">Active</span>
                        <span className="status-date">{item.statusDetail}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-price font-bold">{item.price}</div>
                
                <div className="col-actions">
                  <button className={`btn-action ${item.action === 'Renew' ? 'renew' : 'pay'}`}>
                    {item.action}
                  </button>
                </div>
                
                <div className="col-payment">{item.paymentMethod}</div>
              </div>
            ))}
          </div>
        )
      ))}

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
const XCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default ManageSubscription;