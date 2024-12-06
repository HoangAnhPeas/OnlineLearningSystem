document.addEventListener('DOMContentLoaded', async () => {
    // Lấy danh sách khóa học khi trang được tải
    await fetchCourses();
    await fetchUsers();
});

// Xử lý form tạo người dùng
document.getElementById('userForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            // Sau khi tạo người dùng mới, làm mới danh sách người dùng
            fetchUsers();
        } else {
            alert('Failed to create user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});

// Lấy danh sách khóa học
async function fetchCourses() {
    try {
        const response = await fetch('http://localhost:3000/api/courses');
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const courses = await response.json();
        const courseList = document.getElementById('courseList');
        if (!courseList) {
            console.error('courseList element not found');
            return;
        }

        courseList.innerHTML = ''; // Làm mới danh sách trước khi thêm

        if (courses.length === 0) {
            courseList.innerHTML = '<li>No courses available</li>';
        } else {
            courses.forEach(course => {
                const li = document.createElement('li');
                li.textContent = course.name; // Giả sử bạn có trường "name" trong bảng khóa học
                courseList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Lấy danh sách người dùng
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json(); // Nếu đây là một JSON hợp lệ
        const userList = document.getElementById('userList');
        if (!userList) {
            console.error('userList element not found');
            return;
        }

        userList.innerHTML = ''; // Làm mới danh sách trước khi thêm

        if (users.length === 0) {
            userList.innerHTML = '<li>No users available</li>';
        } else {
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                userList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error: ' + error.message);
    }
}
