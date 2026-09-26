// Grab current user session or set a default demo employee name
const currentUser = JSON.parse(localStorage.getItem('hr_current_user')) || { name: 'Marcus Vance' };

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('emp-welcome').innerText = `Welcome, ${currentUser.name}`;
  loadEmployeeRequests();

  document.getElementById('emp-leave-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitEmpLeave();
  });
});

function logTime(actionType) {
  const timeLogs = JSON.parse(localStorage.getItem('hr_time_cards')) || [];
  const newLog = {
    employee: currentUser.name,
    action: actionType,
    timestamp: new Date().toLocaleString()
  };

  timeLogs.push(newLog);
  localStorage.setItem('hr_time_cards', JSON.stringify(timeLogs));
  
  document.getElementById('clock-status').innerText = `Last Action: ${actionType} at ${newLog.timestamp}`;
  alert(`Successfully recorded: ${actionType}`);
}

function submitEmpLeave() {
  const type = document.getElementById('emp-leave-type').value;
  const date = document.getElementById('emp-leave-date').value;

  const requests = JSON.parse(localStorage.getItem('hr_leave_requests')) || [];
  const newReq = {
    id: Date.now(),
    employee: currentUser.name,
    type: type,
    start: date,
    end: date,
    reason: 'Employee portal submission',
    status: 'Pending'
  };

  requests.push(newReq);
  localStorage.setItem('hr_leave_requests', JSON.stringify(requests));

  document.getElementById('emp-leave-date').value = '';
  loadEmployeeRequests();
  alert('Leave request submitted successfully!');
}

function loadEmployeeRequests() {
  const listEl = document.getElementById('emp-request-list');
  if (!listEl) return;

  const requests = JSON.parse(localStorage.getItem('hr_leave_requests')) || [];
  // Filter only requests belonging to this specific employee
  const myRequests = requests.filter(r => r.employee === currentUser.name);

  listEl.innerHTML = '';
  if (myRequests.length === 0) {
    listEl.innerHTML = '<li style="color: #64748b; font-size: 0.85rem;">No leave requests submitted yet.</li>';
    return;
  }

  myRequests.forEach(req => {
    const li = document.createElement('li');
    li.style.padding = '0.5rem 0';
    li.style.borderBottom = '1px solid #e2e8f0';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.innerHTML = `
      <span>${req.type} (${req.start})</span>
      <span style="font-weight: 600; color: ${req.status === 'Approved' ? '#16a34a' : req.status === 'Rejected' ? '#dc2626' : '#d97706'}">${req.status}</span>
    `;
    listEl.appendChild(li);
  });
}

function employeeLogout() {
  localStorage.removeItem('hr_current_user');
  window.location.href = 'login.html';
}

