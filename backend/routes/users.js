const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/v1/users/me
// @desc    Get current logged in user details
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้งาน' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด', error: error.message });
  }
});

// @route   POST /api/v1/users/kyc
// @desc    Upload factory KYC verification document (ร.ง.4)
router.post('/kyc', authenticateToken, upload.single('kycDocument'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'กรุณาแนบไฟล์เอกสาร (PDF หรือรูปภาพ)' });
    }

    const documentUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        kycDocumentUrl: documentUrl,
        kycStatus: 'อยู่ระหว่างตรวจสอบ'
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'อัปโหลดเอกสารสำเร็จ เจ้าหน้าที่จะทำการตรวจสอบข้อมูลภายใน 1-2 วันทำการ',
      kycStatus: user.kycStatus,
      kycDocumentUrl: user.kycDocumentUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลด', error: error.message });
  }
});

// @route   GET /api/v1/users
// @desc    Get all users (with optional pagination)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments()
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/users/:id
// @desc    Get user by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งานนี้' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/v1/users/:id
// @desc    Update user info
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { firstname, lastname, company, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, company, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งานนี้' });
    }

    res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/v1/users/:id
// @desc    Delete user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งานนี้' });
    }
    res.json({ success: true, message: 'ลบบัญชีผู้ใช้งานเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/users/check-username/:name (or check-email)
router.get('/check-username/:name', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.name.toLowerCase() });
    res.json({
      available: !user,
      message: user ? 'ชื่อนี้มีผู้ใช้งานแล้ว' : 'ชื่อนี้สามารถใช้งานได้'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
