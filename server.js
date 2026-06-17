const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const cookieParser = require('cookie-parser');
const exceljs = require('exceljs');

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'database.sqlite');
const SESSION_COOKIE = 'kb_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PRE_AUTH_TTL_MS = 5 * 60 * 1000;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

let db;

async function initDB() {
  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      fullName TEXT,
      email TEXT,
      phone TEXT,
      insuranceCode TEXT,
      citizenId TEXT,
      role TEXT,
      salt TEXT,
      passwordHash TEXT,
      createdAt TEXT,
      lastLoginAt TEXT,
      insuranceType TEXT,
      employeeId TEXT,
      issueDate TEXT,
      accountType TEXT,
      documentType TEXT,
      documentNumber TEXT,
      province TEXT,
      district TEXT,
      ward TEXT,
      address TEXT,
      bankOwner TEXT,
      bankAccount TEXT,
      bankName TEXT,
      bankBranch TEXT,
      transactionPlace TEXT,
      submissionMethod TEXT,
      customQrConfig_json TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      principalId TEXT,
      role TEXT,
      pendingTwoFactor INTEGER,
      createdAt TEXT,
      expiresAt TEXT
    );

    CREATE TABLE IF NOT EXISTS declarations (
      id TEXT PRIMARY KEY,
      userId TEXT,
      userPhone TEXT,
      userName TEXT,
      bankOwner TEXT,
      bankAccount TEXT,
      bankName TEXT,
      transactionPlace TEXT,
      submissionMethod TEXT,
      portraitUrl TEXT,
      frontDocUrl TEXT,
      backDocUrl TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      time TEXT,
      note TEXT,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value_json TEXT
    );
  `);

  const vietqr = await db.get('SELECT * FROM settings WHERE key = ?', ['vietqr_config']);
  if (!vietqr) {
    const defaultQR = {"bank_id":"vcb","bank_name":"Vietcombank","account_no":"","account_name":"","amount":0,"description":"","title":"Ngân hàng Nhà nước Việt Nam","subtitle":"","instruction":"","button_text":"Tải app VNeID để xác thực","background_image":"qr1 (1).jpg"};
    await db.run('INSERT INTO settings (key, value_json) VALUES (?, ?)', ['vietqr_config', JSON.stringify(defaultQR)]);
  }
}

// Helpers
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

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function safeUser(user) {
  const u = { ...user };
  delete u.salt;
  delete u.passwordHash;
  if (u.customQrConfig_json) {
    try { u.customQrConfig = JSON.parse(u.customQrConfig_json); } catch {}
    delete u.customQrConfig_json;
  }
  return u;
}

// Express App
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin Auth middleware
async function getSession(req) {
  const sessionId = req.cookies[SESSION_COOKIE];
  if (!sessionId) return null;
  const session = await db.get('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
    return null;
  }
  return session;
}

async function requireAdmin(req, res, next) {
  const session = await getSession(req);
  if (!session || session.role !== 'admin' || session.pendingTwoFactor) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập admin' });
  }
  req.session = session;
  next();
}

async function requireUser(req, res, next) {
  const session = await getSession(req);
  if (!session || session.pendingTwoFactor) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }
  if (session.role === 'admin') {
    req.principal = { role: 'admin', user: { username: ADMIN_USERNAME, role: 'admin' } };
    return next();
  }
  const user = await db.get('SELECT * FROM users WHERE id = ?', [session.principalId]);
  if (!user) return res.status(401).json({ error: 'Người dùng không tồn tại' });
  req.principal = { role: 'user', user: safeUser(user) };
  next();
}

// API Routes
app.get('/api/me', requireUser, (req, res) => {
  res.json({ principal: req.principal });
});

app.post('/api/logout', async (req, res) => {
  const sessionId = req.cookies[SESSION_COOKIE];
  if (sessionId) {
    await db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
  }
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.post('/api/register', async (req, res) => {
  const b = req.body;
  const fullName = String(b.fullName || '').trim();
  const email = normalizeEmail(b.email);
  const password = String(b.password || '');
  const phone = String(b.phone || '').trim();
  const insuranceCode = String(b.insuranceCode || '').trim();
  const citizenId = String(b.citizenId || b.documentNumber || '').trim();

  if (!fullName) return res.status(400).json({ error: 'Vui lòng nhập họ và tên' });
  if (password.length < 6) return res.status(400).json({ error: 'Mật khẩu tối thiểu 6 ký tự' });

  const id = crypto.randomUUID();
  const { salt, hash } = hashPassword(password);
  
  await db.run(`
    INSERT INTO users (
      id, fullName, email, phone, insuranceCode, citizenId, role, salt, passwordHash, createdAt,
      insuranceType, employeeId, issueDate, accountType, documentType, documentNumber,
      province, district, ward, address, bankOwner, bankAccount, bankName, bankBranch,
      transactionPlace, submissionMethod
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, fullName, email, phone, insuranceCode, citizenId, 'user', salt, hash, nowIso(),
    b.insuranceType||'', b.employeeId||'', b.issueDate||'', b.accountType||'', b.documentType||'', b.documentNumber||citizenId,
    b.province||'', b.district||'', b.ward||'', b.address||'', b.bankOwner||'', b.bankAccount||'', b.bankName||'', b.bankBranch||'',
    b.transactionPlace||'', b.submissionMethod||''
  ]);

  const sessionId = crypto.randomBytes(32).toString('hex');
  await db.run('INSERT INTO sessions (id, principalId, role, pendingTwoFactor, createdAt, expiresAt) VALUES (?, ?, ?, 0, ?, ?)',
    [sessionId, id, 'user', nowIso(), new Date(Date.now() + SESSION_TTL_MS).toISOString()]);
  
  res.cookie(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'lax', maxAge: Math.floor(SESSION_TTL_MS/1000) });
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  res.status(201).json({ user: safeUser(user) });
});

