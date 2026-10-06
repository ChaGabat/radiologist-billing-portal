const SAMPLE_DATA = [
    {
        Modality: 'CT',
        Study_Description: 'Head CT without contrast',
        Study_IUID: '1.2.840.113619.2.86.1234.10001',
        CPT: '70450',
        cpt_mods: 'CT',
        RA: 'RA-001',
        Local_Radiologist: 'Dr. Smith',
        User_in_Dictated: 'Dr. Smith',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-01'
    },
    {
        Modality: 'MRI',
        Study_Description: 'Brain MRI',
        Study_IUID: '1.2.840.113619.2.86.1234.10002',
        CPT: '70553',
        cpt_mods: 'MRI',
        RA: 'RA-001',
        Local_Radiologist: 'Dr. Smith',
        User_in_Dictated: 'Dr. Smith',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-01'
    },
    {
        Modality: 'X-Ray',
        Study_Description: 'Chest X-ray PA/LAT',
        Study_IUID: '1.2.840.113619.2.86.1234.10003',
        CPT: '71045',
        cpt_mods: 'XRAY',
        RA: 'RA-002',
        Local_Radiologist: 'Dr. Smith',
        User_in_Dictated: 'Dr. Smith',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-02'
    },
    {
        Modality: 'US',
        Study_Description: 'Abdomen ultrasound',
        Study_IUID: '1.2.840.113619.2.86.1234.10004',
        CPT: '76700',
        cpt_mods: 'US',
        RA: 'RA-002',
        Local_Radiologist: 'Dr. Smith',
        User_in_Dictated: 'Dr. Smith',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-02'
    },
    {
        Modality: 'CT',
        Study_Description: 'Abdominal CT',
        Study_IUID: '1.2.840.113619.2.86.1234.10005',
        CPT: '74181',
        cpt_mods: 'CT',
        RA: 'RA-003',
        Local_Radiologist: 'Dr. Smith',
        User_in_Dictated: 'Dr. Smith',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-03'
    },
    {
        Modality: 'MRI',
        Study_Description: 'Spine MRI',
        Study_IUID: '1.2.840.113619.2.86.1234.10006',
        CPT: '72141',
        cpt_mods: 'MRI',
        RA: 'RA-004',
        Local_Radiologist: 'Dr. Smith',
        User_in_Dictated: 'Dr. Smith',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-04'
    },
    {
        Modality: 'CT',
        Study_Description: 'Chest CT angiography',
        Study_IUID: '1.2.840.113619.2.86.1234.10007',
        CPT: '71275',
        cpt_mods: 'CT',
        RA: 'RA-003',
        Local_Radiologist: 'Dr. Jones',
        User_in_Dictated: 'Dr. Jones',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-01'
    },
    {
        Modality: 'XRAY',
        Study_Description: 'Spine X-ray',
        Study_IUID: '1.2.840.113619.2.86.1234.10008',
        CPT: '72052',
        cpt_mods: 'XRAY',
        RA: 'RA-005',
        Local_Radiologist: 'Dr. Jones',
        User_in_Dictated: 'Dr. Jones',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-02'
    },
    {
        Modality: 'MRI',
        Study_Description: 'Shoulder MRI',
        Study_IUID: '1.2.840.113619.2.86.1234.10009',
        CPT: '73221',
        cpt_mods: 'MRI',
        RA: 'RA-006',
        Local_Radiologist: 'Dr. Jones',
        User_in_Dictated: 'Dr. Jones',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-03'
    },
    {
        Modality: 'US',
        Study_Description: 'Pelvic ultrasound',
        Study_IUID: '1.2.840.113619.2.86.1234.10010',
        CPT: '76856',
        cpt_mods: 'US',
        RA: 'RA-006',
        Local_Radiologist: 'Dr. Jones',
        User_in_Dictated: 'Dr. Jones',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-04'
    },
    {
        Modality: 'CT',
        Study_Description: 'Pelvis CT',
        Study_IUID: '1.2.840.113619.2.86.1234.10011',
        CPT: '74170',
        cpt_mods: 'CT',
        RA: 'RA-003',
        Local_Radiologist: 'Dr. Jones',
        User_in_Dictated: 'Dr. Jones',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-05'
    },
    {
        Modality: 'CT',
        Study_Description: 'Sinus CT',
        Study_IUID: '1.2.840.113619.2.86.1234.10012',
        CPT: '70486',
        cpt_mods: 'CT',
        RA: 'RA-004',
        Local_Radiologist: 'Dr. Brown',
        User_in_Dictated: 'Dr. Brown',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-02'
    },
    {
        Modality: 'MRI',
        Study_Description: 'Knee MRI',
        Study_IUID: '1.2.840.113619.2.86.1234.10013',
        CPT: '73721',
        cpt_mods: 'MRI',
        RA: 'RA-005',
        Local_Radiologist: 'Dr. Brown',
        User_in_Dictated: 'Dr. Brown',
        Peer_Review: 1,
        Time_in_Dictated: '2026-10-03'
    },
    {
        Modality: 'X-Ray',
        Study_Description: 'Hand X-ray',
        Study_IUID: '1.2.840.113619.2.86.1234.10014',
        CPT: '73110',
        cpt_mods: 'XRAY',
        RA: 'RA-006',
        Local_Radiologist: 'Dr. Brown',
        User_in_Dictated: 'Dr. Brown',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-04'
    },
    {
        Modality: 'US',
        Study_Description: 'Thyroid ultrasound',
        Study_IUID: '1.2.840.113619.2.86.1234.10015',
        CPT: '76536',
        cpt_mods: 'US',
        RA: 'RA-001',
        Local_Radiologist: 'Dr. Brown',
        User_in_Dictated: 'Dr. Brown',
        Peer_Review: 0,
        Time_in_Dictated: '2026-10-05'
    }
];

