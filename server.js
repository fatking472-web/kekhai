const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT_DIR, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const SESSION_COOKIE = 'kb_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024 * 1024;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]\n');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '{}\n');
}

function readJson(file, fallback) {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureStore();
  const tempFile = `${file}.tmp`;
  fs.writeFileSync(tempFile, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(tempFile, file);
}

function nowIso() {
  return new Date().toISOString();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, user) {
  const attempted = hashPassword(password, user.salt).hash;
  const expected = Buffer.from(user.passwordHash, 'hex');
  const actual = Buffer.from(attempted, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function safeUser(user) {
  return {
    id: user.id,
    insuranceType: user.insuranceType || '',
    employeeId: user.employeeId || '',
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    insuranceCode: user.insuranceCode,
    citizenId: user.citizenId,
    issueDate: user.issueDate || '',
    accountType: user.accountType || '',
    documentType: user.documentType || '',
    documentNumber: user.documentNumber || user.citizenId,
    province: user.province || '',
    district: user.district || '',
    ward: user.ward || '',
    address: user.address || '',
    bankOwner: user.bankOwner || '',
    bankAccount: user.bankAccount || '',
    bankName: user.bankName || '',
    bankBranch: user.bankBranch || '',
    transactionPlace: user.transactionPlace || '',
    submissionMethod: user.submissionMethod || '',
    attachments: {
      portrait: user.attachments?.portrait || user.portrait || null,
      frontDoc: user.attachments?.frontDoc || user.frontDoc || null,
      backDoc: user.attachments?.backDoc || user.backDoc || null
    },
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null
  };
}

function normalizeImageUpload(value) {
  if (!value) return null;

  const upload = typeof value === 'string' ? { dataUrl: value } : value;
  if (!upload || typeof upload !== 'object') return null;

  const dataUrl = String(upload.dataUrl || '').trim();
  if (!/^data:image\/(png|jpe?g|webp);base64,/i.test(dataUrl)) return null;

  return {
    name: String(upload.name || '').trim(),
    type: String(upload.type || '').trim(),
    size: Number(upload.size || 0),
    dataUrl
  };
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return index === -1
          ? [decodeURIComponent(part), '']
          : [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function cleanExpiredSessions(sessions) {
  const time = Date.now();
  let changed = false;
  for (const [sessionId, session] of Object.entries(sessions)) {
    if (!session.expiresAt || new Date(session.expiresAt).getTime() <= time) {
      delete sessions[sessionId];
      changed = true;
    }
  }
  if (changed) writeJson(SESSIONS_FILE, sessions);
}

function getSession(req) {
  const sessions = readJson(SESSIONS_FILE, {});
  cleanExpiredSessions(sessions);
  const sessionId = parseCookies(req)[SESSION_COOKIE];
  if (!sessionId || !sessions[sessionId]) return null;
  return { id: sessionId, ...sessions[sessionId] };
}

function createSession(res, principalId, role) {
  const sessions = readJson(SESSIONS_FILE, {});
  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions[sessionId] = {
    principalId,
    role,
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
  };
  writeJson(SESSIONS_FILE, sessions);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
  );
}

function clearSession(req, res) {
  const cookies = parseCookies(req);
  const sessionId = cookies[SESSION_COOKIE];
  if (sessionId) {
    const sessions = readJson(SESSIONS_FILE, {});
    delete sessions[sessionId];
    writeJson(SESSIONS_FILE, sessions);
  }
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session || session.role !== 'admin') {
    sendError(res, 401, 'Bạn cần đăng nhập admin');
    return null;
  }
  return session;
}

function getCurrentPrincipal(req) {
  const session = getSession(req);
  if (!session) return null;
  if (session.role === 'admin') {
    return { role: 'admin', user: { username: ADMIN_USERNAME, role: 'admin' } };
  }
  const users = readJson(USERS_FILE, []);
  const user = users.find((item) => item.id === session.principalId);
  return user ? { role: 'user', user: safeUser(user) } : null;
}

function getStats(users) {
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    totalUsers: users.length,
    registeredToday: users.filter((user) => (user.createdAt || '').slice(0, 10) === today).length,
    registeredLast7Days: users.filter((user) => new Date(user.createdAt).getTime() >= sevenDaysAgo).length,
    usersLoggedIn: users.filter((user) => user.lastLoginAt).length,
    latestUsers: users
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(safeUser)
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function exportUsersXls(res, users) {
  const rows = users
    .map((user, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(user.insuranceType || '')}</td>
        <td>${escapeHtml(user.employeeId || '')}</td>
        <td>${escapeHtml(user.fullName)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${escapeHtml(user.phone)}</td>
        <td>${escapeHtml(user.insuranceCode)}</td>
        <td>${escapeHtml(user.citizenId)}</td>
        <td>${escapeHtml(user.issueDate || '')}</td>
        <td>${escapeHtml(user.documentType || '')}</td>
        <td>${escapeHtml(user.province || '')}</td>
        <td>${escapeHtml(user.district || '')}</td>
        <td>${escapeHtml(user.ward || '')}</td>
        <td>${escapeHtml(user.address || '')}</td>
        <td>${escapeHtml(user.bankOwner || '')}</td>
        <td>${escapeHtml(user.bankAccount || '')}</td>
        <td>${escapeHtml(user.bankName || '')}</td>
        <td>${escapeHtml(user.bankBranch || '')}</td>
        <td>${user.attachments?.portrait ? 'Có' : 'Không'}</td>
        <td>${user.attachments?.frontDoc ? 'Có' : 'Không'}</td>
        <td>${user.attachments?.backDoc ? 'Có' : 'Không'}</td>
        <td>${escapeHtml(user.createdAt)}</td>
        <td>${escapeHtml(user.lastLoginAt || '')}</td>
      </tr>`)
    .join('');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    table { border-collapse: collapse; }
    th, td { border: 1px solid #666; padding: 6px 8px; }
    th { background: #d9ead3; font-weight: bold; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Loại BH</th>
        <th>Mã NV/SV</th>
        <th>Họ và tên</th>
        <th>Email</th>
        <th>Số điện thoại</th>
        <th>Mã số BHXH</th>
        <th>Số CCCD/CMND</th>
        <th>Ngày cấp</th>
        <th>Loại giấy tờ</th>
        <th>Tỉnh/Thành phố</th>
        <th>Quận/Huyện</th>
        <th>Phường/Xã</th>
        <th>Địa chỉ</th>
        <th>Chủ tài khoản</th>
        <th>Số tài khoản</th>
        <th>Tên ngân hàng</th>
        <th>Chi nhánh</th>
        <th>Ảnh chân dung</th>
        <th>Ảnh giấy tờ mặt trước</th>
        <th>Ảnh giấy tờ mặt sau</th>
        <th>Ngày đăng ký</th>
        <th>Đăng nhập gần nhất</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  res.writeHead(200, {
    'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
    'Content-Disposition': 'attachment; filename="danh-sach-dang-ky.xls"'
  });
  res.end(`\ufeff${html}`);
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/me') {
    return sendJson(res, 200, { principal: getCurrentPrincipal(req) });
  }

  if (req.method === 'POST' && pathname === '/api/logout') {
    clearSession(req, res);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && pathname === '/api/register') {
    const body = await readBody(req);
    const fullName = String(body.fullName || '').trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');
    const phone = String(body.phone || '').trim();
    const insuranceCode = String(body.insuranceCode || '').trim();
    const citizenId = String(body.citizenId || body.documentNumber || '').trim();
    const extraFields = {
      insuranceType: String(body.insuranceType || '').trim(),
      employeeId: String(body.employeeId || '').trim(),
      issueDate: String(body.issueDate || '').trim(),
      accountType: String(body.accountType || '').trim(),
      documentType: String(body.documentType || '').trim(),
      documentNumber: String(body.documentNumber || citizenId).trim(),
      province: String(body.province || '').trim(),
      district: String(body.district || '').trim(),
      ward: String(body.ward || '').trim(),
      address: String(body.address || '').trim(),
      bankOwner: String(body.bankOwner || '').trim(),
      bankAccount: String(body.bankAccount || '').trim(),
      bankName: String(body.bankName || '').trim(),
      bankBranch: String(body.bankBranch || '').trim(),
      transactionPlace: String(body.transactionPlace || '').trim(),
      submissionMethod: String(body.submissionMethod || '').trim(),
      attachments: {
        portrait: normalizeImageUpload(body.portrait),
        frontDoc: normalizeImageUpload(body.frontDoc),
        backDoc: normalizeImageUpload(body.backDoc)
      }
    };

    if (!fullName) return sendError(res, 400, 'Vui lòng nhập họ và tên');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendError(res, 400, 'Email không hợp lệ');
    if (password.length < 6) return sendError(res, 400, 'Mật khẩu tối thiểu 6 ký tự');

    const users = readJson(USERS_FILE, []);
    if (users.some((user) => user.email === email)) return sendError(res, 409, 'Email đã được đăng ký');

    const passwordData = hashPassword(password);
    const user = {
      id: crypto.randomUUID(),
      fullName,
      email,
      phone,
      insuranceCode,
      citizenId,
      ...extraFields,
      role: 'user',
      salt: passwordData.salt,
      passwordHash: passwordData.hash,
      createdAt: nowIso(),
      lastLoginAt: null
    };
    users.push(user);
    writeJson(USERS_FILE, users);
    createSession(res, user.id, 'user');
    return sendJson(res, 201, { user: safeUser(user) });
  }

  if (req.method === 'POST' && pathname === '/api/admin/login') {
    const body = await readBody(req);
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      createSession(res, 'admin', 'admin');
      return sendJson(res, 200, { user: { username: ADMIN_USERNAME, role: 'admin' } });
    }
    return sendError(res, 401, 'Tài khoản hoặc mật khẩu không chính xác');
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    const body = await readBody(req);
    const rawIdentifier = String(body.email || body.username || body.identifier || '').trim();
    const identifier = normalizeEmail(rawIdentifier);
    const password = String(body.password || '');

    const users = readJson(USERS_FILE, []);
    const user = users.find((item) => item.email === identifier || item.insuranceCode === rawIdentifier);
    const validPassword = user && (
      verifyPassword(password, user) ||
      (user.insuranceCode === rawIdentifier && user.citizenId === password)
    );
    if (!user || !validPassword) return sendError(res, 401, 'Thông tin đăng nhập không đúng');

    user.lastLoginAt = nowIso();
    writeJson(USERS_FILE, users);
    createSession(res, user.id, 'user');
    return sendJson(res, 200, { user: safeUser(user) });
  }

  if (req.method === 'GET' && pathname === '/api/admin/stats') {
    if (!requireAdmin(req, res)) return;
    const users = readJson(USERS_FILE, []);
    return sendJson(res, 200, { stats: getStats(users) });
  }

  if (req.method === 'GET' && pathname === '/api/admin/users') {
    if (!requireAdmin(req, res)) return;
    const users = readJson(USERS_FILE, []);
    return sendJson(res, 200, { users: users.map(safeUser) });
  }

  if (req.method === 'DELETE' && pathname.startsWith('/api/admin/users/')) {
    if (!requireAdmin(req, res)) return;
    const userId = pathname.slice('/api/admin/users/'.length);
    const users = readJson(USERS_FILE, []);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) return sendError(res, 404, 'Không tìm thấy người dùng');

    const [deletedUser] = users.splice(userIndex, 1);
    writeJson(USERS_FILE, users);

    const sessions = readJson(SESSIONS_FILE, {});
    let changedSessions = false;
    for (const [sessionId, session] of Object.entries(sessions)) {
      if (session.principalId === deletedUser.id) {
        delete sessions[sessionId];
        changedSessions = true;
      }
    }
    if (changedSessions) writeJson(SESSIONS_FILE, sessions);

    return sendJson(res, 200, { ok: true, deletedUser: safeUser(deletedUser) });
  }

  if (req.method === 'GET' && pathname === '/api/admin/export.xls') {
    if (!requireAdmin(req, res)) return;
    const users = readJson(USERS_FILE, []);
    return exportUsersXls(res, users);
  }

  return sendError(res, 404, 'Không tìm thấy API');
}

function serveStatic(req, res, pathname) {
  const host = req.headers.host || '';
  const isHostAdmin = host.startsWith('admin.') || host.includes('localhost') || host.includes('127.0.0.1');

  if (isHostAdmin && pathname === '/') {
    pathname = '/admin-login.html';
  }

  let filePath = pathname === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, pathname);
  
  if (pathname === '/admin' || pathname === '/admin.html') {
    if (!isHostAdmin) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Forbidden: Vui lòng truy cập thông qua tên miền quản trị.');
    }
    filePath = path.join(PUBLIC_DIR, 'admin.html');
  }

  if (pathname === '/chon-dang-ky') filePath = path.join(PUBLIC_DIR, 'chon-dang-ky.html');
  if (pathname === '/dang-ky') filePath = path.join(PUBLIC_DIR, 'dang-ky.html');

  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(resolved, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
    return serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Lỗi server');
  }
});

ensureStore();
server.listen(PORT, () => {
  console.log(`Server dang chay tai http://localhost:${PORT}`);
  console.log(`Admin mac dinh: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
});
