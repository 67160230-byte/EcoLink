const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    wasteType: {
      type: String,
      required: [true, 'กรุณาระบุประเภทของเสีย']
    },
    quantity: {
      type: String,
      required: [true, 'กรุณาระบุปริมาณ']
    },
    location: {
      type: String,
      required: [true, 'กรุณาระบุสถานที่ตั้งหรือจังหวัด']
    },
    transport: {
      type: String,
      required: [true, 'กรุณาระบุประเภทรถขนส่งที่ต้องการ']
    },
    description: {
      type: String,
      default: '-'
    },
    status: {
      type: String,
      enum: ['รอการจับคู่', 'กำลังเจรจา', 'นัดรับสินค้า', 'ขายแล้ว (รอจัดส่ง)', 'ขายแล้ว'],
      default: 'รอการจับคู่'
    },
    estimatedPrice: {
      type: String,
      default: 'ตามตกลง'
    },
    aiGrade: {
      type: String,
      default: 'เกรด A (ผ่านการคัดแยก)'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Waste', wasteSchema);
