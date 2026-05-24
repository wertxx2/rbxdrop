/* ════════════════════════════════════════════════════
   RBXDROP — Merged Script (main + login/auth)
   ════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   PARTICLES (login page)
───────────────────────────────────────── */
(function() {
  const c = document.getElementById('particles');
  if (!c) return;
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

/* ─────────────────────────────────────────
   LOGIN TAB / VIEW SWITCH
───────────────────────────────────────── */
function switchTab(tab) {
  const tL = document.getElementById('tabLogin');
  const tR = document.getElementById('tabRegister');
  const vL = document.getElementById('viewLogin');
  const vR = document.getElementById('viewRegister');
  const vRec = document.getElementById('viewRecovery');
  const tabs = document.getElementById('tabs');
  if (!tL) return;
  tL.classList.toggle('active', tab === 'login');
  tR.classList.toggle('active', tab === 'register');
  vL.classList.toggle('active', tab === 'login');
  vR.classList.toggle('active', tab === 'register');
  vRec.classList.remove('active');
  tabs.style.display = 'flex';
}

function switchView(view) {
  const vL = document.getElementById('viewLogin');
  const vR = document.getElementById('viewRegister');
  const vRec = document.getElementById('viewRecovery');
  const tabs = document.getElementById('tabs');
  if (!vL) return;
  vL.classList.toggle('active', view === 'login');
  vR.classList.toggle('active', view === 'register');
  vRec.classList.toggle('active', view === 'recovery');
  tabs.style.display = view === 'recovery' ? 'none' : 'flex';
  if (view === 'login') {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
  }
}

/* ─────────────────────────────────────────
   PASSWORD TOGGLES (login page)
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   TERMS CHECKBOX
───────────────────────────────────────── */
let termsAccepted = false;
function toggleTerms() {
  termsAccepted = !termsAccepted;
  const cb = document.getElementById('termsCheck');
  if (cb) cb.classList.toggle('checked', termsAccepted);
}

/* ─────────────────────────────────────────
   PASSWORD STRENGTH
───────────────────────────────────────── */
const strengthColors = ['#f87171', '#fb923c', '#facc15', '#1FD89A'];
const strengthLabels = ['Слабый', 'Средний', 'Хороший', 'Сильный'];

(function() {
  const regPw = document.getElementById('regPassword');
  if (!regPw) return;
  regPw.addEventListener('input', function() {
    const v = this.value;
    const bar = document.getElementById('strengthBar');
    const label = document.getElementById('strengthLabel');
    if (!v) { bar.classList.remove('show'); label.classList.remove('show'); return; }
    bar.classList.add('show');
    label.classList.add('show');
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^a-zA-Z0-9]/.test(v)) score++;
    score = Math.max(1, score);
    ['s1','s2','s3','s4'].forEach((id, i) => {
      document.getElementById(id).style.background = i < score ? strengthColors[score-1] : 'var(--border2)';
    });
    label.textContent = strengthLabels[score-1];
    label.style.color = strengthColors[score-1];
  });
})();

/* ─────────────────────────────────────────
   RECOVERY TOKEN AUTO-FORMAT
───────────────────────────────────────── */
(function() {
  const rt = document.getElementById('recoveryToken');
  if (!rt) return;
  rt.addEventListener('input', function() {
    let v = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let out = '';
    for (let i = 0; i < v.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) out += '-';
      out += v[i];
    }
    this.value = out;
  });
})();

/* ─────────────────────────────────────────
   LOGIN FORM HELPERS
───────────────────────────────────────── */
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
  const tabs = document.querySelector('.tabs');
  if (tabs) tabs.style.display = 'none';
  ['viewLogin','viewRegister','viewRecovery'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  document.getElementById('successTitle').textContent = title;
  document.getElementById('successText').textContent = text;
  document.getElementById('successScreen').classList.add('show');
}

/* ─────────────────────────────────────────
   LOGIN FORM HANDLERS
───────────────────────────────────────── */
function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  let ok = true;
  if (!email || !isEmail(email)) { setHint('loginEmailHint','Введи корректный email','err'); ok=false; }
  else setHint('loginEmailHint','','');
  if (!pass || pass.length < 6) { setHint('loginPassHint','Минимум 6 символов','err'); ok=false; }
  else setHint('loginPassHint','','');
  if (!ok) return;
  showSuccess('Добро пожаловать!', 'Входим в аккаунт...');
}

