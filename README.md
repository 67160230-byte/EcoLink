# 🌿 EcoLink API - Industrial Waste Matching & AI Analysis Platform

ระบบ RESTful API สำหรับแพลตฟอร์มแมตช์ชิ่งและวิเคราะห์ของเสียอุตสาหกรรม พัฒนาด้วย Node.js (Express), MongoDB และจัดการ Container ด้วย Docker & Docker Compose

---

## 🛠️ Tech Stack & Technologies
* **Language/Runtime:** Node.js (v24+)
* **Framework:** Express.js
* **Database:** MongoDB
* **Containerization:** Docker & Docker Compose
* **Frontend:** HTML5, CSS3, JavaScript (Static Web)

---

## 📁 Project Structure
```text
ecolink-api/
├── frontend/             # โฟลเดอร์เก็บไฟล์เว็บ UI
│   ├── index.html        # หน้า Landing Page
│   └── login.html        # หน้า เข้าสู่ระบบ/สมัครสมาชิก
├── .dockerignore
├── .gitignore
├── docker-compose.yml    # ไฟล์จัดการ Multi-container (Node.js + MongoDB)
├── Dockerfile            # ไฟล์สร้าง Image สำหรับ Express API
├── package.json
├── README.md             # เอกสารอธิบายโปรเจกต์
└── server.js             # ไฟล์หลักของ Express Server & Routing


📌 REST API Endpoints
1. Authentication (ระบบยืนยันตัวตน)
POST /api/v1/auth/register - สมัครสมาชิกใหม่

POST /api/v1/auth/login - เข้าสู่ระบบ

POST /api/v1/auth/logout - ออกจากระบบ

POST /api/v1/auth/change-password - เปลี่ยนรหัสผ่าน

2. User Management (จัดการข้อมูลผู้ใช้งาน)
GET /api/v1/users/me - ดึงข้อมูลผู้ใช้งานปัจจุบัน

GET /api/v1/users/:id - ดึงข้อมูลผู้ใช้งานตาม ID

GET /api/v1/users - ดึงรายการผู้ใช้งานทั้งหมด (Pagination)

PUT /api/v1/users/:id - แก้ไขข้อมูลผู้ใช้งาน

DELETE /api/v1/users/:id - ลบบัญชีผู้ใช้งาน

GET /api/v1/check-username/:name - ตรวจสอบว่า Username ว่างหรือไม่

3. Waste Management & AI Features (จัดการของเสียและ AI)
POST /api/v1/wastes - บันทึกข้อมูลของเสียอุตสาหกรรม

POST /api/v1/wastes/:id/analyze - ส่งของเสียให้ AI วิเคราะห์ประเภทและเกรด

GET /api/v1/wastes/:id/recommended-factories - ค้นหาโรงงานรีไซเคิลที่แนะนำ

