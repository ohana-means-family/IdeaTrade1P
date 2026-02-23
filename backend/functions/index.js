const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// 👇 แก้ไขบรรทัด admin.initializeApp() เป็นแบบนี้:
const serviceAccount = require("./service-account.json"); // ใส่ชื่อไฟล์ที่คุณตั้งไว้

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// -----------------------------------------
// 1. ตั้งค่าระบบส่งอีเมล 
// -----------------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jabjidjang@gmail.com", 
    pass: "abff gzvt mvik sjqf",    
  },
});

// -----------------------------------------
// API 1: ขอ OTP (สุ่มเลข เซฟลงฐานข้อมูล และส่งอีเมล)
// -----------------------------------------
exports.requestOTP = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const email = req.body.email;
    if (!email) return res.status(400).send({ error: "กรุณาระบุอีเมล" });

    // สุ่มเลข 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // เซฟลง Firestore
      await db.collection("otp").doc(email).set({
        otp: otp, // 👇 (จุดที่ 2) แก้จาก otpCode เป็น otp ให้ตรงกับตัวแปรด้านบน
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60000), 
      });

      // ส่งอีเมล
      const mailOptions = {
        from: "jabjidjang@gmail.com", // 👇 (จุดที่ 3) แก้อีเมลผู้ส่งให้ตรงกับบัญชีที่ใช้ส่ง
        to: email,
        subject: "รหัส OTP สำหรับเข้าสู่ระบบ Idea Trade",
        html: `<h2>ยินดีต้อนรับสู่ Idea Trade</h2>
               <p>รหัส OTP ของคุณคือ: <strong style="font-size: 24px;">${otp}</strong></p>
               <p>รหัสนี้จะหมดอายุใน 5 นาที</p>`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).send({ success: true, message: "ส่ง OTP สำเร็จ" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ error: "ไม่สามารถส่งอีเมลได้" });
    }
  });
});

// -----------------------------------------
// API 2: ยืนยัน OTP (เช็คเลข และสร้างตั๋ว Login)
// -----------------------------------------
exports.verifyOTP = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).send({ error: "ข้อมูลไม่ครบถ้วน" });

    try {
      // ดึงข้อมูล OTP จาก Firestore 
      // 👇 (จุดที่ 4) แก้จาก "otps" เป็น "otp" ให้ชื่อตารางตรงกันกับตอนเซฟ
      const doc = await db.collection("otp").doc(email).get();
      if (!doc.exists) return res.status(400).send({ error: "ไม่พบข้อมูล OTP หรือ OTP หมดอายุแล้ว" });

      const data = doc.data();

      // เช็คว่าเลขตรงไหม
      if (data.otp !== otp) return res.status(400).send({ error: "รหัส OTP ไม่ถูกต้อง" });

      // เช็คเวลาหมดอายุ
      if (data.expiresAt.toDate() < new Date()) {
        return res.status(400).send({ error: "รหัส OTP หมดอายุแล้ว" });
      }

      // ถ้าผ่านทั้งหมด: ตรวจสอบบัญชีผู้ใช้
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(email);
      } catch (e) {
        // ถ้าไม่มีบัญชีนี้ในระบบ ให้สมัครสมาชิกให้เลย
        if (e.code === 'auth/user-not-found') {
          userRecord = await admin.auth().createUser({ email: email });
        } else {
          throw e;
        }
      }

      // สร้าง Custom Token (ตั๋วพิเศษสำหรับให้หน้าบ้านใช้ Login)
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      // ลบ OTP ทิ้ง เพื่อไม่ให้ใช้ซ้ำได้อีก
      await db.collection("otp").doc(email).delete();

      // ส่ง Token กลับไปให้หน้าบ้าน
      res.status(200).send({ success: true, token: customToken });

    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ error: "ระบบยืนยันตัวตนขัดข้อง" });
    }
  });
});