document.addEventListener('DOMContentLoaded', async () => {
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const passwordForm = document.getElementById('password-form');

    // Đảm bảo modal không hiển thị mặc định
    passwordModal.style.display = 'none';  // Thêm dòng này nếu chưa có

    // Hiển thị modal khi nhấn nút "Change Password"
    changePasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'flex';  // Hiển thị modal khi nhấn nút
    });

    // Đóng modal khi nhấn nút đóng
    closeModalBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';  // Ẩn modal
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
