const adminLogin = document.getElementById('adminLogin');
const dashboard = document.getElementById('dashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminMessage = document.getElementById('adminMessage');
const usersBody = document.getElementById('usersBody');
const adminLogout = document.getElementById('adminLogout');
const refreshButton = document.getElementById('refreshButton');

function setAdminMessage(text, type = '') {
  adminMessage.textContent = text;
  adminMessage.className = `message ${type}`.trim();
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

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function renderStats(stats) {
  document.getElementById('totalUsers').textContent = stats.totalUsers;
  document.getElementById('registeredToday').textContent = stats.registeredToday;
  document.getElementById('registeredLast7Days').textContent = stats.registeredLast7Days;
  document.getElementById('usersLoggedIn').textContent = stats.usersLoggedIn;
}

function renderUsers(users) {
  if (!users.length) {
    usersBody.innerHTML = '<tr><td colspan="6">Chua co nguoi dung dang ky.</td></tr>';
    return;
  }
  usersBody.innerHTML = users
    .map((user) => `
      <tr>
        <td>${escapeHtml(user.fullName)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${escapeHtml(user.phone || '')}</td>
        <td>${escapeHtml(user.insuranceCode || '')}</td>
        <td>${escapeHtml(user.citizenId || '')}</td>
        <td>${formatDate(user.createdAt)}</td>
      </tr>
    `)
    .join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function loadDashboard() {
  const [statsData, usersData] = await Promise.all([
    api('/api/admin/stats'),
    api('/api/admin/users')
  ]);
  renderStats(statsData.stats);
  renderUsers(usersData.users);
  adminLogin.classList.add('hidden');
  dashboard.classList.remove('hidden');
  adminLogout.classList.remove('hidden');
}

async function checkAdmin() {
  const data = await api('/api/me');
  if (data.principal?.role === 'admin') {
    await loadDashboard();
  }
}

adminLoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setAdminMessage('Dang dang nhap...');
  try {
    await api('/api/login', {
      method: 'POST',
      body: JSON.stringify(formData(adminLoginForm))
    });
    setAdminMessage('');
    await loadDashboard();
  } catch (error) {
    setAdminMessage(error.message, 'error');
  }
});

refreshButton.addEventListener('click', () => {
  loadDashboard().catch((error) => setAdminMessage(error.message, 'error'));
});

adminLogout.addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST', body: '{}' });
  window.location.reload();
});

checkAdmin().catch(() => {});
