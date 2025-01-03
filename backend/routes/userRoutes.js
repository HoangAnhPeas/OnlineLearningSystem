const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateJWT = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

// Route login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra email và mật khẩu trong DB, kết hợp bảng Students và Teachers để lấy tên
        const [users] = await db.execute(`
            SELECT 
                u.UserID, 
                u.Email, 
                u.TeacherCheck, 
                COALESCE(s.StudentName, t.TeacherName) AS Name 
            FROM Users u
            LEFT JOIN Students s ON u.UserID = s.UserID
            LEFT JOIN Teachers t ON u.UserID = t.UserID
            WHERE u.Email = ? AND u.Password = ?
        `, [email, password]);

        if (users.length > 0) {
            // Tạo JWT token cho người dùng
            const token = jwt.sign(
                { id: users[0].UserID },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Trả về thông tin người dùng và token
            return res.json({
                message: 'Login successful',
                user: {
                    id: users[0].UserID,
                    name: users[0].Name,
                    email: users[0].Email,
                    isTeacher: users[0].TeacherCheck === 'Yes',  // Phân biệt giáo viên và học sinh
                    token,
                },
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

// Thay đổi mật khẩu
router.post('/user/:id/change-password', authenticateJWT, async (req, res) => {
    if (req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    await userController.changePassword(req, res);
});

// Route lấy thông tin người dùng (cần xác thực)
router.get('/user/:id', authenticateJWT, async (req, res) => {
    const userId = req.params.id;

    // Kiểm tra ID người dùng trong token có trùng với ID trong URL không
    if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        // Lấy thông tin người dùng từ DB
        const [rows] = await db.execute(`
            SELECT 
                u.UserID, 
                u.Email, 
                u.TeacherCheck 
            FROM Users u
            WHERE u.UserID = ?
        `, [userId]);

        if (rows.length > 0) {
            // Trả về thông tin người dùng
            res.json({
                id: rows[0].UserID,
                email: rows[0].Email,
                isTeacher: rows[0].TeacherCheck === 'Yes',
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: error.message });
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

// Endpoint: Lấy thông tin người dùng theo ID
router.get('/user/:id', authenticateJWT, async (req, res) => {
    const userId = req.params.id;

    // Kiểm tra quyền truy cập
    if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const [rows] = await db.execute(`
            SELECT UserID, Email, TeacherCheck 
            FROM Users WHERE UserID = ?
        `, [userId]);

        if (rows.length > 0) {
            res.json({
                id: rows[0].UserID,
                email: rows[0].Email,
                isTeacher: rows[0].TeacherCheck === 'Yes',
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
