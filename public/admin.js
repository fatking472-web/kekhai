const adminLogin = document.getElementById('adminLogin');
const dashboard = document.getElementById('dashboard');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminMessage = document.getElementById('adminMessage');
const usersBody = document.getElementById('usersBody');
const adminLogout = document.getElementById('adminLogout');
const refreshButton = document.getElementById('refreshButton');
const searchInput = document.getElementById('searchInput');
const userSelect = document.getElementById('userSelect');
const resultCount = document.getElementById('resultCount');
const userDetail = document.getElementById('userDetail');

let allUsers = [];
let selectedUserId = '';

const accountTypeLabels = {
  caNhan: 'Cá nhân',
  toChuc: 'Tổ chức',
  choCon: 'Đăng ký cho con'
};

const transactionPlaceLabels = {
  portal: 'Cổng thông tin điện tử của BHXH Việt Nam',
  ivan: 'Tổ chức I-VAN'
};

const submissionMethodLabels = {
  office: 'Tại cơ quan',
  home: 'Tại nhà'
};

const uploadLabels = {
  portrait: 'Ảnh chân dung',
  frontDoc: 'Ảnh giấy tờ mặt trước',
  backDoc: 'Ảnh giấy tờ mặt sau'
};

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
  if (!response.ok) throw new Error(data.error || 'Có lỗi xảy ra');
  return data;
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function formatDate(value) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function formatPlainDate(value) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}

function valueOrEmpty(value) {
  return value ? escapeHtml(value) : '<span class="muted-value">Chưa có</span>';
}

function renderStats(stats) {
  document.getElementById('totalUsers').textContent = stats.totalUsers;
  document.getElementById('registeredToday').textContent = stats.registeredToday;
  document.getElementById('registeredLast7Days').textContent = stats.registeredLast7Days;
  document.getElementById('usersLoggedIn').textContent = stats.usersLoggedIn;
}

function userSearchText(user) {
  return [
    user.fullName,
    user.email,
    user.phone,
    user.insuranceCode,
    user.citizenId,
    user.documentNumber,
    user.province,
    user.district,
    user.ward,
    user.address,
    user.bankName,
    user.bankAccount
  ].filter(Boolean).join(' ').toLowerCase();
}

function getFilteredUsers() {
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword) return allUsers;
  return allUsers.filter((user) => userSearchText(user).includes(keyword));
}

function countUploads(user) {
  return Object.keys(uploadLabels).filter((key) => getUpload(user, key)).length;
}

function getUpload(user, key) {
  const upload = user.attachments?.[key] || user[key];
  if (!upload) return null;
  if (typeof upload === 'string') return { dataUrl: upload };
  return upload;
}

