document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('user', JSON.stringify(result.user));

        // Điều hướng theo vai trò (giáo viên hay học sinh)
        if (result.user.isTeacher) {
            window.location.href = './t-home.html';  // Dành cho giáo viên
        } else {
            window.location.href = './home.html';  // Dành cho học sinh
        }
    } else {
        document.getElementById('error-message').textContent = result.message || 'Login failed';
    }
});
