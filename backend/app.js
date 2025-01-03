const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db'); // Import db
const userRoutes = require('./routes/userRoutes'); // Import routes
require('dotenv').config(); // Tải biến môi trường

const app = express();

// Middleware
app.use(express.json()); // Dùng express's built-in JSON body parser
app.use(cors());

// Kết nối các routes
app.use('/api', userRoutes);

// Phục vụ file tĩnh từ thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Định nghĩa route mặc định
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, '../frontend', req.path);
    if (req.path === '/') {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } else {
        if (!path.extname(req.path)) {
            res.sendFile(path.join(__dirname, '../frontend/index.html'));
        } else {
            res.status(404).send('File not found');
        }
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
