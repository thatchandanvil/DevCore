// --- EMPLOYEES DATA & TABLE LOGIC ---
const STORAGE_KEY = 'hr_hackathon_employees';

const defaultEmployees = [
    { id: 'EMP-001', name: 'Sarah Jenkins', department: 'Engineering', status: 'Active' },
    { id: 'EMP-002', name: 'Marcus Vance', department: 'Product', status: 'Promotion Track' },
    { id: 'EMP-003', name: 'Elena Rostova', department: 'Human Resources', status: 'On Leave' },
    { id: 'EMP-004', name: 'David Kim', department: 'Engineering', status: 'Final Warning' },
    { id: 'EMP-005', name: 'Aaliyah Chen', department: 'Product', status: 'Active' }
];

function initializeEmployees() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
    }
}

function getEmployees() {
    initializeEmployees();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function renderEmployeeTable(searchQuery = '', deptFilter = 'All') {
    const employees = getEmployees();
    const tableBody = document.getElementById('employeeTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const filtered = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              emp.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    filtered.forEach(emp => {
        const tr = document.createElement('tr');
        let statusClass = 'badge-active';
        if (emp.status === 'On Leave') statusClass = 'badge-leave';
        if (emp.status === 'Promotion Track') statusClass = 'badge-promo';
        if (emp.status === 'Final Warning') statusClass = 'badge-warning';
        if (emp.status === 'Inactive') statusClass = 'badge-inactive';

        tr.innerHTML = `
            <td><strong>${emp.id}</strong></td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td><span class="status-badge ${statusClass}">${emp.status}</span></td>
            <td><button class="action-btn update-btn" data-id="${emp.id}" data-name="${emp.name}" type="button">Update Status</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEmployees();
    renderEmployeeTable();


    // --- NAVIGATION SWITCHER ---
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.view;

            // Hide all views
            views.forEach(v => v.style.display = 'none');

            // Show the target view
            const target = document.getElementById(targetId);
            if (target) target.style.display = 'block';

            // Update active link style
            navLinks.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');

            // Re-render views when switching
            if (targetId === 'employees-view') {
                renderEmployeeTable();
            }
            if (targetId === 'departments-view') {
                renderDepartments();
            }
            if (targetId === 'payroll-view') {
                renderPayrollView();
            }
            if (targetId === 'timecards-view') {
                renderTimeCardsView();
            }
            if (targetId === 'lifecycle-view') {
                renderLifecycleView();
            }
            if (targetId === 'leave-view') {
                renderLeaveView();
            }
            if (targetId === 'settings-view') {
                renderSettingsView();
            }
        });
    });

    // --- EMPLOYEES VIEW: search & filter ---
    const staffSearch = document.getElementById('staffSearch');
    const deptFilterSelect = document.getElementById('departmentFilter');

    if (staffSearch) {
        staffSearch.addEventListener('input', () => {
            renderEmployeeTable(staffSearch.value, deptFilterSelect ? deptFilterSelect.value : 'All');
        });
    }

    if (deptFilterSelect) {
        deptFilterSelect.addEventListener('change', () => {
            renderEmployeeTable(staffSearch ? staffSearch.value : '', deptFilterSelect.value);
        });
    }

    // --- EMPLOYEES VIEW: Update Status modal ---
    const employeeTableBody = document.getElementById('employeeTableBody');
    const statusModal = document.getElementById('status-modal');
    const modalEmpName = document.getElementById('modal-emp-name');
    const modalStatusSelect = document.getElementById('modal-status-select');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    let activeEmpId = null;

    if (employeeTableBody) {
        employeeTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('update-btn')) {
                activeEmpId = e.target.dataset.id;
                modalEmpName.textContent = e.target.dataset.name;
                const currentStatus = getEmployees().find(emp => emp.id === activeEmpId)?.status || 'Active';
                modalStatusSelect.value = currentStatus;
                statusModal.style.display = 'flex';
            }
        });
    }

    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
            if (activeEmpId) {
                updateEmployeeStatus(activeEmpId, modalStatusSelect.value);
            }
            statusModal.style.display = 'none';
            activeEmpId = null;
        });
    }

    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', () => {
            statusModal.style.display = 'none';
            activeEmpId = null;
        });
    }

    // --- DASHBOARD: directory search & filter ---
    const filterForm = document.getElementById('directory-controls');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            const departmentFilter = document.getElementById('department-filter');
            const tableRows = document.querySelectorAll('#employee-directory tbody tr');

            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const selectedDept = departmentFilter ? departmentFilter.value.toLowerCase().trim() : '';

            tableRows.forEach(row => {
                const name = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
                const department = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
                const role = row.cells[3] ? row.cells[3].textContent.toLowerCase() : '';

                const matchesSearch = !searchTerm || name.includes(searchTerm) || department.includes(searchTerm) || role.includes(searchTerm);
                let matchesDept = true;
                if (selectedDept && selectedDept !== 'all') {
                    matchesDept = department.includes(selectedDept);
                }

                row.style.display = matchesSearch && matchesDept ? '' : 'none';
            });
        });
    }

    // --- ONBOARDING FORM ---
    const onboardingForm = document.querySelector('#employee-onboarding form');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const department = document.getElementById('department').value;
            const hireDate = document.getElementById('hire-date').value;

            if (!firstName || !lastName || !email || !department || !hireDate) {
                alert('Please fill out all required fields.');
                return;
            }

            const tbody = document.querySelector('#employee-directory tbody');
            const newRow = document.createElement('tr');
            const randomId = 'EMP-00' + Math.floor(Math.random() * 90 + 10);
            const deptLabel = department.toLowerCase() === 'hr' ? 'Human Resources' : department.charAt(0).toUpperCase() + department.slice(1);

            newRow.innerHTML = `
                <td>${randomId}</td>
                <td>${firstName} ${lastName}</td>
                <td>${deptLabel}</td>
                <td>New Hire</td>
                <td>Active</td>
                <td>
                    <button type="button">View</button>
                    <button type="button">Edit</button>
                </td>
            `;

            tbody.appendChild(newRow);
            onboardingForm.reset();
            alert(`Success! Employee ${firstName} ${lastName} has been onboarded.`);
            });
        }
});

function saveEmployees(employees) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function updateEmployeeStatus(id, newStatus) {
    let employees = getEmployees();
    employees = employees.map(emp => {
        if (emp.id === id) {
            emp.status = newStatus;
        }
        return emp;
    });
    saveEmployees(employees);
    
    // Re-render table keeping current search/filter state
    const searchVal = document.getElementById('staffSearch')?.value || '';
    const deptVal = document.getElementById('departmentFilter')?.value || 'All';
    renderEmployeeTable(searchVal, deptVal);
}
function renderDepartments() {
    const grid = document.getElementById('department-grid');
    if (!grid) return;

    const employees = getEmployees();
    const deptMap = {};

    // Group employees by department
    employees.forEach(emp => {
        const dept = emp.department || 'General';
        if (!deptMap[dept]) deptMap[dept] = [];
        deptMap[dept].push(emp);
    });

    // Resolve head of department from data, falling back to a static map
    const headMap = {
        'Engineering':       { name: 'David Kim',      title: 'Head of Engineering' },
        'Product':           { name: 'Marcus Vance',   title: 'Head of Product' },
        'Human Resources':   { name: 'Elena Rostova',  title: 'Head of HR' },
        'Finance':           { name: 'TBD',            title: 'Head of Finance' },
    };

    grid.innerHTML = '';

    for (const [deptName, staffList] of Object.entries(deptMap)) {
        const card = document.createElement('div');
        card.className = 'dept-card';

        const head = headMap[deptName] || { name: 'TBD', title: 'Department Head' };

        const staffItemsHTML = staffList.map(emp => {
            let badgeClass = 'badge-active';
            if (emp.status === 'On Leave')       badgeClass = 'badge-leave';
            if (emp.status === 'Promotion Track') badgeClass = 'badge-promo';
            if (emp.status === 'Final Warning')   badgeClass = 'badge-warning';
            if (emp.status === 'Inactive')        badgeClass = 'badge-inactive';
            return `
                <li class="dept-staff-item">
                    <span class="dept-staff-name">${emp.name}</span>
                    <span class="dept-staff-badge status-badge ${badgeClass}">${emp.status}</span>
                </li>`;
        }).join('');

        card.innerHTML = `
            <h3>${deptName}</h3>
            <div class="dept-head-slot">
                <span class="dept-head-label">${head.title}</span>
                <span class="dept-head-name">${head.name}</span>
            </div>
            <p class="dept-headcount">Headcount: ${staffList.length}</p>
            <h4 class="dept-hierarchy-title">Team Members</h4>
            <ul class="dept-staff-list">${staffItemsHTML}</ul>
        `;
        grid.appendChild(card);
    }
}
let currentPayrollDeptFilter = 'All';

// Store hours worked per employee locally if not already set
function getPayrollData() {
    let employees = getEmployees();
    return employees.map(emp => {
        return {
            ...emp,
            hoursWorked: emp.hoursWorked || 160 // Default standard monthly hours
        };
    });
}

function filterPayrollDept(dept, btnElement) {
    currentPayrollDeptFilter = dept;
    
    // Update active state on subnav buttons
    document.querySelectorAll('.subnav-btn').forEach(b => {
        b.style.background = '#e5e7eb';
        b.style.color = '#374151';
    });
    btnElement.style.background = '#2563eb';
    btnElement.style.color = 'white';
    
    renderPayrollView();
}

function updatePayrollRates() {
    renderPayrollView();
}

function updateHoursWorked(id, hours) {
    let employees = getEmployees();
    employees = employees.map(emp => {
        if (emp.id === id) {
            emp.hoursWorked = parseFloat(hours) || 0;
        }
        return emp;
    });
    saveEmployees(employees);
    renderPayrollView();
}

function renderPayrollView() {
    const tbody = document.getElementById('payrollTableBody');
    if (!tbody) return;
    
    const engRate = parseFloat(document.getElementById('rate-engineering')?.value) || 45;
    const prodRate = parseFloat(document.getElementById('rate-product')?.value) || 40;
    const hrRate = parseFloat(document.getElementById('rate-hr')?.value) || 35;

    let employees = getPayrollData();
    
    // Apply department sub-navigation filter
    if (currentPayrollDeptFilter !== 'All') {
        employees = employees.filter(emp => emp.department === currentPayrollDeptFilter);
    }
    
    tbody.innerHTML = '';
    
    employees.forEach(emp => {
        let rate = 35;
        if (emp.department === 'Engineering') rate = engRate;
        if (emp.department === 'Product') rate = prodRate;
        if (emp.department === 'Human Resources') rate = hrRate;

        const hours = emp.hoursWorked !== undefined ? emp.hoursWorked : 160;
        const totalWage = (hours * rate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${emp.id || '--'}</strong></td>
            <td>${emp.name || '--'}</td>
            <td>${emp.department || '--'}</td>
            <td>
                <input type="number" value="${hours}" class="hours-input" onchange="updateHoursWorked('${emp.id}', this.value)"> hrs
            </td>
            <td>$${rate.toFixed(2)}</td>
            <td><strong>${totalWage}</strong></td>
            <td>
                <button class="payroll-btn" onclick="alert('Wage disbursement of ${totalWage} processed successfully for ${emp.name}!')">Disburse Pay</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
const TC_KEY = 'hr_hackathon_timecards';

function getTcRecords() {
    return JSON.parse(localStorage.getItem(TC_KEY) || '[]');
}

function saveTcRecords(records) {
    localStorage.setItem(TC_KEY, JSON.stringify(records));
}

let tcSession = null;
let tcClockInterval = null;

function renderTimeCardsView() {
    const select = document.getElementById('tc-emp-select');
    if (!select) return;

    const employees = getEmployees();
    select.innerHTML = '<option value="">-- Choose Employee --</option>';
    employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.name} (${emp.id})`;
        select.appendChild(opt);
    });

    if (!tcClockInterval) {
        tcClockInterval = setInterval(tcTickClock, 1000);
    }
    tcTickClock();
    tcRenderLog();
    tcSyncButtons();
}