function handleRegister() {
  const un   = document.getElementById('regUsername').value.trim();
  const email= document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;
  const conf = document.getElementById('regPasswordConfirm').value;
  let ok = true;
  if (!un || un.length < 3) { setHint('regUsernameHint','Минимум 3 символа','err'); ok=false; }
  else if (!/^[a-zA-Z0-9_]+$/.test(un)) { setHint('regUsernameHint','Только латиница, цифры и _','err'); ok=false; }
  else setHint('regUsernameHint','✓ Отличный никнейм','');
  if (!email || !isEmail(email)) { setHint('regEmailHint','Введи корректный email','err'); ok=false; }
  else setHint('regEmailHint','✓ Email выглядит верно','');
  if (!pass || pass.length < 8) { setHint('regPassHint','Минимум 8 символов','err'); ok=false; }
  else setHint('regPassHint','','');
  if (pass !== conf) { setHint('regPassConfirmHint','Пароли не совпадают','err'); ok=false; }
  else if (conf) setHint('regPassConfirmHint','✓ Пароли совпадают','');
  if (!termsAccepted) { alert('Прими условия использования'); ok=false; }
  if (!ok) return;
  showSuccess('Аккаунт создан! 🎉', 'Добро пожаловать в RBXDROP. Перенаправляем...');
}

function handleRecovery() {
  const token = document.getElementById('recoveryToken').value.trim();
  if (!token || token.length < 19) { setHint('recoveryHint','Введи полный токен восстановления','err'); return; }
  setHint('recoveryHint','✓ Токен принят','');
  showSuccess('Доступ восстановлен 🔑', 'Токен действителен. Перенаправляем...');
}

/* ─────────────────────────────────────────
   LOGIN ENTER KEY
───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const vL   = document.getElementById('viewLogin');
  const vR   = document.getElementById('viewRegister');
  const vRec = document.getElementById('viewRecovery');
  if (vL   && vL.classList.contains('active'))   { handleLogin(); return; }
  if (vR   && vR.classList.contains('active'))   { handleRegister(); return; }
  if (vRec && vRec.classList.contains('active')) { handleRecovery(); return; }
});

/* ════════════════════════════════════════════════════
   MAIN PAGE SCRIPTS (index.html)
   ════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   DEVICE DETECTION
───────────────────────────────────────── */
const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

