# 📌 Idea Trade 1 — Frontend

เว็บแอปพลิเคชันฝั่ง **Frontend** สำหรับแพลตฟอร์ม Idea Trade
พัฒนาด้วย **React + Vite** โดยใช้ **Tailwind CSS ควบคู่กับ Material UI (MUI)**
ออกแบบให้เป็นโครงสร้างแบบ Component-based รองรับ Responsive และต่อยอดฟีเจอร์ได้ง่าย

---

## 🎯 วัตถุประสงค์โปรเจค

- สร้าง Landing Page และ Dashboard สำหรับแพลตฟอร์ม Idea Trade
- รองรับผู้ใช้ทั่วไป (Guest) และสมาชิก (Membership)
- แยก Layout ตามสถานะผู้ใช้ (ก่อน / หลัง Login)
- รองรับการพัฒนาเป็น SaaS / Trading Platform ในอนาคต

---

## 🛠 Tech Stack

| หมวด | Package | Version |
|---|---|---|
| UI Library | `react` | ^19.2.0 |
| UI Library | `react-dom` | ^19.2.0 |
| Build Tool | `vite` | ^7.2.4 |
| Routing | `react-router-dom` | ^7.12.0 |
| CSS Framework | `tailwindcss` | ^3.4.17 |
| UI Components | `@mui/material` | ^7.3.8 |
| MUI Icons | `@mui/icons-material` | ^7.3.8 |
| Styling Engine | `@emotion/react` | ^11.14.0 |
| Styling Engine | `@emotion/styled` | ^11.14.1 |
| HTTP Client | `axios` | ^1.13.6 |
| Auth / DB | `firebase` | ^12.8.0 |
| Charts | `lightweight-charts` | ^5.1.0 |
| Icons | `lucide-react` | ^0.574.0 |
| Skeleton UI | `react-loading-skeleton` | ^3.5.0 |

> 🔎 **แนวคิดหลัก**
> - **Tailwind CSS** → layout, spacing, responsive, utility styles
> - **MUI** → component ที่มี logic (Button, Dialog, Layout, Form ฯลฯ)

---

## 📁 โครงสร้างโปรเจค

```txt
src/
├─ assets/
│  ├─ images/                  # รูปภาพ (logo, icon, banner)
│  └─ styles/
│     └─ index.css             # Tailwind base / components / utilities
│
├─ components/                 # Reusable Components
│  ├─ buttons/
│  │  └─ PrimaryButton.jsx
│  ├─ cards/
│  │  └─ ProjectCard.jsx
│  └─ common/
│     └─ Logo.jsx
│
├─ layouts/                    # Layout หลักของแต่ละกลุ่มหน้า
│  ├─ PublicLayout.jsx         # Landing / Welcome / Register
│  └─ DashboardLayout.jsx      # Layout หลัง Login
│
├─ pages/                      # Page ตาม Route
│  ├─ Landing/
│  │  └─ Landing.jsx
│  ├─ Welcome/
│  │  └─ Welcome.jsx
│  ├─ Register/
│  │  └─ Register.jsx
│  ├─ MemberRegister/
│  │  └─ MemberRegister.jsx
│  └─ Dashboard/
│     └─ Dashboard.jsx
│
├─ routes/
│  └─ AppRoutes.jsx            # กำหนด Routing ของระบบ
│
├─ theme/
│  ├─ theme.js                 # Theme กลาง (สี / config)
│  └─ muiTheme.js              # MUI Theme
│
├─ App.jsx                     # Root Component
└─ main.jsx                    # Entry Point + Provider ต่าง ๆ
```

---

## 🎨 Tailwind CSS

### ติดตั้ง

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### src/assets/styles/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

import ใน `main.jsx`

```jsx
import "@/assets/styles/index.css";
```

---

## 🤝 การใช้ Tailwind CSS ร่วมกับ MUI

```jsx
import { Button } from "@mui/material";

<Button
  variant="contained"
  className="!rounded-xl !px-6 !py-3"
>
  Submit
</Button>
```

> ℹ️ ใช้ `!` (important prefix) เพื่อ override style ของ MUI เมื่อจำเป็น

---

## 🔥 Firebase Integration

โปรเจคนี้ใช้ Firebase สำหรับระบบ Authentication และสามารถต่อยอดไปใช้ Firestore / Storage ได้ในอนาคต

### ติดตั้ง

```bash
npm install firebase
```

### src/firebase.js

```js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### Environment Variables (.env)

```env
VITE_FIREBASE_API_KEY=xxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxx
VITE_FIREBASE_PROJECT_ID=xxxxxxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxxxxxx
```

> ⚠️ ห้าม commit `.env` ขึ้น GitHub — เพิ่มใน `.gitignore`

### Google Sign-In

```jsx
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google User:", result.user);
  } catch (error) {
    console.error(error);
  }
};
```

เปิดใช้งานใน Firebase Console → Authentication → Sign-in method → Google → Enable

---

## 🚀 การรันโปรเจค

```bash
npm install
npm run dev
```

เปิดเว็บที่ `http://localhost:5173`

### Scripts

| คำสั่ง | ความหมาย |
|---|---|
| `npm run dev` | รัน dev server |
| `npm run build` | build สำหรับ production |
| `npm run preview` | preview build |
| `npm run lint` | ตรวจสอบ code ด้วย ESLint |