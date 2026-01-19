# 📌 Idea Trade 1 Project

เว็บแอปพลิเคชันฝั่ง Frontend ที่พัฒนาด้วย **React.js** และ **Material UI (MUI)**
เน้นโครงสร้างแบบ Component, รองรับ Responsive และง่ายต่อการพัฒนาต่อยอด

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

* **React.js** – ไลบรารีสำหรับพัฒนา Frontend
* **Vite** – เครื่องมือสำหรับรันและ build โปรเจค
* **Material UI (MUI)** – UI / CSS Framework
* **Emotion** – ระบบจัดการ style ของ MUI
* **JavaScript (ES6+)**

---

## 📂 โครงสร้างโปรเจค

```
src/
├─ assets/
│  ├─ images/            # รูปภาพ เช่น logo
│  └─ styles/
│
├─ components/           # UI ที่นำกลับมาใช้ซ้ำได้
│  ├─ buttons/
│  ├─ cards/
│  └─ common/
│
├─ layouts/              # Layout ของแต่ละกลุ่มหน้า
│  ├─ PublicLayout.jsx   # Landing / Welcome
│  └─ DashboardLayout.jsx
│
├─ pages/                # Page ตาม route
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
│  └─ AppRoutes.jsx      # รวม Route ทั้งหมด
│
├─ theme/
│  └─ theme.js           # MUI Theme
│
├─ App.jsx
└─ main.jsx
```
📦 แพ็กเกจที่ต้องติดตั้ง (Required Dependencies)

หลังจาก clone โปรเจค ให้ติดตั้งแพ็กเกจดังนี้

npm install

หรือถ้าติดตั้งเองทีละตัว

npm install react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

---

## 🚀 วิธีเริ่มต้นใช้งานโปรเจค

### 1. Clone โปรเจค

```bash
git clone https://github.com/ohana-means-family/IdeaTrade1P.git
cd idt1
```

### 2. ติดตั้ง dependencies

```bash
npm install
```

### 3. รันโปรเจค

```bash
npm run dev
```

จากนั้นเปิดเว็บที่
👉 `http://localhost:5173`

---

## 📦 แพ็กเกจที่ติดตั้งเพิ่มเติม

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

🔗 Path Alias (@)

โปรเจคนี้ตั้งค่า alias ให้ใช้ @ แทน path src

ตัวอย่าง:

import Landing from "@/pages/Landing/Landing";
import Sidebar from "@/components/common/Sidebar";

Alias @ ชี้ไปที่โฟลเดอร์ src/

---

## 🎨 การตั้งค่า Material UI Theme

โปรเจคนี้ใช้ **ThemeProvider** ของ MUI เพื่อควบคุมสีและรูปแบบของ UI ทั้งระบบ

ไฟล์ตั้งค่าอยู่ที่:

```text
src/theme/theme.js
```

ตัวอย่างการใช้งานใน `main.jsx`

```jsx
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>


