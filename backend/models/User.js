const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'กรุณาระบุชื่อ'],
      trim: true
    },
    lastname: {
      type: String,
      required: [true, 'กรุณาระบุนามสกุล'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'กรุณาระบุอีเมล'],
      unique: true,
      lowercase: true,
      trim: true
    },
    company: {
      type: String,
      required: [true, 'กรุณาระบุชื่อบริษัท/โรงงาน'],
      trim: true
    },
    role: {
      type: String,
      enum: ['โรงงานผู้ขาย', 'โรงงานผู้ซื้อ (รีไซเคิล)', 'ผู้ขายของเสีย (โรงงานผลิต)', 'ผู้ซื้อ/รีไซเคิล', 'admin'],
      default: 'โรงงานผู้ขาย'
    },
    password: {
      type: String,
      required: [true, 'กรุณาระบุรหัสผ่าน']
    },
    kycStatus: {
      type: String,
      enum: ['รอการยืนยัน', 'อยู่ระหว่างตรวจสอบ', 'ผ่านการยืนยัน', 'ไม่ผ่านการยืนยัน'],
      default: 'รอการยืนยัน'
    },
    kycDocumentUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Method to remove password from returned json
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