/* ─────────────────────────────────────────
   CURSOR (desktop only)
───────────────────────────────────────── */
const curDot  = document.getElementById('curDot');
const curRing = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (curDot && curRing && !isMobile()) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.left = mx + 'px';
    curDot.style.top  = my + 'px';
  });
  function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    curRing.style.left = rx + 'px';
    curRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
    const sections = ['order','how','reviews','faq'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href')?.replace('#','');
      a.style.color = href === current ? 'var(--text)' : '';
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────
   MOBILE BURGER
───────────────────────────────────────── */
const burgerBtn = document.getElementById('burgerBtn');
const mobMenu   = document.getElementById('mobMenu');
if (burgerBtn && mobMenu) {
  burgerBtn.addEventListener('click', () => {
    const open = mobMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', () => {
      mobMenu.classList.remove('open');
      burgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─────────────────────────────────────────
   MODAL
───────────────────────────────────────── */
const modal  = document.getElementById('modal');
const mIco   = document.getElementById('mIco');
const mTitle = document.getElementById('mTitle');
const mText  = document.getElementById('mText');
const mCode  = document.getElementById('mCode');

function showModal(o) {
  if (!modal) return;
  mIco.textContent  = o.icon || '✅';
  mIco.className    = 'm-ico' + (o.err ? ' merr' : o.warn ? ' mwarn' : '');
  mTitle.textContent= o.title;
  mText.textContent = o.text || '';
  const mCopy = document.getElementById('mCopy');
  if (o.code) {
    mCode.textContent = o.code; mCode.classList.add('show');
    if (mCopy) mCopy.classList.add('show');
  } else {
    mCode.textContent = ''; mCode.classList.remove('show');
    if (mCopy) mCopy.classList.remove('show');
  }
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

(function() {
  const mClose = document.getElementById('mClose');
  if (mClose) mClose.addEventListener('click', closeModal);
  const mCopyBtn = document.getElementById('mCopy');
  if (mCopyBtn) {
    mCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(mCode.textContent).then(() => {
        mCopyBtn.textContent = '✓ Скопировано';
        setTimeout(() => { mCopyBtn.textContent = 'Копировать'; }, 2000);
      });
    });
  }
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
})();

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function toast(msg, dur = 2200) {
  const tc = document.getElementById('toasts');
  if (!tc) return;
  const t = document.createElement('div');
  t.className   = 'toast';
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), dur);
}

/* ─────────────────────────────────────────
   FORMAT
───────────────────────────────────────── */
function fmt(n) { return n.toLocaleString('ru'); }

/* ─────────────────────────────────────────
   SLIDER STATE
───────────────────────────────────────── */
const slider    = document.getElementById('robuxSlider');
const slFill    = document.getElementById('slFill');
const abBig     = document.getElementById('abBig');
const abRub     = document.getElementById('abRub');
const osRbx     = document.getElementById('osRbx');
const osTotal   = document.getElementById('osTotal');
const heroCount = document.getElementById('heroCount');
const heroBar   = document.getElementById('heroBar');
const heroSub   = document.getElementById('heroSub');
const stickyRbx   = document.getElementById('stickyRbx');
const stickyPrice = document.getElementById('stickyPrice');

let activeRate = 1;
let activeMethodName = 'Трансфер';
let prevVal = 0;

function updateAll() {
  if (!slider) return;
  const v   = parseInt(slider.value);
  const pct = ((v - 100) / (10000 - 100)) * 100;
  if (slFill) slFill.style.width = pct + '%';
  if (v !== prevVal) {
    if (abBig) { abBig.textContent = fmt(v); abBig.classList.add('pop'); setTimeout(() => abBig.classList.remove('pop'), 160); }
    prevVal = v;
  }
  const rub = Math.round(v * activeRate);
  if (abRub)      abRub.textContent   = fmt(rub) + ' ₽';
  if (osRbx)      osRbx.textContent   = fmt(v)   + ' R$';
  if (osTotal)    osTotal.textContent = fmt(rub) + ' ₽';
  if (heroCount)  heroCount.textContent = fmt(v);
  if (heroSub)    heroSub.textContent   = 'Robux · ' + activeMethodName;
  if (heroBar)    heroBar.style.width   = (pct * 0.8 + 10) + '%';
  if (stickyRbx)  stickyRbx.textContent  = fmt(v)   + ' R$';
  if (stickyPrice) stickyPrice.textContent= fmt(rub) + ' ₽';
  document.querySelectorAll('.pre').forEach(b =>
    b.classList.toggle('pa', parseInt(b.dataset.v) === v)
  );
}

if (slider) { slider.addEventListener('input', updateAll); updateAll(); }

/* ─────────────────────────────────────────
   PRESETS
───────────────────────────────────────── */
document.querySelectorAll('.pre').forEach(b => {
  b.addEventListener('click', () => {
    if (!slider) return;
    slider.value = b.dataset.v;
    updateAll();
    toast('✓ ' + fmt(parseInt(b.dataset.v)) + ' R$');
  });
});

/* ─────────────────────────────────────────
   METHOD CARDS
───────────────────────────────────────── */
document.querySelectorAll('.mcard').forEach(c => {
  c.addEventListener('click', () => {
    if (c.dataset.available !== 'true') {
      showModal({ icon:'⏳', title:'Скоро появится', text:`«${c.dataset.name}» пока недоступен. Используй Трансфер — уже работает!`, warn:true });
      return;
    }
    document.querySelectorAll('.mcard').forEach(x => x.classList.remove('mactive'));
    c.classList.add('mactive');
    activeRate       = parseFloat(c.dataset.rate) || 1;
    activeMethodName = c.querySelector('.mname').textContent;
    const osMeth = document.getElementById('osMeth');
    if (osMeth) osMeth.textContent = activeMethodName;
    updateAll();
    toast('✓ ' + activeMethodName);
  });
});

/* ─────────────────────────────────────────
   NICK INPUTS
───────────────────────────────────────── */
function setupNickInput(inputId, clearId, hintId) {
  const input    = document.getElementById(inputId);
  const clearBtn = document.getElementById(clearId);
  const hint     = document.getElementById(hintId);
  if (!input) return;
  const heroNickDisp = document.getElementById('heroNickDisp');
  const heroAv       = document.getElementById('heroAv');

  function validate(v) {
    if (!v) { hint.textContent=''; hint.className='nick-hint'; input.classList.remove('valid'); return; }
    if (v.length < 3) { hint.textContent='Минимум 3 символа'; hint.className='nick-hint err'; input.classList.remove('valid'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(v)) { hint.textContent='Только латиница, цифры и _'; hint.className='nick-hint err'; input.classList.remove('valid'); return; }
    hint.textContent='✓ Ник выглядит верно'; hint.className='nick-hint'; input.classList.add('valid');
  }

  input.addEventListener('input', () => {
    const v = input.value.trim();
    if (clearBtn) clearBtn.classList.toggle('visible', v.length > 0);
    validate(v);
    const otherId = inputId === 'nickInput' ? 'nickInputMob' : 'nickInput';
    const other   = document.getElementById(otherId);
    if (other) other.value = input.value;
    if (heroNickDisp) heroNickDisp.textContent = v || '—';
    if (heroAv) heroAv.textContent = v ? v[0].toUpperCase() : '?';
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  }
}

setupNickInput('nickInput',    'nickClear',    'nickHint');
setupNickInput('nickInputMob', 'nickClearMob', 'nickHintMob');

function getNick() {
  const a = document.getElementById('nickInput');
  const b = document.getElementById('nickInputMob');
  return (a?.value || b?.value || '').trim();
}

/* ─────────────────────────────────────────
   ORDER SUBMIT
───────────────────────────────────────── */
function submitOrder() {
  const nick = getNick();
  if (!nick) {
    showModal({ icon:'⚠️', title:'Введи ник', text:'Укажи ник своего Roblox аккаунта для оформления заказа.', warn:true });
    (document.getElementById('nickInputMob') || document.getElementById('nickInput'))?.focus();
    return;
  }
  if (nick.length < 3) { showModal({ icon:'⚠️', title:'Слишком короткий ник', text:'Ник должен содержать минимум 3 символа.', err:true }); return; }
  if (!/^[a-zA-Z0-9_]+$/.test(nick)) { showModal({ icon:'⚠️', title:'Неверный формат ника', text:'Ник может содержать только латинские буквы, цифры и символ _', err:true }); return; }

  const v   = slider ? parseInt(slider.value) : 0;
  const rub = Math.round(v * activeRate);
  showModal({
    icon: '🎉',
    title: 'Заказ принят!',
    text: 'Наш менеджер свяжется с тобой в Telegram и пришлёт ссылку на Game Pass для оплаты.',
    code: `Аккаунт:  ${nick}\nСумма:    ${fmt(v)} R$\nК оплате: ${fmt(rub)} ₽\nСпособ:   ${activeMethodName}\n\nТелеграм: @RbxShop_Manager`
  });
}

(function() {
  const ob = document.getElementById('orderBtn');
  if (ob) ob.addEventListener('click', submitOrder);
  const sob = document.getElementById('stickyOrderBtn');
  if (sob) sob.addEventListener('click', submitOrder);
  const obm = document.getElementById('orderBtnMob');
  if (obm) obm.addEventListener('click', submitOrder);
})();

/* ─────────────────────────────────────────
   NAV BUTTONS
───────────────────────────────────────── */
(function() {
  const navHome = document.getElementById('navHome');
  if (navHome) navHome.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' }); });

  function openSupport() {
    showModal({ icon:'💬', title:'Поддержка 24/7', text:'Пиши нам в Telegram — ответим быстро:\n\n@RbxShop_Manager\n@palofsc\n\nСреднее время ответа — 5 минут.' });
  }
  const navSupport = document.getElementById('navSupport');
  if (navSupport) navSupport.addEventListener('click', openSupport);
  const mobSupport = document.getElementById('mobSupport');
  if (mobSupport) mobSupport.addEventListener('click', openSupport);

  const heroBuyBtn = document.getElementById('heroBuyBtn');
  if (heroBuyBtn) heroBuyBtn.addEventListener('click', () => { document.getElementById('order').scrollIntoView({ behavior:'smooth' }); });
  const heroHowBtn = document.getElementById('heroHowBtn');
  if (heroHowBtn) heroHowBtn.addEventListener('click', () => { document.getElementById('how').scrollIntoView({ behavior:'smooth' }); });
  const bannerBuyBtn = document.getElementById('bannerBuyBtn');
  if (bannerBuyBtn) bannerBuyBtn.addEventListener('click', () => { document.getElementById('order').scrollIntoView({ behavior:'smooth' }); });
})();

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
(function() {
  const revEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold:.12 });
  revEls.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────
   STICKY BAR
───────────────────────────────────────── */
(function() {
  const stickyBar    = document.getElementById('stickyBar');
  const orderSection = document.getElementById('order');
  if (stickyBar && orderSection) {
    const stickyObs = new IntersectionObserver(entries => {
      const inView = entries[0].isIntersecting;
      stickyBar.style.transform  = inView ? 'translateY(0)' : 'translateY(100%)';
      stickyBar.style.transition = 'transform .3s ease';
    }, { threshold:.05 });
    stickyObs.observe(orderSection);
  }
})();
