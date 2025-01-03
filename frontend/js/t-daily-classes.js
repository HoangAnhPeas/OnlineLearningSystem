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

async function populateDateSelector() {
    const datePicker = document.getElementById('datePicker');
    const today = new Date();

    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

    for (let i = 0; i < 7; i++) {
        const dateOption = new Date(today);
        dateOption.setDate(today.getDate() + i);

        // Đảm bảo ngày là ngày địa phương
        const dateString = dateOption.toLocaleDateString('en-CA'); // Định dạng YYYY-MM-DD

        const option = document.createElement('option');
        option.value = dateString;
        option.textContent = `${days[dateOption.getDay()]} - ${dateString}`;

        datePicker.appendChild(option);
    }

    // Đặt giá trị ngày hiện tại cho datePicker
    datePicker.value = today.toLocaleDateString('en-CA'); // Sử dụng lại định dạng này
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
    const formattedDate = selectedDate.toLocaleDateString(); // Hiển thị theo múi giờ địa phương

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
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ trước khi render lại

    if (!classData || classData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">Không có thông tin lớp học trong ngày hôm nay</td></tr>';
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, classData.length);

    for (let i = start; i < end; i++) {
        const row = classData[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${row.ClassCode || 'N/A'}</td>
            <td>${row.ClassName || 'Chưa xác định'}</td>
            <td>${row.TimeStart || 'N/A'}</td>
            <td>${row.TimeEnd || 'N/A'}</td>
            <td>${row.SubjectGroup || 'N/A'}</td>
            <td>${row.Major || 'N/A'}</td>
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
