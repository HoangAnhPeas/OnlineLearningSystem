const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_learning'
});

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