function tcTickClock() {
    const el = document.getElementById('tc-live-clock');
    if (el) el.textContent = new Date().toLocaleTimeString();
}

function tcSetStatus(msg, state) {
    const banner = document.getElementById('tc-status-banner');
    const text   = document.getElementById('tc-status-text');
    if (!banner || !text) return;
    banner.className = 'tc-status-banner tc-status-' + state;
    text.textContent = msg;
}

function tcSyncButtons() {
    const state = tcSession ? tcSession.state : 'idle';
    const btnIn     = document.getElementById('tc-btn-in');
    const btnBreak  = document.getElementById('tc-btn-break');
    const btnResume = document.getElementById('tc-btn-resume');
    const btnOut    = document.getElementById('tc-btn-out');
    if (!btnIn) return;
    btnIn.disabled     = state !== 'idle';
    btnBreak.disabled  = state !== 'active';
    btnResume.disabled = state !== 'break';
    btnOut.disabled    = state === 'idle';
}

function tcClockIn() {
    const select = document.getElementById('tc-emp-select');
    if (!select || !select.value) { alert('Please select an employee first.'); return; }
    const emp = getEmployees().find(e => e.id === select.value);
    if (!emp) return;
    const now = new Date();
    tcSession = {
        empId: emp.id, empName: emp.name,
        date: now.toLocaleDateString(),
        clockIn: now.toLocaleTimeString(),
        clockInMs: now.getTime(),
        breakStart: null, breakTotal: 0,
        state: 'active'
    };
    tcSetStatus(`${emp.name} clocked in at ${tcSession.clockIn}`, 'active');
    tcSyncButtons();
}

