/* ── PARTICLES ── */
(function() {
  const c = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random()*100}%;
      bottom: ${Math.random()*20}%;
      width: ${1 + Math.random()*2}px;
      height: ${1 + Math.random()*2}px;
      animation-duration: ${8 + Math.random()*12}s;
      animation-delay: ${Math.random()*10}s;
      opacity: ${.2 + Math.random()*.6};
      background: ${Math.random()>.5 ? 'rgba(255,155,47,.5)' : 'rgba(79,142,255,.4)'};
    `;
    c.appendChild(p);
  }
})();

/* ── TAB / VIEW SWITCH ── */
function switchTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('viewLogin').classList.toggle('active', tab === 'login');
  document.getElementById('viewRegister').classList.toggle('active', tab === 'register');
  document.getElementById('viewRecovery').classList.remove('active');
  document.getElementById('tabs').style.display = 'flex';
}

function switchView(view) {
  document.getElementById('viewLogin').classList.toggle('active', view === 'login');
  document.getElementById('viewRegister').classList.toggle('active', view === 'register');
  document.getElementById('viewRecovery').classList.toggle('active', view === 'recovery');
  document.getElementById('tabs').style.display = view === 'recovery' ? 'none' : 'flex';
  if (view === 'login') {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
  }
}

/* ── PASSWORD TOGGLES ── */
function setupToggle(toggleId, inputId) {
  const btn = document.getElementById(toggleId);
  const inp = document.getElementById(inputId);
  if (!btn || !inp) return;
  btn.addEventListener('click', () => {
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  });
}
setupToggle('loginPassToggle', 'loginPassword');
setupToggle('regPassToggle', 'regPassword');
setupToggle('regPassConfirmToggle', 'regPasswordConfirm');

/* ── TERMS CHECKBOX ── */
let termsAccepted = false;
function toggleTerms() {
  termsAccepted = !termsAccepted;
  document.getElementById('termsCheck').classList.toggle('checked', termsAccepted);
}

/* ── PASSWORD STRENGTH ── */
const strengthColors = ['#f87171', '#fb923c', '#facc15', '#1FD89A'];
const strengthLabels = ['Слабый', 'Средний', 'Хороший', 'Сильный'];

document.getElementById('regPassword').addEventListener('input', function() {
  const v = this.value;
  const bar = document.getElementById('strengthBar');
  const label = document.getElementById('strengthLabel');
  if (!v) {
    bar.classList.remove('show');
    label.classList.remove('show');
    return;
  }
  bar.classList.add('show');
  label.classList.add('show');
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^a-zA-Z0-9]/.test(v)) score++;
  score = Math.max(1, score);
  ['s1', 's2', 's3', 's4'].forEach((id, i) => {
    document.getElementById(id).style.background = i < score ? strengthColors[score - 1] : 'var(--border2)';
  });
  label.textContent = strengthLabels[score - 1];
  label.style.color = strengthColors[score - 1];
});

/* ── RECOVERY TOKEN AUTO-FORMAT ── */
document.getElementById('recoveryToken').addEventListener('input', function() {
  let v = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let out = '';
  for (let i = 0; i < v.length && i < 16; i++) {
    if (i > 0 && i % 4 === 0) out += '-';
    out += v[i];
  }
  this.value = out;
});

/* ── HELPERS ── */
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function setHint(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'form-hint' + (type === 'err' ? ' err' : '');
}

function showSuccess(title, text) {
  document.querySelector('.tabs').style.display = 'none';
  ['viewLogin', 'viewRegister', 'viewRecovery'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  document.getElementById('successTitle').textContent = title;
  document.getElementById('successText').textContent = text;
  document.getElementById('successScreen').classList.add('show');
}

/* ── FORM HANDLERS ── */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  let ok = true;
  if (!email || !isEmail(email)) {
    setHint('loginEmailHint', 'Введи корректный email', 'err'); ok = false;
  } else {
    setHint('loginEmailHint', '', '');
  }
  if (!pass || pass.length < 6) {
    setHint('loginPassHint', 'Минимум 6 символов', 'err'); ok = false;
  } else {
    setHint('loginPassHint', '', '');
  }
  if (!ok) return;
  showSuccess('Добро пожаловать!', 'Входим в аккаунт...');
}

function handleRegister() {
  const un = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;
  const conf = document.getElementById('regPasswordConfirm').value;
  let ok = true;
  if (!un || un.length < 3) {
    setHint('regUsernameHint', 'Минимум 3 символа', 'err'); ok = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(un)) {
    setHint('regUsernameHint', 'Только латиница, цифры и _', 'err'); ok = false;
  } else {
    setHint('regUsernameHint', '✓ Отличный никнейм', '');
  }
  if (!email || !isEmail(email)) {
    setHint('regEmailHint', 'Введи корректный email', 'err'); ok = false;
  } else {
    setHint('regEmailHint', '✓ Email выглядит верно', '');
  }
  if (!pass || pass.length < 8) {
    setHint('regPassHint', 'Минимум 8 символов', 'err'); ok = false;
  } else {
    setHint('regPassHint', '', '');
  }
  if (pass !== conf) {
    setHint('regPassConfirmHint', 'Пароли не совпадают', 'err'); ok = false;
  } else if (conf) {
    setHint('regPassConfirmHint', '✓ Пароли совпадают', '');
  }
  if (!termsAccepted) {
    alert('Прими условия использования'); ok = false;
  }
  if (!ok) return;
  showSuccess('Аккаунт создан! 🎉', 'Добро пожаловать в RBXDROP. Перенаправляем...');
}

function handleRecovery() {
  const token = document.getElementById('recoveryToken').value.trim();
  if (!token || token.length < 19) {
    setHint('recoveryHint', 'Введи полный токен восстановления', 'err');
    return;
  }
  setHint('recoveryHint', '✓ Токен принят', '');
  showSuccess('Доступ восстановлен 🔑', 'Токен действителен. Перенаправляем...');
}

/* ── ENTER KEY ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('viewLogin').classList.contains('active')) handleLogin();
  else if (document.getElementById('viewRegister').classList.contains('active')) handleRegister();
  else if (document.getElementById('viewRecovery').classList.contains('active')) handleRecovery();
});
