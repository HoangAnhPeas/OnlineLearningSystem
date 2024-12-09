const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_learning'
});

const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Kiểm tra kết nối với database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ', err);
    } else {
        console.log('Connected to the database.');
        connection.release();
    }
});

module.exports = pool.promise();
