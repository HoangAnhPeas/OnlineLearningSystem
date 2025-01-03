const bcrypt = require('bcryptjs'); // Cần cài đặt bcryptjs để mã hóa mật khẩu
const db = require('../config/db');

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;  // ID người dùng từ token

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    try {
        // Lấy mật khẩu hiện tại từ cơ sở dữ liệu
        const [user] = await db.execute('SELECT Password FROM Users WHERE UserID = ?', [userId]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra mật khẩu hiện tại có đúng không
        const isMatch = await bcrypt.compare(currentPassword, user[0].Password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Mã hóa mật khẩu mới trước khi lưu vào DB
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await db.execute('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedPassword, userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        await db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        res.json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