function tcStartBreak() {
    if (!tcSession) return;
    tcSession.breakStart = Date.now();
    tcSession.state = 'break';
    tcSetStatus(`${tcSession.empName} is on break since ${new Date().toLocaleTimeString()}`, 'break');
    tcSyncButtons();
}

function tcResume() {
    if (!tcSession || !tcSession.breakStart) return;
    tcSession.breakTotal += Date.now() - tcSession.breakStart;
    tcSession.breakStart = null;
    tcSession.state = 'active';
    tcSetStatus(`${tcSession.empName} resumed at ${new Date().toLocaleTimeString()}`, 'active');
    tcSyncButtons();
}

function tcClockOut() {
    if (!tcSession) return;
    const now = new Date();
    if (tcSession.breakStart) {
        tcSession.breakTotal += Date.now() - tcSession.breakStart;
    }
    const totalMs  = now.getTime() - tcSession.clockInMs - tcSession.breakTotal;
    const totalMin = Math.round(totalMs / 60000);
    const hrs  = Math.floor(totalMin / 60);
    const mins = totalMin % 60;

    const record = {
        empId:    tcSession.empId,
        empName:  tcSession.empName,
        date:     tcSession.date,
        clockIn:  tcSession.clockIn,
        clockOut: now.toLocaleTimeString(),
        breakMin: Math.round(tcSession.breakTotal / 60000),
        totalTime: `${hrs}h ${mins}m`
    };

    const records = getTcRecords();
    records.unshift(record);
    saveTcRecords(records);

    tcSetStatus(`${tcSession.empName} clocked out. Total: ${record.totalTime}`, 'idle');
    tcSession = null;
    tcSyncButtons();
    tcRenderLog();
}

