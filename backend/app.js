const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db'); // Import db
const userRoutes = require('./routes/userRoutes'); // Import routes
require('dotenv').config(); // Tải biến môi trường

const app = express();

// Middleware
app.use(express.json()); // Parser JSON body
app.use(cors({
    origin: 'http://localhost:3000', // Cho phép truy cập từ frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // Các headers được phép
}));

// Kết nối các routes
app.use('/api', userRoutes);

// Phục vụ file tĩnh từ thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Định nghĩa route mặc định cho frontend
app.get('*', (req, res) => {
    const requestedPath = path.join(__dirname, '../frontend', req.path);
    if (req.path === '/' || !path.extname(req.path)) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } else if (path.extname(req.path)) {
        res.sendFile(requestedPath, (err) => {
            if (err) res.status(404).send('File not found');
        });
    }
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