const DEFAULT_ADMIN_PASSWORD = 'admin123';
let currentUser = null;

const elements = {
    loginSection: document.getElementById('loginSection'),
    radiologistDashboard: document.getElementById('radiologistDashboard'),
    adminDashboard: document.getElementById('adminDashboard'),
    userType: document.getElementById('userType'),
    radiologistLogin: document.getElementById('radiologistLogin'),
    adminLogin: document.getElementById('adminLogin'),
    radiologistName: document.getElementById('radiologistName'),
    radiologistNameDisplay: document.getElementById('radiologistNameDisplay'),
    radStartDate: document.getElementById('radStartDate'),
    radEndDate: document.getElementById('radEndDate'),
    adminStartDate: document.getElementById('adminStartDate'),
    adminEndDate: document.getElementById('adminEndDate'),
    radTotalCptMods: document.getElementById('radTotalCptMods'),
    radDailyBreakdown: document.getElementById('radDailyBreakdown'),
    radLoading: document.getElementById('radLoading'),
    radError: document.getElementById('radError'),
    adminLoading: document.getElementById('adminLoading'),
    adminError: document.getElementById('adminError'),
    adminSummaryTable: document.getElementById('adminSummaryTable').getElementsByTagName('tbody')[0],
    adminStudiesTable: document.getElementById('adminStudiesTable').getElementsByTagName('tbody')[0],
    radiologistStudiesTable: document.getElementById('radiologistStudiesTable').getElementsByTagName('tbody')[0]
};

function initializeApp() {
    const radiologists = getUniqueRadiologists();
    populateRadiologistDropdown(radiologists);

    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(today.getDate() - 6);

    elements.radStartDate.value = formatDate(defaultStart);
    elements.radEndDate.value = formatDate(today);
    elements.adminStartDate.value = formatDate(defaultStart);
    elements.adminEndDate.value = formatDate(today);

    updateLoginForm();
}

function getUniqueRadiologists() {
    return [...new Set(SAMPLE_DATA.map(item => item.Local_Radiologist).filter(Boolean))].sort();
}

