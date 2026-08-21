const express = require('express');
const router = express.Router();
const Waste = require('../models/Waste');
const { authenticateToken } = require('../middleware/auth');

// @route   GET /api/v1/marketplace/wastes
// @desc    List all wastes available on the B2B marketplace
router.get('/wastes', authenticateToken, async (req, res) => {
  try {
    const items = await Waste.find({
      status: { $nin: ['ขายแล้ว', 'ขายแล้ว (รอจัดส่ง)'] }
    })
      .populate('userId', 'company kycStatus firstname email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตลาดกลาง',
      error: error.message
    });
  }
});

// @route   POST /api/v1/marketplace/order/:id
// @desc    Initiate purchase/deal on marketplace waste item
router.post('/order/:id', authenticateToken, async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    if (!waste) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการสินค้านี้' });
    }

    waste.status = 'กำลังเจรจา';
    await waste.save();

    res.json({
      success: true,
      message: 'สร้างคำสั่งซื้อและใบเสนอราคาเรียบร้อยแล้ว ทีมงานจะประสานงานโลจิสติกส์ให้ทันที',
      orderId: `PO-${Date.now().toString().slice(-6)}`,
      waste
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
