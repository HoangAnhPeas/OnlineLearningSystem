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

    await fetchClassList();
    setPaginationHandlers();
}

async function fetchClassList() {
    try {
        const response = await fetch(`http://localhost:3000/api/class-list?page=${currentPage}&limit=${rowsPerPage}`);
        const { data, total } = await response.json();
        totalRows = total;  // Cập nhật tổng số hàng

        renderTable(data);
        updatePagination();
    } catch (error) {
        console.error('Error fetching class list:', error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('classTableBody');
    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1 + (currentPage - 1) * rowsPerPage}</td>
            <td class="hoverable" onclick="openModal('${item.ClassCode}', '${item.ClassName}')">${item.ClassCode}</td> 
            <td>${item.ClassName}</td>
            <td>${item.Subject}</td>
            <td>${item.Department}</td>
            <td><a href="${item.TeamsLink}" target="_blank"><img src="./images/team-icon.png" alt="Team Logo"></a></td>
        `;
        tableBody.appendChild(tr);
    });
}

function openModal(classId, className) {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';
    document.getElementById('modalClassId').textContent = classId; // Sử dụng ClassCode
    document.getElementById('modalClassName').textContent = className;
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

function openModal(classId, className) {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';
    document.getElementById('modalClassId').textContent = classId;
    document.getElementById('modalClassName').textContent = className;
}

// Đóng modal khi nhấn nút "Đóng"
document.querySelector('.modal .close').addEventListener('click', () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
});
