const dashboard = document.getElementById('dashboard');
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
  if (text) alert(text);
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
                <strong>${valueOrEmpty(user.fullName)}</strong> ${user.role === 'admin' ? '<span class="status-pill" style="background:var(--primary);color:#fff;font-size:10px;padding:2px 6px;margin-left:4px;">Admin</span>' : ''}
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
        <button class="ghost-button" style="${user.role === 'admin' ? 'color: var(--danger); border-color: var(--danger);' : ''}" type="button" data-toggle-role-user-id="${escapeAttr(user.id)}">${user.role === 'admin' ? 'Hủy quyền Admin' : 'Cấp quyền Admin'}</button>
        <button class="primary-button" type="button" data-qr-user-id="${escapeAttr(user.id)}">Cấu hình QR</button>
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
      ${detailItem('Địa chỉ liên hệ', user.province)}
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

async function toggleUserRole(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;
  const newRole = user.role === 'admin' ? 'user' : 'admin';
  if (!confirm(`Bạn có chắc chắn muốn ${newRole === 'admin' ? 'cấp quyền Admin cho' : 'hủy quyền Admin của'} ${user.fullName || user.email || userId}?`)) return;
  
  await api(`/api/admin/users/${userId}/role`, {
    method: 'POST',
    body: JSON.stringify({ role: newRole })
  });
  setAdminMessage(`Đã ${newRole === 'admin' ? 'cấp' : 'hủy'} quyền Admin thành công`, 'success');
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
    .filter((item) => item.upload && item.upload.dataUrl);

  if (!uploads.length) {
    return '<p class="empty-detail">Người dùng này chưa có ảnh tải lên.</p>';
  }

  return `
    <div class="upload-gallery">
      ${uploads.map(({ label, upload }) => `
        <a class="upload-card" href="#" onclick="showImageModal(event, '${escapeAttr(upload.dataUrl)}')">
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
  renderUsers();
  dashboard.classList.remove('hidden');
  adminLogout.classList.remove('hidden');
}

async function checkAdmin() {
  try {
    const data = await api('/api/me');
    if (data.principal?.role === 'admin') {
      await loadDashboard();
    } else {
      window.location.href = '/admin-login.html';
    }
  } catch {
    window.location.href = '/admin-login.html';
  }
}

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
  const target = event.target;
  if (target.matches('[data-delete-user-id]')) {
    deleteUser(target.getAttribute('data-delete-user-id')).catch((error) => setAdminMessage(error.message, 'error'));
  } else if (target.matches('[data-qr-user-id]')) {
    openUserQrModal(target.getAttribute('data-qr-user-id'));
  } else if (target.matches('[data-toggle-role-user-id]')) {
    toggleUserRole(target.getAttribute('data-toggle-role-user-id')).catch(e => setAdminMessage(e.message, 'error'));
  }
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

// Tabs logic
const tabUsers = document.getElementById('tabUsers');
const tabDeclarations = document.getElementById('tabDeclarations');
const tabAppointments = document.getElementById('tabAppointments');
const tabVietQR = document.getElementById('tabVietQR');
const sectionUsers = document.getElementById('sectionUsers');
const sectionDeclarations = document.getElementById('sectionDeclarations');
const sectionAppointments = document.getElementById('sectionAppointments');
const sectionVietQR = document.getElementById('sectionVietQR');

function switchTab(activeTabId) {
  tabUsers.className = activeTabId === 'tabUsers' ? 'primary-button' : 'ghost-button';
  tabDeclarations.className = activeTabId === 'tabDeclarations' ? 'primary-button' : 'ghost-button';
  tabAppointments.className = activeTabId === 'tabAppointments' ? 'primary-button' : 'ghost-button';
  tabVietQR.className = activeTabId === 'tabVietQR' ? 'primary-button' : 'ghost-button';

  sectionUsers.className = activeTabId === 'tabUsers' ? '' : 'hidden';
  sectionDeclarations.className = activeTabId === 'tabDeclarations' ? '' : 'hidden';
  sectionAppointments.className = activeTabId === 'tabAppointments' ? '' : 'hidden';
  sectionVietQR.className = activeTabId === 'tabVietQR' ? '' : 'hidden';

  if (activeTabId === 'tabDeclarations') loadDeclarations();
  if (activeTabId === 'tabAppointments') loadAppointments();
  if (activeTabId === 'tabVietQR') loadVietQRConfig();
}

tabUsers.addEventListener('click', () => switchTab('tabUsers'));
tabDeclarations.addEventListener('click', () => switchTab('tabDeclarations'));
tabAppointments.addEventListener('click', () => switchTab('tabAppointments'));
tabVietQR.addEventListener('click', () => switchTab('tabVietQR'));