app.post('/api/login', async (req, res) => {
  const { email, username, identifier, password } = req.body;
  const rawId = String(email || username || identifier || '').trim();
  const normEmail = normalizeEmail(rawId);
  const pwd = String(password || '');

  const user = await db.get('SELECT * FROM users WHERE email = ? OR insuranceCode = ?', [normEmail, rawId]);
  let validPassword = false;
  if (user) {
    validPassword = verifyPassword(pwd, user) || (user.insuranceCode === rawId && user.citizenId === pwd);
  }

  if (!user || !validPassword) return res.status(401).json({ error: 'Thông tin đăng nhập không đúng' });

  await db.run('UPDATE users SET lastLoginAt = ? WHERE id = ?', [nowIso(), user.id]);

  const sessionId = crypto.randomBytes(32).toString('hex');
  await db.run('INSERT INTO sessions (id, principalId, role, pendingTwoFactor, createdAt, expiresAt) VALUES (?, ?, ?, 0, ?, ?)',
    [sessionId, user.id, user.role || 'user', nowIso(), new Date(Date.now() + SESSION_TTL_MS).toISOString()]);
  
  res.cookie(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'lax', maxAge: Math.floor(SESSION_TTL_MS/1000) });
  res.json({ user: safeUser(user) });
});

// Admin 2FA routes
async function getTotpConfig() {
  const row = await db.get('SELECT value_json FROM settings WHERE key = ?', ['admin-2fa']);
  return row ? JSON.parse(row.value_json) : null;
}
async function saveTotpConfig(config) {
  await db.run('INSERT OR REPLACE INTO settings (key, value_json) VALUES (?, ?)', ['admin-2fa', JSON.stringify(config)]);
}

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  let adminPrincipalId = 'admin';

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    const rawId = String(username || '').trim();
    const normEmail = normalizeEmail(rawId);
    const pwd = String(password || '');

    const user = await db.get('SELECT * FROM users WHERE email = ? OR phone = ? OR insuranceCode = ?', [normEmail, rawId, rawId]);
    let validPassword = false;
    if (user) {
      validPassword = verifyPassword(pwd, user) || (user.insuranceCode === rawId && user.citizenId === pwd);
    }

    if (!user || !validPassword || user.role !== 'admin') {
      return res.status(401).json({ error: 'Tài khoản, mật khẩu không chính xác hoặc không có quyền Admin' });
    }
    adminPrincipalId = user.id;
  }

  const preAuthToken = crypto.randomBytes(32).toString('hex');
  await db.run('INSERT INTO sessions (id, principalId, role, pendingTwoFactor, createdAt, expiresAt) VALUES (?, ?, ?, 1, ?, ?)',
    [preAuthToken, adminPrincipalId, 'admin', nowIso(), new Date(Date.now() + PRE_AUTH_TTL_MS).toISOString()]);

  const totpConfig = await getTotpConfig();
  if (!totpConfig || !totpConfig.verified) {
    const secret = speakeasy.generateSecret({ length: 20, name: 'BHXH Admin', issuer: 'BHXH' }).base32;
    const emergencyCode = crypto.randomBytes(12).toString('hex').toUpperCase();
    const emergencyHash = crypto.createHash('sha256').update(emergencyCode).digest('hex');

    await saveTotpConfig({ secret, verified: false, emergencyHash, setupAt: null });

    const otpAuthUrl = speakeasy.otpauthURL({ secret, label: encodeURIComponent('BHXH Admin:' + ADMIN_USERNAME), issuer: 'BHXH Admin', encoding: 'base32' });
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

    return res.json({ requireSetup: true, qrCodeUrl, secret, emergencyCode, preAuthToken });
  }

  res.json({ require2FA: true, preAuthToken });
});

