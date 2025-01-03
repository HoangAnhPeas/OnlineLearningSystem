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
        const dateParam = req.query.date;
        const selectedDate = new Date(dateParam);
        const weekday = selectedDate.getDay(); // Ngày trong tuần (0: Chủ nhật, 1: Thứ hai,...)

        const [results] = await db.execute(`
            SELECT 
                sub.SubjectCode AS ClassCode, 
                sub.SubjectName AS ClassName, 
                t.TeacherName, 
                l.TimeStart, 
                l.TimeEnd, 
                sub.SubjectGroup AS SubjectGroup, 
                sub.Major AS Major
            FROM Lessons l
            INNER JOIN Subjects sub ON l.SubjectID = sub.SubjectID
            INNER JOIN Teachers t ON l.TeacherID = t.TeacherID
            WHERE l.WeekDay = ?
        `, [weekday]);

        const formattedResults = results.map(row => ({
            ...row,
            TimeStart: `${Math.floor(row.TimeStart / 100)}:${String(row.TimeStart % 100).padStart(2, '0')}`,
            TimeEnd: `${Math.floor(row.TimeEnd / 100)}:${String(row.TimeEnd % 100).padStart(2, '0')}`
        }));

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error('Error fetching daily classes:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export router một lần duy nhất
module.exports = router;
