// Real API client for the SmartCare inpatient/clinical pages.
// Talks to the same-origin .NET API (wwwroot is served by app.UseStaticFiles()).
// Mirrors the ergonomics of MockAPI but performs authenticated fetch() calls.
(function () {
  const TOKEN_KEY = 'smartcare.token';
  const USER_KEY = 'smartcare.user';
  const EXP_KEY = 'smartcare.expiresAt';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
    catch { return null; }
  }
  function isExpired() {
    const exp = localStorage.getItem(EXP_KEY);
    return exp ? new Date(exp).getTime() <= Date.now() : false;
  }
  function setSession(auth) {
    localStorage.setItem(TOKEN_KEY, auth.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user || null));
    if (auth.expiresAt) localStorage.setItem(EXP_KEY, auth.expiresAt);
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXP_KEY);
  }
  function logout() { clearSession(); location.href = 'sign_in.html'; }

  function requireAuth() {
    if (!getToken() || isExpired()) {
      clearSession();
      location.href = 'sign_in.html';
      return false;
    }
    return true;
  }

  function hasRole(...roles) {
    const u = getUser();
    return !!u && roles.includes(u.role);
  }

  // Core request helper. Returns parsed JSON (or null for 204). Throws {status, message} on failure.
  async function request(method, path, body, isForm) {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    let payload = body;
    if (body !== undefined && body !== null && !isForm) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    const res = await fetch('/api/' + path, { method, headers, body: payload });

    if (res.status === 401) { clearSession(); location.href = 'sign_in.html'; throw { status: 401, message: 'Phiên đăng nhập đã hết hạn.' }; }

    if (!res.ok) {
      let message = res.status === 403 ? 'Bạn không có quyền thực hiện thao tác này.' : ('Lỗi ' + res.status);
      try { const err = await res.json(); if (err && err.message) message = err.message; } catch { /* ignore */ }
      throw { status: res.status, message };
    }

    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  const get = (p) => request('GET', p);
  const post = (p, b) => request('POST', p, b);
  const patch = (p, b) => request('PATCH', p, b);

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.status === 401) throw { status: 401, message: 'Email hoặc mật khẩu không đúng.' };
    if (!res.ok) throw { status: res.status, message: 'Đăng nhập thất bại (' + res.status + ').' };
    const auth = await res.json();
    setSession(auth);
    return auth;
  }

  const qs = (obj) => {
    const parts = Object.entries(obj || {})
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v));
    return parts.length ? '?' + parts.join('&') : '';
  };

  window.Api = {
    // session
    login, logout, requireAuth, getToken, getUser, hasRole, isExpired,

    // shared
    getDepartments: () => get('departments'),
    getPatients: () => get('patientprofiles'),

    // F1 - beds & admissions
    getBedMap: (departmentId) => get('beds/map' + qs({ departmentId })),
    getBeds: () => get('beds'),
    getAdmissions: () => get('inpatientadmissions'),
    getBedAssignments: (admissionId) => get('inpatientadmissions/' + admissionId + '/bed-assignments'),
    admit: (dto) => post('inpatientadmissions/admit', dto),
    transfer: (admissionId, dto) => post('inpatientadmissions/' + admissionId + '/transfer', dto),
    releaseBed: (assignmentId) => patch('bedassignments/' + assignmentId + '/release'),

    // F2 - vitals & care orders
    getVitalSigns: (admissionId, date) => get('inpatientadmissions/' + admissionId + '/vital-signs' + qs({ date })),
    createVitalSign: (dto) => post('vitalsigns', dto),
    getCareOrders: (admissionId, opts) => get('inpatientadmissions/' + admissionId + '/care-orders' + qs(opts)),
    createCareOrder: (dto) => post('careorders', dto),
    completeCareOrder: (id) => patch('careorders/' + id + '/complete'),

    // F3 - lab orders & results
    filterLabOrders: (opts) => get('laborders/filter' + qs(opts)),
    updateLabOrderStatus: (id, status) => patch('laborders/' + id + '/status', { status }),
    enterLabResult: (id, resultText) => post('laborders/' + id + '/result', { resultText }),
    getLabResults: (id) => get('laborders/' + id + '/result'),
    createLabResult: (dto) => post('labresults', dto),
    uploadLabFile: (resultId, file) => {
      const fd = new FormData();
      fd.append('file', file);
      return request('POST', 'labresults/' + resultId + '/file', fd, true);
    },

    // F4 - discharge & billing
    dischargeAdmission: (id, dto) => post('inpatientadmissions/' + id + '/discharge', dto),
    getInvoiceItems: (invoiceId) => get('billinginvoices/' + invoiceId + '/items')
  };

  // Small shared toast helper for pages.
  window.toast = function (message, kind) {
    let box = document.getElementById('sc-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'sc-toast';
      box.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(box);
    }
    const el = document.createElement('div');
    const bg = kind === 'error' ? '#ba1a1a' : (kind === 'success' ? '#006e33' : '#00478d');
    el.style.cssText = 'background:' + bg + ';color:#fff;padding:10px 16px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.2);font:500 14px Inter,sans-serif;max-width:360px;';
    el.textContent = message;
    box.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  };
})();