function tcRenderLog() {
    const tbody = document.getElementById('tc-log-body');
    if (!tbody) return;
    const records = getTcRecords();
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No records yet.</td></tr>';
        return;
    }
    tbody.innerHTML = records.map(r => `
        <tr>
            <td>${r.date || '--'}</td>
            <td>${r.empName || '--'}</td>
            <td>${r.clockIn || '--:--'}</td>
            <td>${r.clockOut || '--:--'}</td>
            <td>${r.breakMin != null ? r.breakMin + ' min' : '0 min'}</td>
            <td><strong>${r.totalTime || '0h 0m'}</strong></td>
        </tr>
    `).join('');
}

// =============================================================================
// PERSONNEL STATUS & LIFECYCLE LOG MODULE
// =============================================================================
const LC_KEY = 'hr_lifecycle_records';

function getLifecycleData() {
    return JSON.parse(localStorage.getItem(LC_KEY) || '{}');
}

function saveLifecycleRecord() {
    const empId   = document.getElementById('lcEmployeeSelect')?.value;
    const status  = document.getElementById('lcStatusSelect')?.value;
    const remarks = document.getElementById('lcRemarks')?.value;

    if (!empId) { alert('Please select an employee.'); return; }

    const records = getLifecycleData();
    records[empId] = { status, remarks: remarks.trim() || '--' };
    localStorage.setItem(LC_KEY, JSON.stringify(records));

    document.getElementById('lcRemarks').value = '';
    renderLifecycleView();
}

