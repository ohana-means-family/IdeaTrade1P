# 📌 Idea Trade 1 — Backend

เซิร์ฟเวอร์ฝั่ง **Backend** สำหรับแพลตฟอร์ม Idea Trade
พัฒนาด้วย **Node.js + Express 5** รองรับการเชื่อมต่อกับ Firebase Admin SDK
และออกแบบให้เป็น REST API สำหรับให้บริการฝั่ง Frontend

---

## 🎯 วัตถุประสงค์

- ให้บริการ REST API สำหรับ Frontend (Idea Trade)
- จัดการ Authentication ผ่าน Firebase Admin SDK
- รองรับการต่อยอด Business Logic และเชื่อมต่อข้อมูลในอนาคต

---

## 🛠 Tech Stack

| หมวด | Package | Version |
|---|---|---|
| Runtime | Node.js | — |
| Web Framework | `express` | ^5.2.1 |
| Auth / Admin | `firebase-admin` | ^13.7.0 |
| CORS | `cors` | ^2.8.6 |
| Env Variables | `dotenv` | ^17.3.1 |
| Dev Server | `nodemon` | ^3.1.14 |

---

## 📁 โครงสร้างโปรเจค

```txt
backend/
├─ server.js          # Entry Point — ตั้งค่า Express และ Routes
├─ .env               # Environment Variables (ห้าม commit)
├─ .gitignore
└─ package.json
```

> 📌 สามารถขยายโครงสร้างเพิ่มได้ เช่น `routes/`, `controllers/`, `middlewares/`

---

## ⚙️ การติดตั้ง

```bash
npm install
```

---

## 🌱 Environment Variables (.env)

สร้างไฟล์ `.env` ที่ root ของ backend

```env
PORT=3000

# Firebase Admin SDK (Service Account)
FIREBASE_PROJECT_ID=xxxxxxxxxxxx
FIREBASE_CLIENT_EMAIL=xxxxxxxxxxxx
FIREBASE_PRIVATE_KEY=xxxxxxxxxxxx
```

> ⚠️ ห้าม commit `.env` ขึ้น GitHub — เพิ่มใน `.gitignore`

---

## 🔥 Firebase Admin SDK

ใช้สำหรับ verify token และจัดการ user ฝั่ง server

### ตัวอย่างการตั้งค่า

```js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

export default admin;
```

---

## 🌐 CORS Configuration

เปิดใช้งาน CORS เพื่อให้ Frontend เรียก API ได้

```js
import cors from "cors";

app.use(cors({
  origin: "http://localhost:5173", // Frontend dev URL
}));
```

---

## 🚀 การรันโปรเจค

### Development (มี auto-restart)

```bash
npm run dev
```

### Production

```bash
npm start
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3000` (หรือตาม `PORT` ใน `.env`)

### Scripts

| คำสั่ง | ความหมาย |
|---|---|
| `npm run dev` | รันด้วย nodemon (auto-restart เมื่อแก้ไขไฟล์) |
| `npm start` | รันด้วย node ปกติ (production) |

---

## 🔗 การเชื่อมต่อกับ Frontend

Frontend ใช้ `axios` เพื่อเรียก API

```js
// ตัวอย่างใน Frontend
import axios from "axios";

const res = await axios.get("http://localhost:3000/api/example");
```

ดู README-frontend.md สำหรับรายละเอียดฝั่ง Frontend