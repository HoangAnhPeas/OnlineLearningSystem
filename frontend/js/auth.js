document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Ngừng hành động mặc định (tránh reload trang)

    // Lấy thông tin từ form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Gửi yêu cầu đăng nhập tới backend
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })  // Gửi email và password
    });

    const result = await response.json();  // Lấy kết quả từ server

    console.log(result);  // Kiểm tra kết quả trả về từ server

    if (response.ok) {
        // Nếu đăng nhập thành công, chuyển tới trang home
        window.location.href = './home.html';
    } else {
        // Hiển thị thông báo lỗi
        document.getElementById('error-message').textContent = result.message || 'Lỗi đăng nhập';
    }
});
