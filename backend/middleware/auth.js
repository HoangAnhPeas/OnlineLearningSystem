const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateJWT = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    // Kiểm tra và xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token or token expired.' });
        }

        req.user = user;  // Lưu thông tin người dùng vào req.user
        next();  // Tiếp tục xử lý request
    });
};

module.exports = authenticateJWT;