document.getElementById('refreshDeclarationsButton').addEventListener('click', loadDeclarations);

async function loadDeclarations() {
  try {
    const data = await api('/api/admin/ke-khai');
    const tbody = document.getElementById('declarationsBody');
    tbody.innerHTML = '';
    
    if (data.declarations && data.declarations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Không có hồ sơ nào</td></tr>';
      return;
    }
    
    data.declarations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(decl => {
      const tr = document.createElement('tr');
      
      const imgs = [];
      if (decl.portraitUrl) imgs.push(`<a href="#" onclick="showImageModal(event, '${decl.portraitUrl}')">Chân dung</a>`);
      if (decl.frontDocUrl) imgs.push(`<a href="#" onclick="showImageModal(event, '${decl.frontDocUrl}')">Mặt trước</a>`);
      if (decl.backDocUrl) imgs.push(`<a href="#" onclick="showImageModal(event, '${decl.backDocUrl}')">Mặt sau</a>`);
      
      tr.innerHTML = `
        <td>
          <div class="user-row-name">${escapeHtml(decl.userName || 'Không tên')}</div>
          <div class="user-row-email">${escapeHtml(decl.userPhone || '')}</div>
        </td>
        <td>${escapeHtml(decl.bankOwner)}</td>
        <td>${escapeHtml(decl.bankAccount)}</td>
        <td>${escapeHtml(decl.bankName)}</td>
        <td>${decl.submissionMethod === 'home' ? 'Tại nhà' : 'Tại cơ quan'}</td>
        <td>${imgs.join(' | ')}</td>
        <td class="date-col">${formatDate(decl.createdAt)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    setAdminMessage('Lỗi tải hồ sơ kê khai: ' + err.message, 'error');
  }
}

function showImageModal(e, base64) {
  e.preventDefault();
  let imgModal = document.getElementById('imageModal');
  if (!imgModal) {
    imgModal = document.createElement('div');
    imgModal.id = 'imageModal';
    imgModal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; justify-content:center; align-items:center;';
    imgModal.innerHTML = `
      <div style="position:relative; max-width:90%; max-height:90%;">
        <span onclick="document.getElementById('imageModal').style.display='none'" style="position:absolute; top:-40px; right:0; color:#fff; font-size:30px; cursor:pointer;">&times;</span>
        <img id="imageModalContent" src="" style="max-width:100%; max-height:90vh; border-radius:8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
      </div>
    `;
    document.body.appendChild(imgModal);
    imgModal.addEventListener('click', function(ev) {
      if(ev.target === imgModal) imgModal.style.display = 'none';
    });
  }
  document.getElementById('imageModalContent').src = base64;
  imgModal.style.display = 'flex';
}

// Appointments logic
async function loadAppointments() {
  try {
    const data = await api('/api/admin/appointments');
    const tbody = document.getElementById('appointmentsBody');
    tbody.innerHTML = '';
    
    if (!data.appointments || data.appointments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Chưa có đơn đặt lịch nào</td></tr>';
      return;
    }
    
    // Sort descending by time
    data.appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    data.appointments.forEach(app => {
      const tr = document.createElement('tr');
      const timeStr = new Date(app.time).toLocaleString('vi-VN');
      const createdStr = new Date(app.createdAt).toLocaleString('vi-VN');
      
      const statusSelect = `
        <select onchange="updateAppointmentStatus('${app.id}', this.value)" style="padding: 4px; border-radius: 4px;">
          <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
          <option value="approved" ${app.status === 'approved' ? 'selected' : ''}>Đã duyệt</option>
          <option value="completed" ${app.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
          <option value="cancelled" ${app.status === 'cancelled' ? 'selected' : ''}>Đã huỷ</option>
        </select>
      `;

      tr.innerHTML = `
        <td><strong>${timeStr}</strong></td>
        <td>${escapeHtml(app.note)}</td>
        <td>${createdStr}</td>
        <td>${statusSelect}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Lỗi tải danh sách đặt lịch', error);
  }
}

document.getElementById('refreshAppointmentsButton').addEventListener('click', loadAppointments);

window.updateAppointmentStatus = async function(id, status) {
  try {
    await api('/api/admin/appointments/' + id + '/status', {
      method: 'POST',
      body: JSON.stringify({ status })
    });
    // Optional: show a toast/notification
  } catch (error) {
    alert('Cập nhật trạng thái thất bại: ' + error.message);
    loadAppointments(); // rollback
  }
};

// VietQR logic
const vietqrForm = document.getElementById('vietqrForm');
const vietqrMessage = document.getElementById('vietqrMessage');

async function loadVietQRConfig() {
  try {
    const data = await api('/api/vietqr/config');
    if (data.config) {
      Object.keys(data.config).forEach(key => {
        const input = vietqrForm.elements[key];
        if (input) input.value = data.config[key];
      });
    }
  } catch (error) {
    console.error('Lỗi tải cấu hình VietQR', error);
  }
}

vietqrForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  vietqrMessage.textContent = 'Đang lưu...';
  vietqrMessage.className = 'message';
  
  try {
    const body = formData(vietqrForm);
    // Convert amount to number
    body.amount = parseInt(body.amount) || 0;
    
    await api('/api/admin/vietqr/config', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    
    vietqrMessage.textContent = 'Đã lưu cấu hình VietQR thành công';
    vietqrMessage.className = 'message success';
  } catch (error) {
    vietqrMessage.textContent = error.message;
    vietqrMessage.className = 'message error';
  }
});

// USER QR CONFIG LOGIC
function openUserQrModal(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;
  
  document.getElementById('modalUserQr').classList.remove('hidden');
  document.getElementById('userQrIdText').textContent = user.fullName || user.email || userId;
  document.getElementById('userQrId').value = userId;
  document.getElementById('userQrMessage').textContent = '';
  document.getElementById('userQrForm').reset();
  
  const qrConfig = user.customQrConfig || {};
  const currentQrType = qrConfig.qrType || qrConfig.type;
  if (currentQrType === 'image') {
    document.querySelector('input[name="qrType"][value="image"]').checked = true;
    document.getElementById('qrImageDataUrl').value = qrConfig.dataUrl || '';
    document.getElementById('qrImagePreview').src = qrConfig.dataUrl || '';
    document.getElementById('qrImagePreview').style.display = qrConfig.dataUrl ? 'block' : 'none';
  } else {
    document.querySelector('input[name="qrType"][value="vietqr"]').checked = true;
    const form = document.getElementById('userQrForm');
    const bankId = qrConfig.bankId || '';
    document.getElementById('hiddenBankId').value = bankId;
    document.getElementById('bankSearchInput').value = bankId;
    
    // try to resolve bank name if banks list is loaded
    if (bankId && typeof banksList !== 'undefined' && banksList.length > 0) {
      const bank = banksList.find(b => b.bin === bankId || b.shortName === bankId);
      if (bank) {
        document.getElementById('bankSearchInput').value = bank.shortName + ' - ' + bank.name;
      }
    } else if (bankId && typeof fetchBanks === 'function') {
      fetchBanks().then(() => {
        const bank = banksList.find(b => b.bin === bankId || b.shortName === bankId);
        if (bank) {
          document.getElementById('bankSearchInput').value = bank.shortName + ' - ' + bank.name;
        }
      });
    }

    form.elements['accountNo'].value = qrConfig.accountNo || '';
    form.elements['accountName'].value = qrConfig.accountName || '';
    const amountVal = qrConfig.amount || '';
    if (amountVal) {
      form.elements['amount'].value = amountVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      form.elements['amount'].value = '';
    }
    form.elements['description'].value = qrConfig.description || '';
    form.elements['background_image'].value = qrConfig.background_image || 'qr1 (1).jpg';
    document.getElementById('qrImagePreview').src = '';
    document.getElementById('qrImagePreview').style.display = 'none';
    document.getElementById('qrImageDataUrl').value = '';
  }
  toggleQrType();
}

function closeUserQrModal() {
  document.getElementById('modalUserQr').classList.add('hidden');
}

function toggleQrType() {
  const isVietQr = document.querySelector('input[name="qrType"]:checked').value === 'vietqr';
  document.getElementById('qrVietQrSection').classList.toggle('hidden', !isVietQr);
  document.getElementById('qrImageSection').classList.toggle('hidden', isVietQr);
}

function previewQrImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('qrImageDataUrl').value = e.target.result;
    document.getElementById('qrImagePreview').src = e.target.result;
    document.getElementById('qrImagePreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

async function clearUserQr() {
  const userId = document.getElementById('userQrId').value;
  if (!userId) return;
  if (!confirm('Bạn có chắc chắn muốn xoá cấu hình QR riêng của User này?')) return;
  
  const msg = document.getElementById('userQrMessage');
  msg.textContent = 'Đang xoá...';
  msg.className = 'message';
  
  try {
    await api('/api/admin/users/' + userId + '/qr', { method: 'POST', body: null });
    msg.textContent = 'Đã xoá cấu hình QR thành công';
    msg.className = 'message success';
    await loadDashboard(); // reload
    setTimeout(() => closeUserQrModal(), 1000);
  } catch (error) {
    msg.textContent = error.message;
    msg.className = 'message error';
  }
}

document.getElementById('userQrForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const userId = document.getElementById('userQrId').value;
  const msg = document.getElementById('userQrMessage');
  const type = document.querySelector('input[name="qrType"]:checked').value;
  
  let body = { qrType: type };
  if (type === 'vietqr') {
    body.bankId = document.getElementById('hiddenBankId').value || document.getElementById('bankSearchInput').value;
    body.accountNo = form.elements['accountNo'].value;
    body.accountName = form.elements['accountName'].value;
    body.amount = form.elements['amount'].value ? Number(form.elements['amount'].value.replace(/\D/g, '')) : 0;
    body.description = form.elements['description'].value;
    body.background_image = form.elements['background_image'].value;
  } else {
    body.dataUrl = document.getElementById('qrImageDataUrl').value;
    if (!body.dataUrl) {
      msg.textContent = 'Vui lòng tải lên ảnh QR';
      msg.className = 'message error';
      return;
    }
  }

  msg.textContent = 'Đang lưu...';
  msg.className = 'message';
  try {
    await api('/api/admin/users/' + userId + '/qr', { method: 'POST', body: JSON.stringify(body) });
    msg.textContent = 'Đã lưu cấu hình QR thành công';
    msg.className = 'message success';
    await loadDashboard(); // reload
    setTimeout(() => closeUserQrModal(), 1000);
  } catch (error) {
    msg.textContent = error.message;
    msg.className = 'message error';
  }
});

// Bank list and currency formatting logic
let banksList = [];

async function fetchBanks() {
  if (banksList.length > 0) return;
  try {
    const res = await fetch('https://api.vietqr.io/v2/banks');
    const data = await res.json();
    if (data.code === '00') {
      banksList = data.data;
      renderBanks(banksList);
    }
  } catch (error) {
    console.error('Lỗi lấy danh sách ngân hàng:', error);
  }
}

function renderBanks(banks) {
  const dropdown = document.getElementById('bankDropdown');
  dropdown.innerHTML = '';
  banks.forEach(bank => {
    const item = document.createElement('div');
    item.style.padding = '8px';
    item.style.cursor = 'pointer';
    item.style.borderBottom = '1px solid #eee';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '10px';
    item.innerHTML = `
      <img src="${bank.logo}" style="width: 40px; height: auto; object-fit: contain;">
      <div>
        <div style="font-weight: bold; font-size: 0.85rem;">${bank.shortName} - ${bank.name}</div>
      </div>
    `;
    item.onmousedown = (e) => {
      e.preventDefault(); // prevent input blur
      selectBank(bank);
    };
    dropdown.appendChild(item);
  });
}

function showBankDropdown() {
  document.getElementById('bankDropdown').style.display = 'block';
  fetchBanks();
}

function hideBankDropdown() {
  setTimeout(() => {
    document.getElementById('bankDropdown').style.display = 'none';
  }, 150);
}

document.getElementById('bankSearchInput').addEventListener('blur', hideBankDropdown);

function filterBanks() {
  const query = document.getElementById('bankSearchInput').value.toLowerCase();
  const filtered = banksList.filter(b => 
    b.shortName.toLowerCase().includes(query) || 
    b.name.toLowerCase().includes(query) ||
    b.bin.toLowerCase().includes(query)
  );
  renderBanks(filtered);
}

function selectBank(bank) {
  document.getElementById('bankSearchInput').value = bank.shortName + ' - ' + bank.name;
  document.getElementById('hiddenBankId').value = bank.bin;
  document.getElementById('bankDropdown').style.display = 'none';
}

// Xử lý định dạng số tiền trực tiếp khi gõ (hiển thị dấu . ngay lập tức)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('input[name="amount"]').forEach(el => {
      el.setAttribute('type', 'tel'); // Ép kiểu số điện thoại để tắt tiên đoán từ
      
      // Xoá các event cũ có thể gây lỗi
      el.removeAttribute('oninput');
      el.removeAttribute('onkeyup');
      
      // Khắc phục lỗi lặp số trên Gboard: Định dạng khi blur, xoá định dạng khi focus
      el.addEventListener('focus', function() {
        let val = this.value.replace(/\D/g, '');
        this.value = val;
      });

      el.addEventListener('blur', function() {
        let val = this.value.replace(/\D/g, '');
        if (val !== '') {
          this.value = parseInt(val, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      });

      el.addEventListener('input', function() {
        // Chỉ lọc bỏ các ký tự không phải số trong lúc gõ (không format có dấu chấm)
        let val = this.value.replace(/\D/g, '');
        if (this.value !== val) {
          this.value = val;
        }
      });
      
      // Khởi tạo format lần đầu nếu có dữ liệu
      let initialVal = el.value.replace(/\D/g, '');
      if (initialVal) {
         el.value = parseInt(initialVal, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    });
  }, 500);
});
