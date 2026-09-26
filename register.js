document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleOpenRegistration);
  }
});

function handleOpenRegistration(e) {
  e.preventDefault();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const role = document.getElementById('reg-role').value;

  if (!name || !email) return;

  // Save into the open registry array for local tracking
  const newUser = {
    name: name,
    email: email,
    role: role,
    registeredAt: new Date().toLocaleTimeString()
  };

  let users = JSON.parse(localStorage.getItem('hr_registered_users')) || [];
  users.push(newUser);
  localStorage.setItem('hr_registered_users', JSON.stringify(users));

  // Registration complete — send to login page
  window.location.href = 'login.html';
}

