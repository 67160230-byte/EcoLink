const express = require('express');
const router = express.Router();
const Waste = require('../models/Waste');
const Factory = require('../models/Factory');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/v1/wastes
// @desc    Register a new industrial waste
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { wasteType, quantity, location, transport, description } = req.body;

    if (!wasteType || !quantity || !location || !transport) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลของเสียให้ครบถ้วนทุกช่อง'
      });
    }

    const newWaste = new Waste({
      userId: req.user.userId,
      wasteType,
      quantity,
      location,
      transport,
      description: description || '-',
      status: 'รอการจับคู่'
    });

    await newWaste.save();

    res.status(201).json({
      success: true,
      message: 'บันทึกข้อมูลกากอุตสาหกรรมสำเร็จ',
      wasteId: newWaste._id,
      waste: newWaste
    });
  } catch (error) {
    console.error('Create waste error:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึก', error: error.message });
  }
});

// @route   GET /api/v1/wastes
// @desc    Get wastes with optional user filter
router.get('/', authenticateToken, async (req, res) => {
  try {
    const filter = req.query.mine === 'true' ? { userId: req.user.userId } : {};
    const wastes = await Waste.find(filter).populate('userId', 'firstname lastname company kycStatus').sort({ createdAt: -1 });
    res.json({ success: true, count: wastes.length, wastes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/wastes/:id
// @desc    Get single waste by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id).populate('userId', 'firstname lastname company kycStatus');
    if (!waste) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการของเสียนี้' });
    }
    res.json({ success: true, waste });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/v1/wastes/:id/analyze
// @desc    AI Engine: Analyze waste grade, carbon factor & potential valuation
router.post('/:id/analyze', authenticateToken, async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    if (!waste) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการของเสีย' });
    }

    // AI Analysis simulation based on waste type
    let grade = 'A (คุณภาพสูง - สามารถนำกลับมาใช้ใหม่ได้ทันที)';
    let carbonFactor = 145.2; // kgCO2e saved per ton
    let estimatedPricePerTon = '฿8,500 - ฿12,000';

    if (waste.wasteType.includes('พลาสติก')) {
      grade = 'A+ (HDPE/PP ล้างสะอาด คัดเกรดแล้ว)';
      carbonFactor = 180.5;
      estimatedPricePerTon = '฿14,000 - ฿18,500';
    } else if (waste.wasteType.includes('โลหะ')) {
      grade = 'A (เศษเหล็ก/อลูมิเนียม ไม่ปนเปื้อนน้ำมัน)';
      carbonFactor = 210.0;
      estimatedPricePerTon = '฿25,000 - ฿35,000';
    } else if (waste.wasteType.includes('เคมี')) {
      grade = 'B (กากเคมีผ่านการบำบัดเบื้องต้น)';
      carbonFactor = 95.0;
      estimatedPricePerTon = '฿3,500 - ฿6,000';
    }

    waste.aiGrade = grade;
    await waste.save();

    res.json({
      success: true,
      analysis: {
        wasteId: waste._id,
        wasteType: waste.wasteType,
        quantity: waste.quantity,
        aiGrade: grade,
        estimatedPricePerTon,
        carbonFactor: `${carbonFactor} kgCO2e/ตัน`,
        recommendation: 'แนะนำให้จับคู่กับโรงงานรีไซเคิลมาตรฐาน ISO 14001 เพื่อผลตอบแทนสูงสุด'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/v1/wastes/:id/recommended-factories
// @desc    AI Engine: Match and recommend factories based on waste type and location
router.get('/:id/recommended-factories', authenticateToken, async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    let matchedFactories = [];

    if (waste) {
      // Find factories that accept similar waste type or return all verified factories
      const typeKeyword = waste.wasteType.split(' ')[0];
      matchedFactories = await Factory.find({
        $or: [
          { acceptedWasteTypes: { $regex: typeKeyword, $options: 'i' } },
          { acceptedWasteTypes: { $regex: waste.wasteType, $options: 'i' } }
        ]
      });
    }

    // Fallback if none specifically matched
    if (!matchedFactories || matchedFactories.length === 0) {
      matchedFactories = await Factory.find().limit(4);
    }

    // Enhance with dynamic match score calculation
    const formattedFactories = matchedFactories.map((f, idx) => {
      const matchScore = Math.max(92.0, (99.2 - idx * 2.5)).toFixed(1);
      return {
        id: f._id,
        name: f.name,
        location: f.location,
        distanceKm: f.distanceKm,
        trustScore: f.trustScore,
        vehicleSupport: f.vehicleSupport,
        isVerified: f.isVerified,
        matchScore: `${matchScore}%`,
        aiSummary: `เหมาะสมที่สุดสำหรับ ${waste ? waste.wasteType : 'ของเสียอุตสาหกรรม'}`
      };
    });

    res.json({
      success: true,
      wasteId: req.params.id,
      recommendedFactories: formattedFactories
    });
  } catch (error) {
    console.error('Recommended factories error:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการคำนวณการจับคู่', error: error.message });
  }
});

module.exports = router;