app.post('/api/admin/verify-2fa', async (req, res) => {
  const { totp, preAuthToken, confirmSetup } = req.body;
  const session = await db.get('SELECT * FROM sessions WHERE id = ? AND pendingTwoFactor = 1', [preAuthToken]);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    return res.status(401).json({ error: 'Phiên xác thực hết hạn' });
  }

  const config = await getTotpConfig();
  if (!config || !config.secret) return res.status(500).json({ error: 'Lỗi 2FA' });

  const isValid = speakeasy.totp.verify({ secret: config.secret, encoding: 'base32', token: String(totp).trim(), window: 1 });
  if (!isValid) return res.status(401).json({ error: 'Mã xác thực không đúng' });

  if (confirmSetup && !config.verified) {
    config.verified = true;
    config.setupAt = nowIso();
    await saveTotpConfig(config);
  }

  await db.run('DELETE FROM sessions WHERE id = ?', [preAuthToken]);
  const sessionId = crypto.randomBytes(32).toString('hex');
  await db.run('INSERT INTO sessions (id, principalId, role, pendingTwoFactor, createdAt, expiresAt) VALUES (?, ?, ?, 0, ?, ?)',
    [sessionId, session.principalId, 'admin', nowIso(), new Date(Date.now() + SESSION_TTL_MS).toISOString()]);

  res.cookie(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'lax', maxAge: Math.floor(SESSION_TTL_MS/1000) });
  
  if (session.principalId === 'admin') {
    res.json({ user: { username: ADMIN_USERNAME, role: 'admin' } });
  } else {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [session.principalId]);
    res.json({ user: safeUser(user) });
  }
});

app.post('/api/admin/reset-2fa', async (req, res) => {
  const { emergencyCode, username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Sai tài khoản' });
  
  const config = await getTotpConfig();
  if (!config || !config.emergencyHash) return res.status(400).json({ error: 'Chưa cài đặt 2FA' });

  const hash = crypto.createHash('sha256').update(String(emergencyCode).trim().toUpperCase()).digest('hex');
  if (hash !== config.emergencyHash) return res.status(401).json({ error: 'Mã khẩn cấp sai' });

  await db.run('DELETE FROM settings WHERE key = ?', ['admin-2fa']);
  res.json({ ok: true, message: '2FA đã reset' });
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  const users = await db.all('SELECT * FROM users ORDER BY createdAt DESC');
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  res.json({
    stats: {
      totalUsers: users.length,
      registeredToday: users.filter(u => (u.createdAt||'').slice(0, 10) === today).length,
      registeredLast7Days: users.filter(u => u.createdAt >= sevenDaysAgo).length,
      usersLoggedIn: users.filter(u => u.lastLoginAt).length,
      latestUsers: users.slice(0, 5).map(safeUser)
    }
  });
});

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  const users = await db.all('SELECT * FROM users');
  res.json({ users: users.map(safeUser) });
});

app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

  await db.run('DELETE FROM users WHERE id = ?', [id]);
  await db.run('DELETE FROM sessions WHERE principalId = ?', [id]);
  res.json({ ok: true, deletedUser: safeUser(user) });
});

app.post('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Role không hợp lệ' });
  
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

  await db.run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  const updated = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  res.json({ ok: true, user: safeUser(updated) });
});

app.post('/api/admin/users/:id/qr', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

  await db.run('UPDATE users SET customQrConfig_json = ? WHERE id = ?', [JSON.stringify(req.body), id]);
  const updated = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  res.json({ ok: true, message: 'Đã cập nhật', user: safeUser(updated) });
});

app.post('/api/appointments', async (req, res) => {
  const { time, note } = req.body;
  if (!time) return res.status(400).json({ error: 'Thiếu thời gian' });
  const appt = { id: crypto.randomUUID(), time, note: note || '', status: 'pending', createdAt: nowIso() };
  await db.run('INSERT INTO appointments (id, time, note, status, createdAt) VALUES (?, ?, ?, ?, ?)', [appt.id, appt.time, appt.note, appt.status, appt.createdAt]);
  res.json({ ok: true, appointment: appt });
});

