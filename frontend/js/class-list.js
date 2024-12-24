document.addEventListener('DOMContentLoaded', init);

async function init() {
    const toggleNavbar = document.getElementById('toggleNavbar');
    const navbar = document.getElementById('navbar');
    
    // Xử lý navbar toggle
    toggleNavbar.addEventListener('click', () => {
        navbar.classList.toggle('collapsed');
    });

    await fetchClassList();
    setPagination();
}

async function fetchClassList() {
    const response = await fetch('http://localhost:3000/api/class-list');
    const data = await response.json();
    renderTable(data);
}

function renderTable(data) {
    const tableBody = document.getElementById('classTableBody');
    tableBody.innerHTML = '';

    data.slice(0, 10).forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="hoverable" onclick="openModal('${item.LessonID}', '${item.ClassName}')">${item.LessonID}</td>
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
    document.getElementById('modalClassId').textContent = classId;
    document.getElementById('modalClassName').textContent = className;
}
