const API_URL = 'https://script.google.com/macros/s/AKfycbx4SaRPFoSmavpUpztmPRGKMALmgTvsAeSxz7RH-VxL7OyrZpGv9iJpq5ZmEaLzB-YxAw/exec';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4SaRPFoSmavpUpztmPRGKMALmgTvsAeSxz7RH-VxL7OyrZpGv9iJpq5ZmEaLzB-YxAw/exec';

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
    }
];

let currentUser = null;

const elements = {
    radiologistDashboard: document.getElementById('radiologistDashboard'),
    adminDashboard: document.getElementById('adminDashboard'),
    radRadiologist: document.getElementById('radRadiologist'),
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
    populateRadiologistDropdown();

    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(today.getDate() - 6);

    elements.radStartDate.value = formatDate(defaultStart);
    elements.radEndDate.value = formatDate(today);
    elements.adminStartDate.value = formatDate(defaultStart);
    elements.adminEndDate.value = formatDate(today);

    switchRole('radiologist');
}

<!--
function switchRole(role) {
    const radiologistBtn = document.querySelector('.role-btn:nth-child(1)');
    const adminBtn = document.querySelector('.role-btn:nth-child(2)');

    if (role === 'radiologist') {
        elements.radiologistDashboard.classList.add('active');
        elements.adminDashboard.classList.remove('active');
        radiologistBtn.classList.add('active');
        adminBtn.classList.remove('active');
    } else {
        elements.radiologistDashboard.classList.remove('active');
        elements.adminDashboard.classList.add('active');
        adminBtn.classList.add('active');
        radiologistBtn.classList.remove('active');
    }
}
-->

function switchRole(role) {
    // Require a passphrase before opening Admin View.
    if (role === 'admin') {
        const passphrase = prompt('Please enter the Admin passphrase:');

        if (passphrase !== 'LifetrackMed236') {
            if (passphrase !== null) {
                alert('Incorrect passphrase. Admin access denied.');
            }

            // Return to Radiologist View if access is denied or cancelled.
            switchRole('radiologist');
            return;
        }
    }

    const radiologistBtn = document.querySelector('.role-btn:nth-child(1)');
    const adminBtn = document.querySelector('.role-btn:nth-child(2)');

    if (role === 'radiologist') {
        elements.radiologistDashboard.classList.add('active');
        elements.adminDashboard.classList.remove('active');

        radiologistBtn.classList.add('active');
        adminBtn.classList.remove('active');
    } else {
        elements.radiologistDashboard.classList.remove('active');
        elements.adminDashboard.classList.add('active');

        adminBtn.classList.add('active');
        radiologistBtn.classList.remove('active');
    }
}

