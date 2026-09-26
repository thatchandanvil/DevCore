document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('job-application-form');
  if (form) {
    form.addEventListener('submit', handleApplicationSubmit);
  }
});

function handleApplicationSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('app-name');
  const emailInput = document.getElementById('app-email');
  const positionSelect = document.getElementById('app-position');
  const resumeInput = document.getElementById('app-resume');

  if (resumeInput.files.length === 0) {
    alert('Please select a resume file to upload.');
    return;
  }

  const fileName = resumeInput.files[0].name;

  const newApplication = {
    id: Date.now(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    position: positionSelect.value,
    resume: fileName,
    date: new Date().toLocaleDateString(),
    status: 'Under Review'
  };

  // Securely save to localStorage under the key your admin dashboard expects
  let applications = JSON.parse(localStorage.getItem('hr_job_applications')) || [];
  applications.push(newApplication);
  localStorage.setItem('hr_job_applications', JSON.stringify(applications));

  alert('Application submitted successfully!');
  form.reset();
}

