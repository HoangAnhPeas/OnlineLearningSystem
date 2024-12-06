const db = require('../config/db');

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
