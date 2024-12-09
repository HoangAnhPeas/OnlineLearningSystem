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
            studentName.textContent = 'Tên Sinh Viên';
        }
    } catch (error) {
        console.error('Error fetching user data', error);
        studentName.textContent = 'Tên Sinh Viên';
    }
});