function renderUsers() {
  const users = getFilteredUsers();
  resultCount.textContent = `${users.length} người dùng`;

  if (!users.length) {
    usersBody.innerHTML = '<tr><td colspan="7">Chưa có người dùng phù hợp.</td></tr>';
    updateUserSelect(users);
    renderUserDetail(null);
    return;
  }

  if (!users.some((user) => user.id === selectedUserId)) {
    selectedUserId = users[0].id;
  }

  updateUserSelect(users);

  usersBody.innerHTML = users
    .map((user) => {
      const selected = user.id === selectedUserId ? ' selected-row' : '';
      const uploadCount = countUploads(user);
      return `
        <tr class="${selected}" data-row-user-id="${escapeAttr(user.id)}">
          <td>
            <div class="user-cell">
              <span class="user-avatar">${initials(user.fullName)}</span>
              <span>
                <strong>${valueOrEmpty(user.fullName)}</strong>
                <small>${valueOrEmpty(accountTypeLabels[user.accountType] || user.accountType)}</small>
              </span>
            </div>
          </td>
          <td>
            <strong>${valueOrEmpty(user.email)}</strong>
            <small>${valueOrEmpty(user.phone)}</small>
          </td>
          <td>
            <strong>BHXH: ${valueOrEmpty(user.insuranceCode)}</strong>
            <small>Giấy tờ: ${valueOrEmpty(user.documentNumber || user.citizenId)}</small>
          </td>
          <td>
            <strong>${valueOrEmpty(user.province)}</strong>
            <small>${valueOrEmpty([user.district, user.ward].filter(Boolean).join(' - '))}</small>
          </td>
          <td><span class="upload-count">${uploadCount}/3</span></td>
          <td>${formatDate(user.createdAt)}</td>
          <td>
            <div class="row-actions">
              <button class="ghost-button row-action" type="button" data-user-id="${escapeAttr(user.id)}">Xem</button>
              <button class="danger-button row-action" type="button" data-delete-user-id="${escapeAttr(user.id)}">Xóa</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  renderUserDetail(users.find((user) => user.id === selectedUserId) || users[0]);
}

function updateUserSelect(users) {
  userSelect.disabled = !users.length;
  userSelect.innerHTML = '<option value="">Chọn người dùng...</option>' + users
    .map((user) => `
      <option value="${escapeAttr(user.id)}"${user.id === selectedUserId ? ' selected' : ''}>
        ${escapeHtml([user.fullName, user.phone || user.email || user.insuranceCode].filter(Boolean).join(' - '))}
      </option>
    `)
    .join('');
}

function renderUserDetail(user) {
  if (!user) {
    userDetail.innerHTML = `
      <p class="eyebrow">Chi tiết</p>
      <h2>Chưa có dữ liệu để hiển thị</h2>
      <p class="empty-detail">Hãy tải lại hoặc thay đổi từ khóa tìm kiếm.</p>
    `;
    return;
  }

  userDetail.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="eyebrow">Chi tiết người đăng ký</p>
        <h2>${valueOrEmpty(user.fullName)}</h2>
        <p>${valueOrEmpty(user.email)} · ${valueOrEmpty(user.phone)}</p>
      </div>
      <div class="detail-actions">
        <span class="status-pill">${countUploads(user)} ảnh</span>
        <button class="danger-button" type="button" data-delete-user-id="${escapeAttr(user.id)}">Xóa user</button>
      </div>
    </div>

    <div class="detail-grid">
      ${detailItem('Loại tài khoản', accountTypeLabels[user.accountType] || user.accountType)}
      ${detailItem('Mã số BHXH', user.insuranceCode)}
      ${detailItem('Loại giấy tờ', user.documentType)}
      ${detailItem('Số giấy tờ', user.documentNumber || user.citizenId)}
      ${detailItem('Ngày cấp', formatPlainDate(user.issueDate))}
      ${detailItem('Loại bảo hiểm', user.insuranceType)}
      ${detailItem('Mã NV/SV', user.employeeId)}
      ${detailItem('Ngày đăng ký', formatDate(user.createdAt))}
      ${detailItem('Đăng nhập gần nhất', formatDate(user.lastLoginAt))}
    </div>

    <h3>Địa chỉ liên hệ</h3>
    <div class="detail-grid">
      ${detailItem('Tỉnh/Thành phố', user.province)}
      ${detailItem('Quận/Huyện', user.district)}
      ${detailItem('Phường/Xã', user.ward)}
      ${detailItem('Địa chỉ chi tiết', user.address)}
    </div>

    <h3>Thông tin ngân hàng</h3>
    <div class="detail-grid">
      ${detailItem('Chủ tài khoản', user.bankOwner)}
      ${detailItem('Số tài khoản', user.bankAccount)}
      ${detailItem('Tên ngân hàng', user.bankName)}
      ${detailItem('Chi nhánh', user.bankBranch)}
    </div>

    <h3>Hồ sơ gửi lên</h3>
    <div class="detail-grid">
      ${detailItem('Nơi đăng ký giao dịch', transactionPlaceLabels[user.transactionPlace] || user.transactionPlace)}
      ${detailItem('Hình thức nộp hồ sơ', submissionMethodLabels[user.submissionMethod] || user.submissionMethod)}
    </div>
    ${renderUploads(user)}
  `;
}

async function deleteUser(userId) {
  const user = allUsers.find((item) => item.id === userId);
  if (!user) return;

  const ok = window.confirm(`Bạn chắc chắn muốn xóa user "${user.fullName || user.email || userId}"?`);
  if (!ok) return;

  await api(`/api/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    body: '{}'
  });

  allUsers = allUsers.filter((item) => item.id !== userId);
  if (selectedUserId === userId) {
    selectedUserId = allUsers[0]?.id || '';
  }
  setAdminMessage('Đã xóa người dùng.', 'success');
  await loadDashboard();
}

function detailItem(label, value) {
  return `
    <div class="detail-item">
      <span>${escapeHtml(label)}</span>
      <strong>${valueOrEmpty(value)}</strong>
    </div>
  `;
}

function renderUploads(user) {
  const uploads = Object.entries(uploadLabels)
    .map(([key, label]) => ({ key, label, upload: getUpload(user, key) }))
    .filter((item) => item.upload?.dataUrl && /^data:image\/(png|jpe?g|webp);base64,/i.test(item.upload.dataUrl));

  if (!uploads.length) {
    return '<p class="empty-detail">Người dùng này chưa có ảnh tải lên.</p>';
  }

  return `
    <div class="upload-gallery">
      ${uploads.map(({ label, upload }) => `
        <a class="upload-card" href="${escapeAttr(upload.dataUrl)}" target="_blank" rel="noopener">
          <img src="${escapeAttr(upload.dataUrl)}" alt="${escapeAttr(label)}">
          <span>${escapeHtml(label)}</span>
        </a>
      `).join('')}
    </div>
  `;
}

function initials(name) {
  const words = String(name || '?').trim().split(/\s+/).slice(-2);
  return words.map((word) => word[0] || '').join('').toUpperCase() || '?';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

async function loadDashboard() {
  const [statsData, usersData] = await Promise.all([
    api('/api/admin/stats'),
    api('/api/admin/users')
  ]);
  allUsers = usersData.users.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  renderStats(statsData.stats);
  renderUsers();
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
  setAdminMessage('Đang đăng nhập...');
  try {
    await api('/api/admin/login', {
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

searchInput.addEventListener('input', renderUsers);

userSelect.addEventListener('change', () => {
  selectedUserId = userSelect.value;
  renderUsers();
});

usersBody.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-user-id]');
  if (deleteButton) {
    deleteUser(deleteButton.dataset.deleteUserId).catch((error) => setAdminMessage(error.message, 'error'));
    return;
  }

  const button = event.target.closest('[data-user-id]');
  const row = event.target.closest('[data-row-user-id]');
  const userId = button?.dataset.userId || row?.dataset.rowUserId;
  if (!userId) return;
  selectedUserId = userId;
  renderUsers();
});

userDetail.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-user-id]');
  if (!deleteButton) return;
  deleteUser(deleteButton.dataset.deleteUserId).catch((error) => setAdminMessage(error.message, 'error'));
});

adminLogout.addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST', body: '{}' });
  window.location.reload();
});

const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', async () => {
  exportButton.disabled = true;
  exportButton.textContent = 'Đang xuất...';
  try {
    const response = await fetch('/api/admin/export.xls', {
      credentials: 'same-origin'
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Lỗi xuất file');
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-dang-ky.xls';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    setAdminMessage(error.message, 'error');
  } finally {
    exportButton.disabled = false;
    exportButton.textContent = 'Xuất Excel';
  }
});

checkAdmin().catch(() => {});
