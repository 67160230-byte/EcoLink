/**
 * MongoDB Docker Initialization & Seeding Script
 * Executed by Mongo container on first startup (/docker-entrypoint-initdb.d/)
 */

db = db.getSiblingDB('ecolink_db');

print('🌿 Initializing EcoLink MongoDB Database...');

// 1. Create collections with indexes
db.createCollection('users');
db.createCollection('factories');
db.createCollection('wastes');

db.users.createIndex({ email: 1 }, { unique: true });
db.wastes.createIndex({ userId: 1 });
db.wastes.createIndex({ wasteType: 1 });
db.factories.createIndex({ name: 1 });

// 2. Seed Default Verified Factories
db.factories.insertMany([
  {
    name: 'บริษัท กรีนรีไซเคิล จำกัด',
    acceptedWasteTypes: ['เศษพลาสติก HDPE / PP', 'เศษพลาสติก'],
    location: 'ชลบุรี (นิคมฯ อมตะนคร)',
    distanceKm: 12.5,
    trustScore: 4.9,
    vehicleSupport: 'รถบรรทุก 6 ล้อ / 10 ล้อ',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'บริษัท เมทัล รีคัฟเวอร์รี่ จำกัด',
    acceptedWasteTypes: ['เศษโลหะ / อลูมิเนียม', 'เศษโลหะ'],
    location: 'ระยอง (นิคมฯ มาบตาพุด)',
    distanceKm: 35.0,
    trustScore: 4.9,
    vehicleSupport: 'รถพ่วง / 10 ล้อ (ขนาดใหญ่)',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'บริษัท สยามเปเปอร์รีไซเคิล จำกัด',
    acceptedWasteTypes: ['เศษกระดาษ / บรรจุภัณฑ์', 'กระดาษ/กล่อง'],
    location: 'ฉะเชิงเทรา',
    distanceKm: 19.2,
    trustScore: 4.7,
    vehicleSupport: 'รถกระบะบรรทุก / รถ 6 ล้อ',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'บริษัท อีโค่ เคมิคอล ทรีตเมนต์ จำกัด',
    acceptedWasteTypes: ['กากเคมีอุตสาหกรรม', 'ของเสียเคมี'],
    location: 'สมุทรปราการ',
    distanceKm: 28.0,
    trustScore: 4.8,
    vehicleSupport: 'รถบรรทุกเฉพาะทางสำหรับสารเคมี',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 3. Seed Demo User (password: ecolink123)
const demoPasswordHash = '$2b$10$roP6oBgOpIdLFefjMocBleURaLzSCi8Xd9VK20K3ZsELBqKspIdaq';

const demoUser = {
  _id: ObjectId('66c000000000000000000001'),
  firstname: 'สมศักดิ์',
  lastname: 'กรีนเทค',
  email: 'demo@ecolink.com',
  company: 'บจก. กรีนพลาส อินดัสทรี',
  role: 'โรงงานผู้ขาย',
  password: demoPasswordHash,
  kycStatus: 'ผ่านการยืนยัน',
  kycDocumentUrl: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

db.users.insertOne(demoUser);

// 4. Seed Sample Marketplace Wastes
db.wastes.insertMany([
  {
    userId: ObjectId('66c000000000000000000001'),
    wasteType: 'เศษพลาสติก HDPE คัดแยกเกล็ดแล้ว',
    quantity: '8 ตัน',
    location: 'ชลบุรี (อมตะนคร)',
    transport: 'รถบรรทุก 6 ล้อ',
    description: 'พลาสติกล้างสะอาด ความชื้นต่ำ บรรจุถุง Big Bag',
    status: 'รอการจับคู่',
    estimatedPrice: '฿16,500 / ตัน',
    aiGrade: 'A+ (HDPE เกรดส่งออก)',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: ObjectId('66c000000000000000000001'),
    wasteType: 'เศษโลหะ / อลูมิเนียมเกรด A',
    quantity: '15 ตัน',
    location: 'ระยอง (มาบตาพุด)',
    transport: 'รถพ่วง / 10 ล้อ',
    description: 'เศษอลูมิเนียมจากการขึ้นรูป ไร้คราบน้ำมัน',
    status: 'รอการจับคู่',
    estimatedPrice: '฿28,000 / ตัน',
    aiGrade: 'A (อลูมิเนียมความบริสุทธิ์สูง)',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ EcoLink MongoDB Initialization completed successfully!');