function populateRadiologistDropdown(radiologists) {
    const select = elements.radiologistName;
    select.innerHTML = '<option value="">-- Select radiologist --</option>';

    radiologists.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

function updateLoginForm() {
    const selectedUserType = elements.userType.value;

    elements.radiologistLogin.style.display = selectedUserType === 'radiologist' ? 'block' : 'none';
    elements.adminLogin.style.display = selectedUserType === 'admin' ? 'block' : 'none';
}

function loginRadiologist() {
    const selectedRadiologist = elements.radiologistName.value;

    if (!selectedRadiologist) {
        alert('Please choose a radiologist before logging in.');
        return;
    }

    currentUser = { type: 'radiologist', name: selectedRadiologist };
    elements.radiologistNameDisplay.textContent = selectedRadiologist;
    elements.loginSection.classList.remove('active');
    elements.radiologistDashboard.classList.add('active');
    elements.adminDashboard.classList.remove('active');
    document.getElementById('radiologistSummary').classList.add('active');
    document.getElementById('adminSummary').classList.remove('active');
}

function loginAdmin() {
    const password = document.getElementById('adminPassword').value;

    if (password !== DEFAULT_ADMIN_PASSWORD) {
        alert('Incorrect admin password. Please use: admin123');
        return;
    }

    currentUser = { type: 'admin', name: 'Administrator' };
    elements.loginSection.classList.remove('active');
    elements.adminDashboard.classList.add('active');
    elements.radiologistDashboard.classList.remove('active');
    document.getElementById('adminSummary').classList.add('active');
    document.getElementById('radiologistSummary').classList.remove('active');
}

function logout() {
    currentUser = null;
    elements.loginSection.classList.add('active');
    elements.radiologistDashboard.classList.remove('active');
    elements.adminDashboard.classList.remove('active');
    elements.userType.value = '';
    updateLoginForm();
    document.getElementById('adminPassword').value = '';
    elements.radiologistName.value = '';
    elements.radError.style.display = 'none';
    elements.adminError.style.display = 'none';
}

function generateRadiologistSummary() {
    const startDate = elements.radStartDate.value;
    const endDate = elements.radEndDate.value;
    const selectedRadiologist = currentUser && currentUser.type === 'radiologist' ? currentUser.name : elements.radiologistName.value;

    if (!selectedRadiologist) {
        showError(elements.radError, 'Please select a radiologist before generating the report.');
        return;
    }

    if (!startDate || !endDate) {
        showError(elements.radError, 'Please select both start and end dates.');
        return;
    }

    if (startDate > endDate) {
        showError(elements.radError, 'Start date cannot be later than end date.');
        return;
    }

    hideError(elements.radError);
    showLoading(elements.radLoading);

    setTimeout(() => {
        const filteredData = filterByDateAndRadiologist(SAMPLE_DATA, startDate, endDate, selectedRadiologist);

        const totals = summarizeByCptMods(filteredData);
        renderTotalCptMods(elements.radTotalCptMods, totals);
        renderDailyBreakdown(elements.radDailyBreakdown, filteredData);
        renderStudyTable(elements.radiologistStudiesTable, filteredData);

        document.getElementById('radiologistSummary').classList.add('active');
        hideLoading(elements.radLoading);
    }, 200);
}

function generateAdminSummary() {
    const startDate = elements.adminStartDate.value;
    const endDate = elements.adminEndDate.value;

    if (!startDate || !endDate) {
        showError(elements.adminError, 'Please select both start and end dates.');
        return;
    }

    if (startDate > endDate) {
        showError(elements.adminError, 'Start date cannot be later than end date.');
        return;
    }

    hideError(elements.adminError);
    showLoading(elements.adminLoading);

    setTimeout(() => {
        const filteredData = filterByDate(SAMPLE_DATA, startDate, endDate);
        const grouped = summarizeByRadiologistCptMods(filteredData);

        renderAdminSummaryTable(elements.adminSummaryTable, grouped);
        renderStudyTable(elements.adminStudiesTable, filteredData, true);

        document.getElementById('adminSummary').classList.add('active');
        hideLoading(elements.adminLoading);
    }, 200);
}

function filterByDateAndRadiologist(data, startDate, endDate, radiologist) {
    return data.filter(item => {
        const recordDate = item.Time_in_Dictated;
        return item.Local_Radiologist === radiologist && recordDate >= startDate && recordDate <= endDate;
    });
}

function filterByDate(data, startDate, endDate) {
    return data.filter(item => item.Time_in_Dictated >= startDate && item.Time_in_Dictated <= endDate);
}

function summarizeByCptMods(data) {
    const totals = {};

    data.forEach(item => {
        const key = (item.cpt_mods || 'Unknown').trim() || 'Unknown';
        totals[key] = (totals[key] || 0) + 1;
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

function summarizeByRadiologistCptMods(data) {
    const totals = {};

    data.forEach(item => {
        const radiologist = item.Local_Radiologist || 'Unknown';
        const cptMods = item.cpt_mods || 'Unknown';
        const key = `${radiologist}|||${cptMods}`;

        if (!totals[key]) {
            totals[key] = { radiologist, cptMods, total: 0 };
        }

        totals[key].total += 1;
    });

    return Object.values(totals).sort((a, b) => {
        if (a.radiologist !== b.radiologist) return a.radiologist.localeCompare(b.radiologist);
        return a.cptMods.localeCompare(b.cptMods);
    });
}

function renderTotalCptMods(container, totals) {
    container.innerHTML = '';

    if (!totals.length) {
        container.innerHTML = '<div class="stat-card"><label>No Records</label><div class="value">0</div></div>';
        return;
    }

    totals.forEach(([label, value]) => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <label>${label}</label>
            <div class="value">${value}</div>
        `;
        container.appendChild(card);
    });
}

function renderDailyBreakdown(container, data) {
    container.innerHTML = '';

    const grouped = {};

    data.forEach(item => {
        const date = item.Time_in_Dictated;
        if (!grouped[date]) grouped[date] = {};

        const key = item.cpt_mods || 'Unknown';
        grouped[date][key] = (grouped[date][key] || 0) + 1;
    });

    const dates = Object.keys(grouped).sort();

    if (!dates.length) {
        container.innerHTML = '<div class="daily-card"><div class="date">No data</div><div class="cpt-item"><span>No records</span><span>0</span></div></div>';
        return;
    }

    dates.forEach(date => {
        const card = document.createElement('div');
        card.className = 'daily-card';

        const items = Object.entries(grouped[date]).sort((a, b) => a[0].localeCompare(b[0]));
        const itemHtml = items.map(([label, count]) => `
            <div class="cpt-item">
                <span>${label}</span>
                <strong>${count}</strong>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="date">${date}</div>
            ${itemHtml}
        `;

        container.appendChild(card);
    });
}

function renderStudyTable(tableBody, data, isAdminView = false) {
    tableBody.innerHTML = '';

    if (!data.length) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="10" style="text-align:center; color:#666;">No records found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');

        if (isAdminView) {
            row.innerHTML = `
                <td>${item.Time_in_Dictated || ''}</td>
                <td>${item.Local_Radiologist || ''}</td>
                <td>${item.Modality || ''}</td>
                <td>${item.Study_Description || ''}</td>
                <td>${item.CPT || ''}</td>
                <td>${item.cpt_mods || ''}</td>
                <td>${item.RA || ''}</td>
                <td>${item.User_in_Dictated || ''}</td>
                <td>${item.Peer_Review ?? ''}</td>
                <td>${item.Study_IUID || ''}</td>
            `;
        } else {
            row.innerHTML = `
                <td>${item.Time_in_Dictated || ''}</td>
                <td>${item.Modality || ''}</td>
                <td>${item.Study_Description || ''}</td>
                <td>${item.CPT || ''}</td>
                <td>${item.cpt_mods || ''}</td>
                <td>${item.RA || ''}</td>
                <td>${item.User_in_Dictated || ''}</td>
                <td>${item.Local_Radiologist || ''}</td>
                <td>${item.Peer_Review ?? ''}</td>
                <td>${item.Study_IUID || ''}</td>
            `;
        }

        tableBody.appendChild(row);
    });
}

function renderAdminSummaryTable(tableBody, grouped) {
    tableBody.innerHTML = '';

    if (!grouped.length) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="3" style="text-align:center; color:#666;">No records found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    grouped.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.radiologist}</td>
            <td>${item.cptMods}</td>
            <td>${item.total}</td>
        `;
        tableBody.appendChild(row);
    });
}

function showLoading(element) {
    element.style.display = 'block';
}

function hideLoading(element) {
    element.style.display = 'none';
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.style.display = 'none';
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function downloadRadiologistPDF() {
    const element = document.getElementById('radiologistSummary');
    const opt = {
        margin: 0.3,
        filename: `${currentUser?.name || 'radiologist'}_summary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
}

function downloadAdminExcel() {
    const summaryTable = document.getElementById('adminSummaryTable');
    const studiesTable = document.getElementById('adminStudiesTable');

    const wb = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.table_to_sheet(summaryTable);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    const studiesSheet = XLSX.utils.table_to_sheet(studiesTable);
    XLSX.utils.book_append_sheet(wb, studiesSheet, 'Studies');

    XLSX.writeFile(wb, 'admin_summary.xlsx');
}

window.addEventListener('DOMContentLoaded', initializeApp);
