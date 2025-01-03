document.addEventListener('DOMContentLoaded', init);

let currentPage = 1;
const rowsPerPage = 10; // Số lượng dòng mỗi trang
let totalRows = 0;

async function init() {
    const toggleNavbar = document.getElementById('toggleNavbar');
    const navbar = document.getElementById('navbar');

    // Xử lý navbar toggle
    toggleNavbar.addEventListener('click', () => {
        navbar.classList.toggle('collapsed');
    });

    // Lấy danh sách lớp học từ API
    await fetchClassList();
    // Cài đặt sự kiện phân trang
    setPaginationHandlers();
}

async function fetchClassList() {
    try {
        const response = await fetch(`http://localhost:3000/api/class-list?page=${currentPage}&limit=${rowsPerPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data, total } = await response.json();
        totalRows = total; // Cập nhật tổng số hàng

        renderTable(data);
        updatePagination();
    } catch (error) {
        console.error('Error fetching class list:', error);
        alert('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('classTableBody');
    tableBody.innerHTML = ''; // Xóa bảng cũ

    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
            <td class="hoverable" onclick="openModal('${item.ClassCode}', '${item.ClassName}')">${item.ClassCode}</td>
            <td>${item.ClassName}</td>
            <td>${item.Subject}</td>
            <td>${item.Department}</td>
            <td><a href="${item.TeamsLink}" target="_blank"><img src="./images/teams-logo.png" alt="Team Logo" style="width: 34px; height: 21px;"></a></td>
        `;
        tableBody.appendChild(tr);
    });
}

async function openModal(classId, className) {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';

    // Hiển thị dữ liệu lớp học trong modal
    document.getElementById('modalClassId').textContent = classId;
    document.getElementById('modalClassName').textContent = className;

    // Gọi API để tải thêm thông tin chi tiết
    await fetchClassDetails(classId);
}

async function fetchClassDetails(classId) {
    try {
        const response = await fetch(`http://localhost:3000/api/classes/${classId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch class details');
        }

        const data = await response.json();
        renderModal(data);
    } catch (error) {
        console.error('Error fetching class details:', error);
        alert('Không thể tải thông tin lớp học. Vui lòng thử lại sau.');
    }
}

function convertToLessonPeriod(timeStart, timeEnd) {
    const periods = [
        { start: 800, end: 1000, label: "Tiết 1 đến Tiết 2" },    // 8:00 - 10:00
        { start: 1000, end: 1200, label: "Tiết 2 đến Tiết 3" },    // 10:00 - 12:00
        { start: 1200, end: 1400, label: "Tiết 3 đến Tiết 4" },    // 12:00 - 14:00
        { start: 1400, end: 1600, label: "Tiết 4 đến Tiết 5" },    // 14:00 - 16:00
        { start: 1600, end: 1800, label: "Tiết 5 đến Tiết 6" },    // 16:00 - 18:00
        { start: 1800, end: 2000, label: "Tiết 6 đến Tiết 7" },    // 18:00 - 20:00
        { start: 2000, end: 2200, label: "Tiết 7 đến Tiết 8" }     // 20:00 - 22:00
    ];

    // Log giá trị timeStart và timeEnd
    console.log(`Converting: timeStart=${timeStart}, timeEnd=${timeEnd}`);
    
    // Tìm tiết học dựa trên thời gian
    const period = periods.find(p => timeStart >= p.start && timeEnd <= p.end);
    
    if (!period) {
        console.log(`Không tìm thấy tiết học cho thời gian: ${timeStart} - ${timeEnd}`);
        return 'Không xác định';  // Trả về "Không xác định" nếu không có tiết học
    }
    
    console.log(`Tiết học: ${period.label}`);
    return period.label;
}

function renderModal(data) {
    const { classCode, className, schedule } = data;

    // Hiển thị mã và tên lớp
    document.getElementById('modalClassId').textContent = classCode;
    document.getElementById('modalClassName').textContent = className;

    // Hiển thị thời khóa biểu
    const scheduleTable = document.querySelector('.schedule-table tbody');
    scheduleTable.innerHTML = ''; // Xóa bảng thời khóa biểu cũ

    schedule.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>Từ ${item.startDate} đến ${item.endDate}</td>
            <td>${item.weekDay}</td> <!-- Cập nhật để hiển thị thứ -->
            <td>${convertToLessonPeriod(item.timeStart, item.timeEnd)}</td> <!-- Hiển thị tiết học -->
             <td><button style="background-color: #007bff; color: white; border: none; padding: 5px 10px; font-size: 14px; cursor: pointer; border-radius: 5px;">Điểm danh</button></td>
        `;
        scheduleTable.appendChild(row);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const pageSelector = document.getElementById('pageSelector');

    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;

    // Cập nhật danh sách tùy chọn trong bộ chọn trang
    pageSelector.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentPage) option.selected = true;
        pageSelector.appendChild(option);
    }
}

function setPaginationHandlers() {
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageSelector = document.getElementById('pageSelector');

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchClassList();
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            fetchClassList();
        }
    });

    pageSelector.addEventListener('change', (e) => {
        currentPage = Number(e.target.value);
        fetchClassList();
    });
}

// Đóng modal khi nhấn nút "Đóng"
document.querySelector('.modal .close').addEventListener('click', () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
});