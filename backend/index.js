const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// 1. นำเข้าไฟล์กุญแจลับ
const serviceAccount = require('./firebase-key.json');

// 2. ตั้งค่าเชื่อมต่อ Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// API: สมัครสมาชิก (บันทึกลง Firebase ตรงๆ ไม่ผ่าน OTP)
// ==========================================
app.post('/api/register', async (req, res) => {
  try {
    const { email, firstName, lastName, phone } = req.body;

    // 1. เช็คก่อนว่ามีอีเมลนี้ในระบบหรือยัง
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (!snapshot.empty) {
      return res.status(400).json({ error: "มีอีเมลนี้ในระบบแล้ว กรุณาใช้ชื่ออื่น" });
    }

    // 2. กำหนดวันหมดอายุสมาชิก (ให้ฟรี 30 วัน)
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30); 

    // 3. เตรียมข้อมูล
    const newUser = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      memberExpireAt: expireDate,
      createdAt: new Date()
    };

    // 4. บันทึกลงตาราง users ใน Firestore
    const docRef = await db.collection('users').add(newUser);

    console.log("บันทึกข้อมูลสำเร็จ! ID:", docRef.id); // พิมพ์บอกใน Terminal
    res.json({ message: "สมัครสมาชิกสำเร็จและบันทึกลงฐานข้อมูลแล้ว!" });

  } catch (error) {
    console.error("Error saving to Firebase:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล" });
  }
});

// ==========================================
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});