function renderLifecycleView() {
    const select = document.getElementById('lcEmployeeSelect');
    const tbody  = document.getElementById('lifecycleTableBody');
    if (!select || !tbody) return;

    const employees = getEmployees();
    const records   = getLifecycleData();

    // Populate dropdown
    select.innerHTML = '<option value="">-- Select Employee --</option>';
    employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.name} (${emp.id})`;
        select.appendChild(opt);
    });

    const badgeMap = {
        'Active':                    'lc-active',
        'Two-Week Notice':           'lc-notice',
        'Job Abandonment (AWOL)':    'lc-awol',
        'Verbal Warning':            'lc-verbal',
        'First Warning':             'lc-first',
        'Final Warning':             'lc-final',
        'Termination Pending':       'lc-pending',
        'Terminated':                'lc-terminated'
    };

    tbody.innerHTML = '';
    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:20px;">No employees found.</td></tr>';
        return;
    }

    employees.forEach(emp => {
        const rec = records[emp.id] || { status: 'Active', remarks: 'Standard Standing' };
        const cls = badgeMap[rec.status] || 'lc-active';
        const tr  = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${emp.id || '--'}</strong></td>
            <td>${emp.name || '--'}</td>
            <td>${emp.department || '--'}</td>
            <td><span class="badge-lifecycle ${cls}">${rec.status}</span></td>
            <td style="color:#4b5563;font-size:13px;">${rec.remarks || '--'}</td>
        `;
        tbody.appendChild(tr);
    });
}
// Leave Requests Handler Module
function renderLeaveView() {
    loadLeaveRequests();

    const form = document.getElementById('leave-form');
    if (form && !form.dataset.bound) {
        form.addEventListener('submit', handleLeaveSubmit);
        form.dataset.bound = 'true';
    }
}

