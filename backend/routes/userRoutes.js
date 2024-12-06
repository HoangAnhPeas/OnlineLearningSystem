const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login with email: ${email}`);  // Log email để kiểm tra

    try {
        // Kiểm tra thông tin đăng nhập trong cơ sở dữ liệu
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        console.log(rows);  // In kết quả từ cơ sở dữ liệu để kiểm tra

        if (rows.length > 0) {
            // Nếu có kết quả, trả về thông báo đăng nhập thành công
            res.json({ message: 'Login successful', user: rows[0] });
        } else {
            // Nếu không có kết quả, trả về thông báo đăng nhập thất bại
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách khóa học
router.get('/courses', async (req, res) => {
    try {
        // Lấy danh sách khóa học từ cơ sở dữ liệu
        const [rows] = await db.execute('SELECT * FROM courses');
        res.json(rows);  // Trả về danh sách khóa học dưới dạng JSON
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách người dùng
router.get('/users', async (req, res) => {
    try {
        // Lấy danh sách người dùng từ cơ sở dữ liệu
        const [rows] = await db.execute('SELECT * FROM users');
        res.json(rows);  // Trả về danh sách người dùng dưới dạng JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
