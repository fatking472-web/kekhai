const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const message = document.getElementById('message');
const authSection = document.getElementById('authSection');
const profileCard = document.getElementById('profileCard');
const logoutButton = document.getElementById('logoutButton');

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function switchTab(tab) {
  const registerActive = tab === 'register';
  registerForm.classList.toggle('hidden', !registerActive);
  loginForm.classList.toggle('hidden', registerActive);
  showRegister.classList.toggle('active', registerActive);
  showLogin.classList.toggle('active', !registerActive);
  setMessage('');
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'same-origin',
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Co loi xay ra');
  return data;
}

function formatDate(value) {
  if (!value) return 'Chua co';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function renderProfile(user) {
  if (!user || user.role === 'admin') return;
  profileCard.classList.remove('hidden');
  logoutButton.classList.remove('hidden');
  document.getElementById('profileName').textContent = user.fullName;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileInsurance').textContent = user.insuranceCode || 'Chua cap nhat';
  document.getElementById('profileCreated').textContent = formatDate(user.createdAt);
}

async function loadMe() {
  const data = await api('/api/me');
  if (data.principal?.user) {
    renderProfile(data.principal.user);
  }
}

showRegister.addEventListener('click', () => switchTab('register'));
showLogin.addEventListener('click', () => switchTab('login'));

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('Dang tao tai khoan...');
  try {
    const data = await api('/api/register', {
      method: 'POST',
      body: JSON.stringify(formData(registerForm))
    });
    registerForm.reset();
    renderProfile(data.user);
    setMessage('Dang ky thanh cong. Tai khoan da duoc luu tren server.', 'success');
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('Dang dang nhap...');
  try {
    const data = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify(formData(loginForm))
    });
    if (data.user.role === 'admin') {
      window.location.href = '/admin';
      return;
    }
    loginForm.reset();
    renderProfile(data.user);
    setMessage('Dang nhap thanh cong.', 'success');
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

logoutButton.addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST', body: '{}' });
  window.location.reload();
});

loadMe().catch(() => {});
