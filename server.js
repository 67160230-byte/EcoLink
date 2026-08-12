const express = require('express');
const app = express();

app.use(express.json());

// --- ให้ Express เรียกใช้งานไฟล์เว็บจากโฟลเดอร์ frontend ---
app.use(express.static('frontend'));

// --- 1. Authentication ---
app.post('/api/v1/auth/register', (req, res) => res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" }));
app.post('/api/v1/auth/login', (req, res) => res.json({ token: "jwt-token-example", message: "เข้าสู่ระบบสำเร็จ" }));
app.post('/api/v1/auth/logout', (req, res) => res.json({ message: "ออกจากระบบสำเร็จ" }));
app.post('/api/v1/auth/change-password', (req, res) => res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" }));

// --- 2. User Management ---
app.get('/api/v1/users/me', (req, res) => res.json({ id: "U001", name: "คุณสมชาย", role: "ผู้ขายของเสีย" }));
app.get('/api/v1/users', (req, res) => res.json({ page: 1, limit: 10, users: [] }));
app.get('/api/v1/users/:id', (req, res) => res.json({ id: req.params.id, name: "โรงงานรีไซเคิล A" }));
app.put('/api/v1/users/:id', (req, res) => res.json({ message: `อัปเดตข้อมูลผู้ใช้ ${req.params.id} สำเร็จ` }));
app.delete('/api/v1/users/:id', (req, res) => res.json({ message: `ลบผู้ใช้ ${req.params.id} สำเร็จ` }));
app.get('/api/v1/check-username/:name', (req, res) => res.json({ username: req.params.name, available: true }));

// --- 3. EcoLink Waste & AI Features ---
app.post('/api/v1/wastes', (req, res) => res.status(201).json({ message: "บันทึกข้อมูลของเสียสำเร็จ", wasteId: "WST-1001" }));
app.post('/api/v1/wastes/:id/analyze', (req, res) => {
  res.json({
    wasteId: req.params.id,
    aiAnalysis: { materialType: "เศษพลาสติก HDPE", qualityGrade: "A", suggestedUse: "หลอมเม็ดพลาสติกรีไซเคิล" }
  });
});
app.get('/api/v1/wastes/:id/recommended-factories', (req, res) => {
  res.json({
    recommendedFactories: [
      { factoryId: "FAC-01", name: "บริษัท กรีนรีไซเคิล จำกัด", distanceKm: 12.5, trustScore: 4.8 }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EcoLink API Server running on port ${PORT}`));