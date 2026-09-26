document.addEventListener('DOMContentLoaded', () => {
  loadAnalyticsData();
});

function loadAnalyticsData() {
  // Pull metrics matching your other modules' localStorage keys
  const applications = JSON.parse(localStorage.getItem('hr_job_applications')) || [];
  const leaveRequests = JSON.parse(localStorage.getItem('hr_leave_requests')) || [];
  const timeCards = JSON.parse(localStorage.getItem('hr_time_cards')) || [];

  // Populate HTML elements by matching IDs
  document.getElementById('stat-apps').innerText = applications.length;
  document.getElementById('stat-leaves').innerText = leaveRequests.length;
  document.getElementById('stat-timecards').innerText = timeCards.length;
}