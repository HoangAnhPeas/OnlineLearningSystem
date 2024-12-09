const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra email và mật khẩu trong DB
        const [users] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (users.length > 0) {
            // Nếu tìm thấy thông tin hợp lệ, trả về thông tin người dùng
            return res.json({
                message: 'Login successful',
                user: {
                    id: users[0].UserID, // Gửi thông tin ID và tên người dùng
                    name: users[0].Name,
                    email: users[0].Email
                }
            });
        } else {
            // Nếu thông tin sai
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách khóa học
router.get('/courses', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM courses');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route để lấy thông tin người dùng theo ID
router.get('/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE UserID = ?', [userId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route lấy thông tin lớp học trong ngày
router.get('/daily-classes', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10); // Lấy ngày hiện tại (YYYY-MM-DD)
        const [results] = await db.execute(`
            SELECT l.LessonID, u.Name as student_name, t.TeacherID, t.AvailableSlots, 
                l.StartDate, l.EndDate, l.TimeStart, l.TimeEnd
            FROM Lessons l
            LEFT JOIN Users u ON l.StudentID = u.UserID
            LEFT JOIN Teachers t ON l.TeacherID = t.TeacherID
            WHERE DATE(l.StartDate) = ?
        `, [today]);
        
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching daily classes:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export router một lần duy nhất
module.exports = router;