function getStoredLeaves() {
  const data = localStorage.getItem('hr_leave_requests');
  if (!data) {
    // Default initial mock record if empty
    const initial = [
      { id: 1, employee: 'Marcus Vance', type: 'Vacation', start: '2026-10-02', end: '2026-10-09', reason: 'Family trip', status: 'Pending' },
      { id: 2, employee: 'Sarah Jenkins', type: 'Sick Leave', start: '2026-09-28', end: '2026-09-29', reason: 'Medical appointment', status: 'Approved' }
    ];
    localStorage.setItem('hr_leave_requests', JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveStoredLeaves(leaves) {
  localStorage.setItem('hr_leave_requests', JSON.stringify(leaves));
}

function loadLeaveRequests() {
  const tbody = document.getElementById('leave-table-body');
  if (!tbody) return;

  const leaves = getStoredLeaves();
  tbody.innerHTML = '';

  if (leaves.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">No leave requests found.</td></tr>`;
    return;
  }

  leaves.forEach((req) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(req.employee)}</strong></td>
      <td>${escapeHtml(req.type)}</td>
      <td>${req.start} to ${req.end}</td>
      <td>${escapeHtml(req.reason || 'N/A')}</td>
      <td><span class="badge ${req.status.toLowerCase()}">${req.status}</span></td>
      <td>
        ${req.status === 'Pending' ? `
          <button class="btn-sm btn-approve" onclick="updateLeaveStatus(${req.id}, 'Approved')">Approve</button>
          <button class="btn-sm btn-reject" onclick="updateLeaveStatus(${req.id}, 'Rejected')">Reject</button>
        ` : `<span style="color: #94a3b8; font-size: 0.85rem;">Processed</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleLeaveSubmit(e) {
  e.preventDefault();
  
  const employee = document.getElementById('leave-employee').value.trim();
  const type = document.getElementById('leave-type').value;
  const start = document.getElementById('leave-start').value;
  const end = document.getElementById('leave-end').value;
  const reason = document.getElementById('leave-reason').value.trim();

  if (!employee || !type || !start || !end) {
    alert('Please fill out all required fields.');
    return;
  }

  const leaves = getStoredLeaves();
  const newRequest = {
    id: Date.now(),
    employee,
    type,
    start,
    end,
    reason,
    status: 'Pending'
  };

  leaves.unshift(newRequest);
  saveStoredLeaves(leaves);
  loadLeaveRequests();

  e.target.reset();
}

window.updateLeaveStatus = function(id, newStatus) {
  let leaves = getStoredLeaves();
  leaves = leaves.map(req => {
    if (req.id === id) {
      req.status = newStatus;
    }
    return req;
  });
  saveStoredLeaves(leaves);
  loadLeaveRequests();
};

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
function renderSettingsView() {
    loadSavedSettings();

    const companyForm = document.getElementById('company-settings-form');
    if (companyForm && !companyForm.dataset.bound) {
        companyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCompanySettings();
        });
        companyForm.dataset.bound = 'true';
    }

    const notifForm = document.getElementById('notification-settings-form');
    if (notifForm && !notifForm.dataset.bound) {
        notifForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveNotificationSettings();
        });
        notifForm.dataset.bound = 'true';
    }
}

function loadSavedSettings() {
  const settings = JSON.parse(localStorage.getItem('hr_system_settings')) || {
    companyName: 'Acme Corporation',
    hrEmail: 'hr@acme.com',
    currency: 'USD',
    workHours: 8,
    notifLeave: true,
    notifPayroll: true,
    notifOvertime: false
  };

  document.getElementById('set-company-name').value = settings.companyName;
  document.getElementById('set-hr-email').value = settings.hrEmail;
  document.getElementById('set-currency').value = settings.currency;
  document.getElementById('set-work-hours').value = settings.workHours;
  document.getElementById('notif-leave').checked = settings.notifLeave;
  document.getElementById('notif-payroll').checked = settings.notifPayroll;
  document.getElementById('notif-overtime').checked = settings.notifOvertime;
}

function saveCompanySettings() {
  const currentSettings = JSON.parse(localStorage.getItem('hr_system_settings')) || {};
  
  currentSettings.companyName = document.getElementById('set-company-name').value.trim();
  currentSettings.hrEmail = document.getElementById('set-hr-email').value.trim();
  currentSettings.currency = document.getElementById('set-currency').value;
  currentSettings.workHours = document.getElementById('set-work-hours').value;

  localStorage.setItem('hr_system_settings', JSON.stringify(currentSettings));
  alert('Company settings saved successfully!');
}

function saveNotificationSettings() {
  const currentSettings = JSON.parse(localStorage.getItem('hr_system_settings')) || {};
  
  currentSettings.notifLeave = document.getElementById('notif-leave').checked;
  currentSettings.notifPayroll = document.getElementById('notif-payroll').checked;
  currentSettings.notifOvertime = document.getElementById('notif-overtime').checked;

  localStorage.setItem('hr_system_settings', JSON.stringify(currentSettings));
  alert('Notification preferences updated!');
}

function exportSystemData() {
  const allData = {
    settings: localStorage.getItem('hr_system_settings'),
    leaveRequests: localStorage.getItem('hr_leave_requests'),
    timeCards: localStorage.getItem('hr_time_cards'),
    employees: localStorage.getItem('hr_employees')
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "hr_system_backup.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function resetSystemData() {
  if (confirm('Are you sure you want to clear all data? This will reset all local storage records.')) {
    localStorage.clear();
    alert('System storage cleared. Reloading application...');
    location.reload();
  }
}


