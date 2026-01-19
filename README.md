# 📌 Idea Trade 1 Project

เว็บแอปพลิเคชันฝั่ง Frontend ที่พัฒนาด้วย **React.js** และ **Material UI (MUI)**
เน้นโครงสร้างแบบ Component, รองรับ Responsive และง่ายต่อการพัฒนาต่อยอด

---

ได้เลย เดี๋ยวผม **เพิ่มเติมเนื้อหา README เฉพาะส่วนที่เกี่ยวกับ Tailwind CSS** ให้ โดยจะเขียนในสไตล์เดียวกับไฟล์เดิม เพื่อให้เอาไปวางต่อได้ทันที 👌

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

* **React.js** – ไลบรารีสำหรับพัฒนา Frontend
* **Vite** – เครื่องมือสำหรับรันและ build โปรเจค
* **Material UI (MUI)** – UI Component Framework
* **Tailwind CSS** – Utility-first CSS Framework
* **Emotion** – ระบบจัดการ style ของ MUI
* **JavaScript (ES6+)**

> 🔎 โปรเจคนี้ใช้ **MUI ควบคู่กับ Tailwind CSS**
>
> * MUI ใช้สำหรับ Component หลัก (Button, Dialog, Layout ฯลฯ)
> * Tailwind ใช้สำหรับจัด layout, spacing, responsive และ utility style ต่าง ๆ

---

src/
├─ assets/
│  ├─ images/                  # รูปภาพ (logo, icon, banner)
│  └─ styles/
│     └─ index.css              # Tailwind base / components / utilities
│
├─ components/                 # Component ที่ใช้ซ้ำได้
│  ├─ buttons/                 # ปุ่มต่าง ๆ
│  ├─ cards/                   # Card / UI block
│  └─ common/                  # Component กลาง (Navbar, Sidebar, Footer)
│
├─ layouts/                    # Layout หลักของแต่ละกลุ่มหน้า
│  ├─ PublicLayout.jsx          # Landing / Welcome / Register
│  └─ DashboardLayout.jsx      # Layout หลัง Login
│
├─ pages/                      # Page ตาม Route
│  ├─ Landing/
│  │  └─ Landing.jsx            # หน้า Landing
│  │
│  ├─ Welcome/
│  │  └─ Welcome.jsx            # หน้า Welcome
│  │
│  ├─ Register/
│  │  └─ Register.jsx           # สมัครผู้ใช้ทั่วไป
│  │
│  ├─ MemberRegister/
│  │  └─ MemberRegister.jsx     # สมัครสมาชิก (Membership)
│  │
│  └─ Dashboard/
│     └─ Dashboard.jsx          # หน้า Dashboard หลัก
│
├─ routes/
│  └─ AppRoutes.jsx             # กำหนด routing ของระบบ
│
├─ theme/
│  └─ theme.js                  # MUI Theme (สี, typography)
│
├─ App.jsx                      # Root Component
└─ main.jsx                     # Entry point + Provider ต่าง ๆ

---

## 🎨 การใช้งาน Tailwind CSS ในโปรเจค

โปรเจคนี้ได้ติดตั้งและตั้งค่า **Tailwind CSS** เรียบร้อยแล้ว เพื่อช่วยให้การจัด layout และ responsive ทำได้รวดเร็วและยืดหยุ่น

### 📦 แพ็กเกจที่เกี่ยวข้องกับ Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### ⚙️ ไฟล์ตั้งค่า Tailwind

**tailwind.config.js**

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
}
```

---

### 🧩 การ import Tailwind เข้าโปรเจค

เพิ่ม directive ของ Tailwind ในไฟล์ CSS หลัก เช่น

**src/assets/styles/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

และ import ไฟล์นี้ใน `main.jsx`

```jsx
import "@/assets/styles/index.css";
```

---

### ✨ ตัวอย่างการใช้งาน Tailwind ร่วมกับ React

```jsx
<div className="flex min-h-screen items-center justify-center bg-gray-100">
  <div className="rounded-xl bg-white p-6 shadow-md">
    <h1 className="text-2xl font-bold text-gray-800">
      Welcome to Idea Trade
    </h1>
  </div>
</div>
```

---

### 🤝 การใช้ Tailwind ร่วมกับ MUI

สามารถใช้ Tailwind ควบคู่กับ MUI ได้ เช่น

```jsx
<Button
  variant="contained"
  className="!rounded-xl !px-6 !py-3"
>
  Submit
</Button>
```

> ℹ️ ใช้ `!` (important) เพื่อ override style ของ MUI เมื่อจำเป็น

