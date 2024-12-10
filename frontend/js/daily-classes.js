let currentPage = 1; // Trang hiện tại
let rowsPerPage = 10; // Số hàng hiển thị mỗi trang
let classData = []; // Dữ liệu lớp học từ API

document.addEventListener('DOMContentLoaded', async () => {
    const toggleNavbar = document.getElementById('toggleNavbar');
    const navbar = document.getElementById('navbar');
    
    // Xử lý navbar toggle
    toggleNavbar.addEventListener('click', () => {
        navbar.classList.toggle('collapsed');
    });

    await populateDateSelector();
    await updateSelectedDateUI();
    await fetchDailyClasses();
});

// Tạo danh sách ngày trong tuần cho dropdown
async function populateDateSelector() {
    const datePicker = document.getElementById('datePicker');
    const today = new Date();

    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

    for (let i = 0; i < 7; i++) {
        const dateOption = new Date();
        dateOption.setDate(today.getDate() + i);

        const dateString = dateOption.toISOString().split('T')[0];

        const option = document.createElement('option');
        option.value = dateString;
        option.textContent = `${days[dateOption.getDay()]} - ${dateString}`;

        datePicker.appendChild(option);
    }

    datePicker.value = today.toISOString().split('T')[0];
    datePicker.addEventListener('change', async () => {
        await updateSelectedDateUI();
        await fetchDailyClasses();
    });
}

// Cập nhật ngày và hiển thị thông tin trên giao diện
async function updateSelectedDateUI() {
    const datePicker = document.getElementById('datePicker');
    const selectedDate = new Date(datePicker.value);

    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayOfWeek = dayNames[selectedDate.getDay()];
    const formattedDate = selectedDate.toLocaleDateString();

    document.getElementById('selectedDayOfWeek').textContent = dayOfWeek;
    document.getElementById('selectedDate').textContent = formattedDate;
}

// Gọi API để lấy danh sách lớp học
async function fetchDailyClasses() {
    const selectedDate = document.getElementById('datePicker').value;

    if (!selectedDate) {
        alert('Vui lòng chọn một ngày.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/daily-classes?date=${selectedDate}`);
        const data = await response.json();

        if (response.ok) {
            classData = data || []; // Cập nhật dữ liệu mới
            currentPage = 1; // Reset về trang đầu tiên
            renderTable(); // Hiển thị bảng dữ liệu
            updatePagination(); // Cập nhật điều hướng phân trang
        } else {
            alert('Không thể lấy thông tin lớp học.');
        }
    } catch (error) {
        console.error('Error fetching daily classes', error);
    }
}

// Hiển thị bảng dữ liệu theo trang
function renderTable() {
    const tableBody = document.getElementById('classTableBody');
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, classData.length);

    if (!classData || classData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">Không có thông tin lớp học trong ngày đã chọn</td></tr>';
        return;
    }

    for (let i = startIndex; i < endIndex; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i - startIndex + 1}</td>
            <td>${classData[i].LessonID || 'N/A'}</td>
            <td>${classData[i].student_name || 'Chưa xác định'}</td>
            <td>${classData[i].TeacherID || 'Chưa xác định'}</td>
            <td>${classData[i].StartDate || 'N/A'}</td>
            <td>${classData[i].EndDate || 'N/A'}</td>
            <td>${classData[i].Subject || 'N/A'}</td>
            <td>${classData[i].Department || 'N/A'}</td>
        `;
        tableBody.appendChild(tr);
    }
}

// Cập nhật các nút phân trang
function updatePagination() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumber = document.getElementById('pageNumber');

    const totalPages = Math.ceil(classData.length / rowsPerPage);

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;

    pageNumber.textContent = `${currentPage}/${totalPages}`;

    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePagination();
        }
    };

    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            updatePagination();
        }
    };
}
