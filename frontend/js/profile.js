document.addEventListener('DOMContentLoaded', async () => {
    const toggleNavbar = document.getElementById('toggleNavbar');
    const navbar = document.getElementById('navbar');
    const studentName = document.getElementById('studentName');

    // Toggle navbar
    toggleNavbar.addEventListener('click', () => {
        navbar.classList.toggle('collapsed');
    });

    // Dropdown menu logic
    const dropdown = document.querySelector('.dropdown');
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.querySelector('.dropdown-menu').classList.toggle('show');
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });

    try {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (userData && userData.name) {
            studentName.textContent = userData.name;
        } else {
            studentName.textContent = 'Tên Người dùng';
        }
    } catch (error) {
        console.error('Error fetching user data', error);
        studentName.textContent = 'Tên người dùng';
    }

    // Thêm sự kiện cho nút đổi mật khẩu
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const passwordForm = document.getElementById('password-form');

    changePasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });

    // Xử lý thay đổi mật khẩu
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(`http://localhost:3000/api/user/${userId}/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (response.ok) {
                alert('Password changed successfully!');
                passwordModal.style.display = 'none'; // Đóng modal
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
