const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ecolink_jwt_secret_key_2026_super_secure';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'ไม่ได้ระบุ Token ยืนยันตัวตน กรุณาเข้าสู่ระบบ'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token หมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่'
      });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};
