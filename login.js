document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

function handleLogin(e) {
  e.preventDefault();

  const nameInput = document.getElementById('login-name');
  const roleSelect = document.getElementById('login-role');

  const name = nameInput.value.trim();
  const role = roleSelect.value;

  if (!name) return;

  // Save session state to localStorage so employee.html and index.html pick it up
  const sessionData = {
    name: name,
    role: role,
    loginTime: new Date().toLocaleTimeString()
  };

  localStorage.setItem('hr_current_user', JSON.stringify(sessionData));

  // Route securely based on role selection
  if (role === 'admin') {
    window.location.href = 'index.html'; // Directs to your main admin dashboard file
  } else {
    window.location.href = 'employee.html'; // Directs to the standalone employee portal
  }
}