async function populateRadiologistDropdown() {
    let radiologists = [];

    try {
        const url = APPS_SCRIPT_URL + '?action=getRadiologists';
        const response = await fetch(url);
        const data = await response.json();
        radiologists = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to load radiologists from BigQuery:', error);
        showError(elements.radError, 'Could not load radiologists. Check your Google Apps Script deployment.');
    }

    const select = elements.radRadiologist;
    select.innerHTML = '<option value="">-- Select radiologist --</option>';

    radiologists.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

async function generateRadiologistSummary() {
    const radiologist = elements.radRadiologist.value;
    const startDate = elements.radStartDate.value;
    const endDate = elements.radEndDate.value;

    if (!radiologist) {
        showError(elements.radError, 'Please select a radiologist.');
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

    try {
        const url = `${APPS_SCRIPT_URL}?action=getRadiologistSummary&radiologist=${encodeURIComponent(radiologist)}&startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            showError(elements.radError, 'Error: ' + data.error);
            hideLoading(elements.radLoading);
            return;
        }

        const arrayData = Array.isArray(data) ? data : [];

        const totals = summarizeByCptMods(arrayData);
        renderTotalCptMods(elements.radTotalCptMods, totals);
        renderDailyBreakdown(elements.radDailyBreakdown, arrayData);
        renderStudyTable(elements.radiologistStudiesTable, arrayData, false);
        document.getElementById('radiologistSummary').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        showError(elements.radError, 'Failed to load radiologist summary: ' + error.message);
    } finally {
        hideLoading(elements.radLoading);
    }
}

async function generateAdminSummary() {
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

    try {
        const url = `${APPS_SCRIPT_URL}?action=getAdminSummary&startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            showError(elements.adminError, 'Error: ' + data.error);
            hideLoading(elements.adminLoading);
            return;
        }

        const arrayData = Array.isArray(data) ? data : [];

        const pivot = summarizeByRadiologistCptMods(arrayData);
        renderAdminSummaryTable(elements.adminSummaryTable, pivot);
        renderStudyTable(elements.adminStudiesTable, arrayData, true);
        document.getElementById('adminSummary').classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        showError(elements.adminError, 'Failed to load admin summary: ' + error.message);
    } finally {
        hideLoading(elements.adminLoading);
    }
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
    const grouped = {};
    const cptModsSet = new Set();

    data.forEach(item => {
        const radiologist = String(item.Local_Radiologist || 'Unknown').trim() || 'Unknown';
        const cptMod = String(item.cpt_mods || 'Unknown').trim() || 'Unknown';

        if (!grouped[radiologist]) {
            grouped[radiologist] = {};
        }

        grouped[radiologist][cptMod] =
            (grouped[radiologist][cptMod] || 0) + 1;

        cptModsSet.add(cptMod);
    });

    const cptMods = Array.from(cptModsSet).sort((a, b) =>
        a.localeCompare(b)
    );

    const radiologists = Object.keys(grouped).sort((a, b) =>
        a.localeCompare(b)
    );

    return { radiologists, cptMods, grouped };
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
    const cptModsSet = new Set();
    console.log('Daily breakdown sample:', data.slice(0, 5));
    console.log('Timestamp sample:', data.slice(0, 5).map(item => item.Time_in_Dictated));
    console.log('CPT Mods sample:', data.slice(0, 10).map(item => item.cpt_mods));
    // Group cases by calendar date and CPT Mods.
    data.forEach(item => {
        const timestamp = String(item.Time_in_Dictated || '').trim();

        // Keep only YYYY-MM-DD; disregard the time.
        const date = timestamp.substring(0, 10);

        if (!date) return;

        const cptMod = String(item.cpt_mods || 'Unknown').trim() || 'Unknown';

        if (!grouped[date]) {
            grouped[date] = {};
        }

        if (!grouped[date][cptMod]) {
            grouped[date][cptMod] = 0;
        }

        grouped[date][cptMod] += 1;
        cptModsSet.add(cptMod);
    });

    // Sort dates chronologically and CPT Mods alphabetically.
    const dates = Object.keys(grouped).sort();
    const cptMods = Array.from(cptModsSet).sort((a, b) =>
        a.localeCompare(b)
    );

    if (!dates.length || !cptMods.length) {
        container.textContent = 'No records found for this date range.';
        return;
    }

    // Create the pivot table.
    const table = document.createElement('table');
    table.className = 'daily-cpt-pivot';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '13px';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Date';
    dateHeader.style.position = 'sticky';
    dateHeader.style.left = '0';
    dateHeader.style.backgroundColor = '#f1f5f9';
    dateHeader.style.textAlign = 'left';
    dateHeader.style.padding = '10px';
    dateHeader.style.border = '1px solid #dbe2ea';
    headerRow.appendChild(dateHeader);

    cptMods.forEach(cptMod => {
        const th = document.createElement('th');
        th.textContent = cptMod;
        th.style.backgroundColor = '#f1f5f9';
        th.style.textAlign = 'center';
        th.style.padding = '10px';
        th.style.border = '1px solid #dbe2ea';
        th.style.whiteSpace = 'nowrap';
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    dates.forEach(date => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        dateCell.style.position = 'sticky';
        dateCell.style.left = '0';
        dateCell.style.backgroundColor = '#ffffff';
        dateCell.style.fontWeight = '600';
        dateCell.style.padding = '10px';
        dateCell.style.border = '1px solid #dbe2ea';
        dateCell.style.whiteSpace = 'nowrap';
        row.appendChild(dateCell);

        cptMods.forEach(cptMod => {
            const cell = document.createElement('td');
            cell.textContent = grouped[date][cptMod] || 0;
            cell.style.textAlign = 'center';
            cell.style.padding = '10px';
            cell.style.border = '1px solid #dbe2ea';
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
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


function renderAdminSummaryTable(tableBody, pivot) {
    const table = tableBody.closest('table');
    const thead = table.querySelector('thead');

    tableBody.innerHTML = '';
    thead.innerHTML = '';

    const radiologists = pivot.radiologists;
    const cptMods = pivot.cptMods;
    const grouped = pivot.grouped;

    // Create the table header.
    const headerRow = document.createElement('tr');

    const radiologistHeader = document.createElement('th');
    radiologistHeader.textContent = 'Radiologist';
    headerRow.appendChild(radiologistHeader);

    cptMods.forEach(cptMod => {
        const th = document.createElement('th');
        th.textContent = cptMod;
        headerRow.appendChild(th);
    });

    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total';
    headerRow.appendChild(totalHeader);

    thead.appendChild(headerRow);

    // Display a message if no records are found.
    if (!radiologists.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = cptMods.length + 2;
        cell.textContent = 'No records found';
        cell.style.textAlign = 'center';

        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    // Create one row for each radiologist.
    radiologists.forEach(radiologist => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = radiologist;
        row.appendChild(nameCell);

        let rowTotal = 0;

        // Create one column for each CPT Mods category.
        cptMods.forEach(cptMod => {
            const count = grouped[radiologist][cptMod] || 0;

            const cell = document.createElement('td');
            cell.textContent = count;
            cell.style.textAlign = 'center';

            row.appendChild(cell);
            rowTotal += count;
        });

        // Add the radiologist's total case count.
        const totalCell = document.createElement('td');
        totalCell.textContent = rowTotal;
        totalCell.style.textAlign = 'center';
        totalCell.style.fontWeight = 'bold';

        row.appendChild(totalCell);
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
        filename: `${elements.radRadiologist.value || 'radiologist'}_summary.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
}

function downloadAdminExcel() {
    const summaryTable = document.getElementById('adminSummaryTable');
    const studiesTable = document.getElementById('adminStudiesTable');

    // Create a new Excel workbook.
    const wb = XLSX.utils.book_new();

    // Tab 1: Cases by Radiologist and CPT Mods.
    // This includes the dynamic CPT Mods columns and Total column.
    const summarySheet = XLSX.utils.table_to_sheet(summaryTable);

    // Tab 2: All Studies.
    // This includes all study records displayed for the selected date range.
    const studiesSheet = XLSX.utils.table_to_sheet(studiesTable);

    console.log("Sheet name:", sheetName, "Length:", sheetName.length);

    // Add the worksheets in the requested order.
    XLSX.utils.book_append_sheet(
        wb,
        summarySheet,
        'Cases by Radiologist and CPT Mods'
    );

    XLSX.utils.book_append_sheet(
        wb,
        studiesSheet,
        'All Studies'
    );

    // Download the Excel file.
    XLSX.writeFile(wb, 'Radiologist_Billing_Report.xlsx');
}

window.addEventListener('DOMContentLoaded', initializeApp);
