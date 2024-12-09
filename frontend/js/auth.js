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
        window.location.href = './home.html';
    } else {
        document.getElementById('error-message').textContent = result.message || 'Login failed';
    }
    if (response.ok) {
        const result = await response.json();
        console.log(result); // Kiểm tra thông tin trả về từ backend
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = './home.html';
    }
});
