# 🌿 EcoLink Platform - Industrial Waste Matching & AI ESG Analytics

> **แพลตฟอร์มตลาดกลางซื้อขายกากอุตสาหกรรม และระบบวิเคราะห์จับคู่อัจฉริยะเพื่อเศรษฐกิจหมุนเวียน (Circular Economy)**  
> พัฒนาด้วย **Node.js (Express)**, **MongoDB ใน Docker Container**, **Mongo Express Web UI** และส่วนติดต่อผู้ใช้ **Enterprise Portal Design System**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express_4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Docker-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Container-Docker_Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 📖 สารบัญ (Table of Contents)
1. [ภาพรวมของแพลตฟอร์ม (Platform Overview)](#-ภาพรวมของแพลตฟอร์ม-platform-overview)
2. [เทคโนโลยีที่ใช้ (Tech Stack)](#-เทคโนโลยีที่ใช้-tech-stack)
3. [โครงสร้างโปรเจกต์ (Project Structure)](#-โครงสร้างโปรเจกต์-project-structure)
4. [ภาพรวมหน้าเว็บและฟังก์ชันการทำงาน (Web Pages & UI Features)](#-ภาพรวมหน้าเว็บและฟังก์ชันการทำงาน-web-pages--ui-features)
5. [ระบบฐานข้อมูลและ Docker (Database & Docker Architecture)](#-ระบบฐานข้อมูลและ-docker-database--docker-architecture)
6. [คู่มือการติดตั้งและเริ่มใช้งาน (Getting Started)](#-คู่มือการติดตั้งและเริ่มใช้งาน-getting-started)
7. [เอกสาร RESTful API Endpoints](#-เอกสาร-restful-api-endpoints)
8. [ตัวอย่างการทดสอบระบบ (Testing Examples)](#-ตัวอย่างการทดสอบระบบ-testing-examples)

---

## 🌟 ภาพรวมของแพลตฟอร์ม (Platform Overview)

**EcoLink** คือแพลตฟอร์ม B2B ที่เชื่อมโยงระหว่าง **"โรงงานผู้ผลิตที่มีของเสีย/วัสดุเหลือใช้"** กับ **"โรงงานผู้ซื้อหรือโรงงานรีไซเคิล"** ที่ต้องการนำวัสดุเหล่านั้นไปแปรรูปเป็นวัตถุดิบ ช่วยเปลี่ยนต้นทุนการกำจัดขยะให้กลายเป็นรายได้ พร้อมทั้งช่วยลดผลกระทบต่อสิ่งแวดล้อมผ่านระบบคำนวณ **Carbon Footprint Metrics**

### ✨ ไฮไลท์สำคัญของระบบ
* 🤖 **AI Matching Engine:** คำนวณระยะทาง ความน่าเชื่อถือ (Trust Score) และประเภทวัสดุที่รองรับเพื่อแนะนำโรงงานที่คุ้มค่าที่สุด
* 📊 **ESG Executive Dashboard:** รายงานการลดการปล่อยก๊าซเรือนกระจกสะสม (`kgCO2e`) พร้อมกราฟวิเคราะห์แนวโน้มรายเดือนและสัดส่วนของเสีย
* 🛒 **B2B Marketplace:** ตลาดกลางค้นหาและคัดกรองวัสดุรีไซเคิล พร้อมระบบเจรจาต่อรองราคา
* 🛡️ **Factory KYC Verification:** ระบบยืนยันตัวตนโรงงานด้วยใบอนุญาตประกอบกิจการ (ร.ง.4) เพื่อรับป้าย Verified Member
* 🔒 **Escrow Protection:** ระบบจำลองการคุ้มครองการชำระเงินจนกว่าจะมีการตรวจรับสินค้าและประสานงานโลจิสติกส์

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Backend & API
* **Runtime:** Node.js (v18+)
* **Framework:** Express.js 4.x (สถาปัตยกรรม Modular Router Pattern)
* **Authentication:** JSON Web Token (JWT), Bcrypt Password Hashing, Google OAuth 2.0 (`google-auth-library`)
* **File Uploads:** Multer (รองรับไฟล์ PDF, JPG, PNG สำหรับเอกสาร KYC)

### Database & Containerization
* **Database:** MongoDB (Official Image บน Docker พร้อม Persistent Volume)
* **Database Management:** Mongo Express Web UI (พอร์ต 8081)
* **Orchestration:** Docker Compose (จัดการ Multi-container พร้อม Healthchecks และ Auto-restart)

### Frontend Architecture
* **Design System:** Centralized CSS Design Tokens (`frontend/css/style.css`) สไตล์ **Eco-Tech Enterprise (Emerald & Slate)**
* **Client Controller:** Shared Session & Layout Manager (`frontend/js/app.js`)
* **Data Visualization:** Chart.js (Line Trends & Doughnut Chart)
* **UI Modals & Alerts:** SweetAlert2

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
ecolink-api/
├── backend/                       # โค้ดส่วน Backend RESTful API (Modular Architecture)
│   ├── config/
│   │   └── db.js                  # เชื่อมต่อ MongoDB พร้อมระบบ Auto-Retry และ Seeder
│   ├── middleware/
│   │   ├── auth.js                # JWT Bearer Token Authentication Middleware
│   │   └── upload.js              # Multer File Upload Middleware (จัดเก็บเอกสาร KYC)
│   ├── models/
│   │   ├── Factory.js             # Data Model สำหรับโรงงานรับซื้อ/รีไซเคิล
│   │   ├── User.js                # Data Model สำหรับผู้ใช้งานและสถานะ KYC
│   │   └── Waste.js               # Data Model สำหรับรายการกากอุตสาหกรรม
│   ├── routes/
│   │   ├── auth.js                # API การยืนยันตัวตน (Register, Login, Google OAuth)
│   │   ├── dashboard.js           # API สถิติภาพรวม แดชบอร์ด ESG และ Carbon Metrics
│   │   ├── marketplace.js         # API ตลาดกลาง B2B และการสั่งซื้อสินค้า
│   │   ├── users.js               # API ข้อมูลผู้ใช้ และการอัปโหลดเอกสาร KYC (ร.ง.4)
│   │   └── wastes.js              # API จัดการของเสีย, AI Grading และ AI Matching
│   ├── uploads/                   # โฟลเดอร์สำหรับจัดเก็บไฟล์อัปโหลด KYC (มี .gitkeep)
│   └── server.js                  # Server Entry Point (Express, CORS, Router Mounting)
├── docker/
│   └── init-mongo.js              # สคริปต์ Initialize Collections และ Seed Data ใน Docker
├── frontend/                      # เว็บแอปพลิเคชัน UI (Enterprise Portal Design)
│   ├── css/
│   │   └── style.css              # Master Stylesheet, Design Tokens, Grid, Components & Drawer
│   ├── js/
│   │   └── app.js                 # Shared Portal Controller (Auth, Session, Mobile Drawer, KYC)
│   ├── add-waste.html             # หน้าลงทะเบียนกากอุตสาหกรรม + AI Processing Modal
│   ├── dashboard.html             # หน้า Analytics Dashboard (Metrics Cards, Charts & History)
│   ├── factories.html             # หน้าแสดงผลการวิเคราะห์ AI Matching และคะแนนความคุ้มค่า
│   ├── index.html                 # หน้า Landing Page หลักของแพลตฟอร์ม
│   ├── login.html                 # หน้าเข้าสู่ระบบ / สมัครสมาชิก พร้อม Google One Tap
│   └── marketplace.html           # หน้าตลาดกลางซื้อขาย B2B พร้อม Search Box & Filter Bar
├── .dockerignore                  # กำหนดไฟล์ที่ไม่รวมใน Docker Build
├── .env.example                   # ไฟล์ตัวอย่างการตั้งค่า Environment Variables
├── .gitignore                     # กำหนดไฟล์และโฟลเดอร์ที่ไม่นำขึ้น Git
├── docker-compose.yml             # จัดการ Multi-container (Node API + MongoDB + Mongo Express)
├── Dockerfile                     # คำสั่งสร้าง Docker Image สำหรับ Express API
├── package.json                   # การตั้งค่า Dependencies และ NPM Scripts
└── README.md                      # เอกสารอธิบายโครงสร้างและคู่มือระบบ
```

---

## 🖥️ ภาพรวมหน้าเว็บและฟังก์ชันการทำงาน (Web Pages & UI Features)

| หน้าเว็บ | เส้นทาง (Route) | คำอธิบายและฟังก์ชันเด่น |
| :--- | :--- | :--- |
| **Landing Page** | [`index.html`](file:///frontend/index.html) | หน้าแนะนำแพลตฟอร์ม, จุดเด่น 5 ขั้นตอนการทำงาน, สถิติผู้ใช้งาน, และ Navbar ตรวจจับสถานะการล็อกอินอัตโนมัติ |
| **Authentication** | [`login.html`](file:///frontend/login.html) | หน้าเข้าสู่ระบบและสมัครสมาชิกแบบ 2 ฝั่ง, รองรับการสลับแท็บอัตโนมัติจาก URL `#register`, Google OAuth, และปุ่ม Demo Account |
| **Executive Dashboard** | [`dashboard.html`](file:///frontend/dashboard.html) | แดชบอร์ดภาพรวม ESG, การ์ดแสดงผล Carbon Saved (`kgCO2e`), กราฟเส้นแนวโน้มคาร์บอน, กราฟสัดส่วนกากอุตสาหกรรม, และตารางประวัติรายการล่าสุด |
| **B2B Marketplace** | [`marketplace.html`](file:///frontend/marketplace.html) | ตลาดกลางซื้อขายกากอุตสาหกรรมแบบ B2B มีแถบค้นหา (Search Box) ตัวกรองประเภทของเสียและจังหวัด พร้อมปุ่มเจรจาต่อรองและสั่งซื้อ |
| **ลงทะเบียนของเสีย** | [`add-waste.html`](file:///frontend/add-waste.html) | ฟอร์มระบุประเภทของเสีย, ปริมาณ, จังหวัดที่ตั้ง, และชนิดรถขนส่ง พร้อม Modal AI Loader จำลองการประเมินเกรด |
| **โรงงานที่แนะนำ AI** | [`factories.html`](file:///frontend/factories.html) | แสดงรายการโรงงานที่เหมาะสมที่สุด คำนวณคะแนน AI Match Score, ระยะทางขนส่ง (กม.), Trust Score, และปุ่มยืนยันเปิดดีล |

---

## 🐳 ระบบฐานข้อมูลและ Docker (Database & Docker Architecture)

ระบบถูกจัดเตรียมให้อยู่ใน Container ภายใต้เครือข่าย `ecolink_network` เพื่อความสะดวกในการติดตั้งและพัฒนา:

```text
┌────────────────────────────────────────────────────────┐
│               Docker Network: ecolink_network          │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │     ecolink-db       │    │ecolink-mongo-express │  │
│  │   (MongoDB Engine)   │◄───│  (Web Management UI) │  │
│  │     Port: 27017      │    │     Port: 8081       │  │
│  └──────────┬───────────┘    └──────────────────────┘  │
│             │                                          │
│             ▲                                          │
│             │                                          │
│  ┌──────────┴───────────┐                              │
│  │     ecolink-api      │                              │
│  │   (Node.js Express)  │                              │
│  │     Port: 3000       │                              │
│  └──────────────────────┘                              │
└────────────────────────────────────────────────────────┘
```

1. **`ecolink-db` (MongoDB Engine)**:
   - รัน MongoDB บนพอร์ตมาตรฐาน `27017:27017`
   - ใช้ Named Volume `mongo_ecolink_data:/data/db` เพื่อรักษาข้อมูลให้คงอยู่ถาวร
   - เมานต์สคริปต์ `docker/init-mongo.js` เพื่อสร้าง Index และ Seed ข้อมูลเริ่มต้นในครั้งแรก
   - มี **Healthcheck** (`mongosh ping`) ตรวจสอบความพร้อมของระบบ
2. **`ecolink-mongo-express` (Web UI)**:
   - อินเทอร์เฟซเว็บสำหรับเปิดดู ค้นหา และแก้ไข Database Collections ผ่านเบราว์เซอร์ที่ [http://localhost:8081](http://localhost:8081)
3. **`ecolink-api` (Node.js API)**:
   - ให้บริการ RESTful API และ Static Web Pages บนพอร์ต `3000:3000`

---

## 🚀 คู่มือการติดตั้งและเริ่มใช้งาน (Getting Started)

### ความต้องการของระบบ (Prerequisites)
* Node.js v18 ขึ้นไป
* Docker & Docker Compose (สำหรับโหมด Container)

---

### โหมดที่ 1: รันทั้งระบบด้วย Docker Compose (Full Stack)
เหมาะสำหรับการทดสอบระบบทั้งหมดในสภาพแวดล้อม Container:
```bash
# สตาร์ททุก Container ในโหมด Background
npm run docker:up

# หรือใช้คำสั่ง
docker-compose up -d --build
```
* 🌐 **Web Portal & API:** [http://localhost:3000](http://localhost:3000)
* 🗄️ **Mongo Express Web UI:** [http://localhost:8081](http://localhost:8081)

---

### โหมดที่ 2: รัน Database ใน Docker และรันโค้ดบนเครื่อง Local (Hybrid Development)
เหมาะสำหรับการพัฒนาโค้ดและแก้ไขหน้าเว็บอย่างรวดเร็ว:
```bash
# 1. สตาร์ทเฉพาะ MongoDB และ Mongo Express ใน Docker
npm run docker:db

# 2. คัดลอกไฟล์ Environment
cp .env.example .env

# 3. ติดตั้ง Dependencies
npm install

# 4. รัน Node.js API (Hot-reload ด้วย Node Watch)
npm run dev
```

---

### คำสั่งเสริมสำหรับการจัดการ Container
```bash
# ดู Log การทำงานของทุก Container แบบ Real-time
npm run docker:logs

# หยุดและปิดการทำงานของ Container ทั้งหมด
npm run docker:down
```

---

## 📌 เอกสาร RESTful API Endpoints

### 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | คำอธิบาย | การยืนยันตัวตน |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | สมัครสมาชิกใหม่ (โรงงานผู้ขาย / โรงงานผู้ซื้อ) | Public |
| `POST` | `/api/v1/auth/login` | เข้าสู่ระบบด้วย Email และ Password | Public |
| `POST` | `/api/v1/auth/google` | เข้าสู่ระบบด้วย Google One Tap Credential Token | Public |
| `POST` | `/api/v1/auth/google-mock` | เข้าสู่ระบบด้วยบัญชีทดสอบด่วน (Demo Account) | Public |
| `POST` | `/api/v1/auth/logout` | ออกจากระบบ | Public |
| `POST` | `/api/v1/auth/change-password` | เปลี่ยนรหัสผ่านของผู้ใช้งานปัจจุบัน | Bearer Token |

### 2. User Management & KYC (`/api/v1/users`)
| Method | Endpoint | คำอธิบาย | การยืนยันตัวตน |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/me` | ดึงข้อมูลโปรไฟล์ผู้ใช้งานปัจจุบัน | Bearer Token |
| `POST` | `/api/v1/users/kyc` | อัปโหลดเอกสารยืนยันตัวตนโรงงาน (ร.ง.4) | Bearer Token |
| `GET` | `/api/v1/users` | ดึงรายการผู้ใช้งานทั้งหมด (Pagination) | Bearer Token |
| `GET` | `/api/v1/users/:id` | ดึงข้อมูลผู้ใช้งานตาม ID | Bearer Token |
| `PUT` | `/api/v1/users/:id` | แก้ไขข้อมูลส่วนตัว/องค์กร | Bearer Token |
| `DELETE`| `/api/v1/users/:id` | ลบบัญชีผู้ใช้งาน | Bearer Token |
| `GET` | `/api/v1/users/check-username/:name` | ตรวจสอบว่าชื่อผู้ใช้/อีเมลว่างหรือไม่ | Public |

### 3. Waste Management & AI Matching (`/api/v1/wastes`)
| Method | Endpoint | คำอธิบาย | การยืนยันตัวตน |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/wastes` | ลงทะเบียนรายการกากอุตสาหกรรมใหม่ | Bearer Token |
| `GET` | `/api/v1/wastes` | ดึงรายการของเสีย (รองรับ query `?mine=true`) | Bearer Token |
| `GET` | `/api/v1/wastes/:id` | ดึงรายละเอียดของเสียตาม ID | Bearer Token |
| `POST` | `/api/v1/wastes/:id/analyze` | ส่งของเสียให้ AI วิเคราะห์เกรดและ Carbon Factor | Bearer Token |
| `GET` | `/api/v1/wastes/:id/recommended-factories` | ค้นหาและจับคู่โรงงานรับซื้อที่ใกล้และคุ้มค่าที่สุด | Bearer Token |

### 4. Marketplace & Dashboard (`/api/v1/marketplace`, `/api/v1/dashboard`)
| Method | Endpoint | คำอธิบาย | การยืนยันตัวตน |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/marketplace/wastes` | ดึงรายการสินค้าทั้งหมดในตลาดกลาง B2B | Bearer Token |
| `POST` | `/api/v1/marketplace/order/:id` | ทำรายการสั่งซื้อและเปิดดีลในระบบ Escrow | Bearer Token |
| `GET` | `/api/v1/dashboard/stats` | สถิติ ESG Dashboard, Carbon Reduction และข้อมูลกราฟ | Bearer Token |
| `GET` | `/api/health` | ตรวจสอบสถานะการทำงานของ API Server | Public |

---

## 🧪 ตัวอย่างการทดสอบระบบ (Testing Examples)

ทดสอบการทำงานผ่าน **PowerShell** ได้ทันที:

### 1. เข้าสู่ระบบด้วยบัญชีทดสอบด่วน (Demo Login)
```powershell
$res = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/google-mock" -Method POST
$token = $res.token
Write-Host "✅ Login Success! Token: $token"
```

### 2. ดึงข้อมูลแดชบอร์ดสถิติ (ESG Dashboard Stats)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/dashboard/stats" -Method GET -Headers @{ "Authorization" = "Bearer $token" }
```

### 3. ลงทะเบียนกากอุตสาหกรรมใหม่ (Create Waste)
```powershell
$wastePayload = @{
    wasteType = "เศษพลาสติก HDPE / PP"
    quantity = "10 ตัน"
    location = "ชลบุรี (นิคมฯ อมตะนคร)"
    transport = "รถบรรทุก 6 ล้อ"
    description = "พลาสติกล้างสะอาด บดเกล็ด บรรจุในถุง Big Bag"
} | ConvertTo-Json

$wasteRes = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/wastes" -Method POST -Body $wastePayload -ContentType "application/json" -Headers @{ "Authorization" = "Bearer $token" }
$newWasteId = $wasteRes.wasteId
Write-Host "✅ Created Waste ID: $newWasteId"
```

### 4. ค้นหาโรงงานที่ AI แนะนำ (AI Matching Recommendations)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/wastes/$newWasteId/recommended-factories" -Method GET -Headers @{ "Authorization" = "Bearer $token" }
```

---

## 👥 บัญชีทดสอบเริ่มต้น (Default Demo Credentials)
เมื่อรัน MongoDB ใน Docker ระบบจะ Seed บัญชีทดสอบให้โดยอัตโนมัติ:
* **อีเมล:** `demo@ecolink.com`
* **รหัสผ่าน:** `ecolink123`
* **บทบาท:** `โรงงานผู้ขาย` (สถานะ KYC: `ผ่านการยืนยัน`)

---

## 📄 ใบอนุญาต (License)
โปรเจกต์นี้เผยแพร่ภายใต้ใบอนุญาต **ISC License**
