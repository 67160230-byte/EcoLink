const mongoose = require('mongoose');
const Factory = require('../models/Factory');
const User = require('../models/User');
const Waste = require('../models/Waste');
const bcrypt = require('bcrypt');

const connectDB = async (retries = 5, delay = 3000) => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecolink_db';
  
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`✅ Connected to MongoDB at: ${conn.connection.host} (${conn.connection.name})`);

      // Seed & ensure demo user and factory data are ready
      await seedFallbackData();
      return conn;
    } catch (error) {
      retries -= 1;
      console.warn(`⏳ MongoDB connection failed (${error.message}). Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      if (retries === 0) {
        console.error('❌ Could not connect to MongoDB after multiple attempts.');
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      } else {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
};

async function seedFallbackData() {
  try {
    const factoryCount = await Factory.countDocuments();
    if (factoryCount === 0) {
      await Factory.insertMany([
        {
          name: 'บริษัท กรีนรีไซเคิล จำกัด',
          acceptedWasteTypes: ['เศษพลาสติก HDPE / PP', 'เศษพลาสติก'],
          location: 'ชลบุรี (นิคมฯ อมตะนคร)',
          distanceKm: 12.5,
          trustScore: 4.9,
          vehicleSupport: 'รถบรรทุก 6 ล้อ / 10 ล้อ',
          isVerified: true
        },
        {
          name: 'บริษัท เมทัล รีคัฟเวอร์รี่ จำกัด',
          acceptedWasteTypes: ['เศษโลหะ / อลูมิเนียม', 'เศษโลหะ'],
          location: 'ระยอง (นิคมฯ มาบตาพุด)',
          distanceKm: 35.0,
          trustScore: 4.9,
          vehicleSupport: 'รถพ่วง / 10 ล้อ (ขนาดใหญ่)',
          isVerified: true
        },
        {
          name: 'บริษัท สยามเปเปอร์รีไซเคิล จำกัด',
          acceptedWasteTypes: ['เศษกระดาษ / บรรจุภัณฑ์', 'กระดาษ/กล่อง'],
          location: 'ฉะเชิงเทรา',
          distanceKm: 19.2,
          trustScore: 4.7,
          vehicleSupport: 'รถกระบะบรรทุก / รถ 6 ล้อ',
          isVerified: true
        },
        {
          name: 'บริษัท อีโค่ เคมิคอล ทรีตเมนต์ จำกัด',
          acceptedWasteTypes: ['กากเคมีอุตสาหกรรม', 'ของเสียเคมี'],
          location: 'สมุทรปราการ',
          distanceKm: 28.0,
          trustScore: 4.8,
          vehicleSupport: 'รถบรรทุกเฉพาะทางสำหรับสารเคมี',
          isVerified: true
        }
      ]);
      console.log('🌱 Seeded verified partner factories');
    }

    // Ensure Demo User exists and has correct password hash
    let demoUser = await User.findOne({ email: 'demo@ecolink.com' });
    if (!demoUser) {
      const demoHash = await bcrypt.hash('ecolink123', 10);
      demoUser = await User.create({
        firstname: 'สมศักดิ์',
        lastname: 'กรีนเทค',
        email: 'demo@ecolink.com',
        company: 'บจก. กรีนพลาส อินดัสทรี',
        role: 'โรงงานผู้ขาย',
        password: demoHash,
        kycStatus: 'ผ่านการยืนยัน'
      });
      console.log('🌱 Seeded demo user (demo@ecolink.com / ecolink123)');
    } else {
      const isValid = await bcrypt.compare('ecolink123', demoUser.password);
      if (!isValid) {
        demoUser.password = await bcrypt.hash('ecolink123', 10);
        await demoUser.save();
        console.log('🔄 Updated demo user password hash to valid ecolink123');
      }
    }

    const wasteCount = await Waste.countDocuments();
    if (wasteCount === 0 && demoUser) {
      await Waste.create([
        {
          userId: demoUser._id,
          wasteType: 'เศษพลาสติก HDPE คัดแยกเกล็ดแล้ว',
          quantity: '8 ตัน',
          location: 'ชลบุรี (อมตะนคร)',
          transport: 'รถบรรทุก 6 ล้อ',
          description: 'พลาสติกล้างสะอาด ความชื้นต่ำ บรรจุถุง Big Bag',
          status: 'รอการจับคู่',
          estimatedPrice: '฿16,500 / ตัน',
          aiGrade: 'A+ (HDPE เกรดส่งออก)'
        },
        {
          userId: demoUser._id,
          wasteType: 'เศษโลหะ / อลูมิเนียมเกรด A',
          quantity: '15 ตัน',
          location: 'ระยอง (มาบตาพุด)',
          transport: 'รถพ่วง / 10 ล้อ',
          description: 'เศษอลูมิเนียมจากการขึ้นรูป ไร้คราบน้ำมัน',
          status: 'รอการจับคู่',
          estimatedPrice: '฿28,000 / ตัน',
          aiGrade: 'A (อลูมิเนียมความบริสุทธิ์สูง)'
        }
      ]);
      console.log('🌱 Seeded initial marketplace wastes');
    }
  } catch (e) {
    console.warn('Seed fallback notice:', e.message);
  }
}

module.exports = connectDB;