app.get('/api/admin/appointments', requireAdmin, async (req, res) => {
  const apps = await db.all('SELECT * FROM appointments');
  res.json({ ok: true, appointments: apps });
});

app.post('/api/admin/appointments/:id/status', requireAdmin, async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  if (!status) return res.status(400).json({ error: 'Thiếu trạng thái' });
  await db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  const appt = await db.get('SELECT * FROM appointments WHERE id = ?', [id]);
  if (!appt) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, appointment: appt });
});

app.get('/api/vietqr/config', async (req, res) => {
  const row = await db.get('SELECT value_json FROM settings WHERE key = ?', ['vietqr_config']);
  res.json({ ok: true, config: row ? JSON.parse(row.value_json) : null });
});

app.post('/api/admin/vietqr/config', requireAdmin, async (req, res) => {
  await db.run('UPDATE settings SET value_json = ? WHERE key = ?', [JSON.stringify(req.body), 'vietqr_config']);
  res.json({ ok: true, message: 'Đã cập nhật' });
});

app.post('/api/ke-khai', requireUser, upload.fields([{ name: 'portrait' }, { name: 'frontDoc' }, { name: 'backDoc' }]), async (req, res) => {
  const { bankOwner, bankAccount, bankName, transactionPlace, submissionMethod } = req.body;
  if (!bankOwner || !bankAccount || !bankName) return res.status(400).json({ error: 'Thiếu thông tin ngân hàng' });

  const pUrl = req.files['portrait'] ? '/uploads/' + req.files['portrait'][0].filename : null;
  const fUrl = req.files['frontDoc'] ? '/uploads/' + req.files['frontDoc'][0].filename : null;
  const bUrl = req.files['backDoc'] ? '/uploads/' + req.files['backDoc'][0].filename : null;

  const id = crypto.randomUUID();
  const u = req.principal.user;
  
  await db.run(`
    INSERT INTO declarations (
      id, userId, userPhone, userName, bankOwner, bankAccount, bankName, transactionPlace, submissionMethod,
      portraitUrl, frontDocUrl, backDocUrl, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, u.id, u.phone, u.fullName, bankOwner, bankAccount, bankName, transactionPlace, submissionMethod,
    pUrl, fUrl, bUrl, nowIso()
  ]);

  res.json({ ok: true });
});

app.get('/api/admin/ke-khai', requireAdmin, async (req, res) => {
  const decls = await db.all('SELECT * FROM declarations');
  res.json({ ok: true, declarations: decls });
});

app.get('/api/admin/export.xls', requireAdmin, async (req, res) => {
  const users = await db.all('SELECT * FROM users');
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Danh sach dang ky');
  
  worksheet.columns = [
    { header: 'STT', key: 'stt', width: 5 },
    { header: 'Loại BH', key: 'insuranceType', width: 15 },
    { header: 'Mã NV/SV', key: 'employeeId', width: 15 },
    { header: 'Họ và tên', key: 'fullName', width: 25 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Số điện thoại', key: 'phone', width: 15 },
    { header: 'Mã số BHXH', key: 'insuranceCode', width: 15 },
    { header: 'Số CCCD/CMND', key: 'citizenId', width: 15 },
    { header: 'Ngày đăng ký', key: 'createdAt', width: 20 },
  ];

  users.forEach((u, i) => {
    worksheet.addRow({
      stt: i + 1,
      insuranceType: u.insuranceType,
      employeeId: u.employeeId,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      insuranceCode: u.insuranceCode,
      citizenId: u.citizenId,
      createdAt: u.createdAt
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="danh-sach-dang-ky.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
});

// Static routes using Express
app.use((req, res, next) => {
  const host = req.headers.host || '';
  const isHostAdmin = host.startsWith('admin.') || host.includes('localhost') || host.includes('127.0.0.1');

  if (host.startsWith('admin.') && req.path === '/') {
    return res.sendFile(path.join(PUBLIC_DIR, 'admin-login.html'));
  }
  
  if (req.path === '/admin' || req.path === '/admin.html') {
    if (!isHostAdmin) return res.status(403).send('Forbidden: Vui lòng truy cập thông qua tên miền quản trị.');
    return res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
  }

  if (req.path === '/chon-dang-ky') return res.sendFile(path.join(PUBLIC_DIR, 'chon-dang-ky.html'));
  if (req.path === '/dang-ky') return res.sendFile(path.join(PUBLIC_DIR, 'dang-ky.html'));

  next();
});

app.use(express.static(PUBLIC_DIR));

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Express dang chay tai http://localhost:${PORT}`);
    console.log(`Admin mac dinh: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
  });
}).catch(console.error);
