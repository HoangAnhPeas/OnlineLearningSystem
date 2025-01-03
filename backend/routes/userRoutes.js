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
            SELECT DISTINCT
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

// Route để lấy danh sách lớp học
router.get('/class-list', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await db.execute(`
            SELECT 
                s.SubjectCode AS ClassCode, 
                s.SubjectName AS ClassName, 
                s.SubjectGroup AS Subject, 
                s.Major AS Department, 
                s.Link AS TeamsLink 
            FROM Lessons l
            INNER JOIN Subjects s ON l.SubjectID = s.SubjectID
            GROUP BY s.SubjectCode
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const [[{ total }]] = await db.execute(`SELECT COUNT(DISTINCT s.SubjectCode) as total FROM Lessons l INNER JOIN Subjects s ON l.SubjectID = s.SubjectID`);

        res.status(200).json({ data: rows, total });
    } catch (error) {
        console.error('Error fetching class list:', error);
        res.status(500).json({ error: error.message });
    }
});

// thong tin chi tiet lop hoc test lan 10
router.get('/classes/:classId', async (req, res) => {
    try {
        const classId = req.params.classId;
        console.log("Received Class ID: ", classId); // Log classId

        // Lấy thông tin lớp học từ bảng Subjects
        const [classInfo] = await db.execute(
            `SELECT SubjectCode AS classCode, SubjectName AS className FROM Subjects WHERE SubjectCode = ?`,
            [classId]
        );
        console.log("Class Info: ", classInfo);

        // Lấy thông tin thời khóa biểu từ bảng Lessons, đảm bảo không trùng lặp
        const [schedule] = await db.execute(
            `SELECT DISTINCT Teachers.TeacherName AS teacherName, 
             Lessons.WeekDay AS weekDay, 
             Lessons.TimeStart AS timeStart, Lessons.TimeEnd AS timeEnd,
             DATE_FORMAT(Subjects.StatDate, '%d/%m/%Y') AS startDate, 
             DATE_FORMAT(Subjects.EndDate, '%d/%m/%Y') AS endDate
             FROM Lessons
             INNER JOIN Teachers ON Lessons.TeacherID = Teachers.TeacherID
             INNER JOIN Subjects ON Lessons.SubjectID = Subjects.SubjectID
             WHERE Subjects.SubjectCode = ?`,
            [classId]
        );
        console.log("Schedule: ", schedule);

        // Kiểm tra xem lớp học có tồn tại không
        if (!classInfo.length) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Kiểm tra xem thời khóa biểu có dữ liệu không
        if (!schedule.length) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Trả về thông tin lớp học và thời khóa biểu
        res.status(200).json({
            classCode: classInfo[0].classCode,
            className: classInfo[0].className,
            schedule: schedule.map(item => ({
                startDate: item.startDate,       // Ngày bắt đầu
                endDate: item.endDate,           // Ngày kết thúc
                weekDay: item.weekDay,           // Thứ trong tuần (1: Chủ nhật, 2: Thứ 2,...)
                timeStart: item.timeStart, 
                timeEnd: item.timeEnd,
                teacherName: item.teacherName    // Tên giảng viên
            }))
        });
    } catch (error) {
        console.error('Error fetching class data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export router một lần duy nhất
module.exports = router;
