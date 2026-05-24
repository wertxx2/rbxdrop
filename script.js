/* ── DEVICE DETECTION ── */
const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

/* ── CURSOR (desktop only) ── */
const curDot = document.getElementById('curDot');
const curRing = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (!isMobile()) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.left = mx + 'px';
    curDot.style.top = my + 'px';
  });
  function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    curRing.style.left = rx + 'px';
    curRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();
}

/* ── NAV ── */
const mainNav = document.getElementById('mainNav');
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

/* ── MOBILE BURGER ── */
const burgerBtn = document.getElementById('burgerBtn');
const mobMenu = document.getElementById('mobMenu');
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

/* ── MODAL ── */
const modal = document.getElementById('modal');
const mIco = document.getElementById('mIco');
const mTitle = document.getElementById('mTitle');
const mText = document.getElementById('mText');
const mCode = document.getElementById('mCode');

function showModal(o) {
  mIco.textContent = o.icon || '✅';
  mIco.className = 'm-ico' + (o.err ? ' merr' : o.warn ? ' mwarn' : '');
  mTitle.textContent = o.title;
  mText.textContent = o.text || '';
  const mCopy = document.getElementById('mCopy');
  if (o.code) {
    mCode.textContent = o.code;
    mCode.classList.add('show');
    if (mCopy) mCopy.classList.add('show');
  } else {
    mCode.textContent = '';
    mCode.classList.remove('show');
    if (mCopy) mCopy.classList.remove('show');
  }
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('mClose').addEventListener('click', closeModal);
const mCopyBtn = document.getElementById('mCopy');
if (mCopyBtn) {
  mCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(mCode.textContent).then(() => {
      mCopyBtn.textContent = '✓ Скопировано';
      setTimeout(() => { mCopyBtn.textContent = 'Копировать'; }, 2000);
    });
  });
}
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); } });

/* ── TOAST ── */
function toast(msg, dur = 2200) {
  const tc = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), dur);
}

/* ── FORMAT ── */
function fmt(n) { return n.toLocaleString('ru'); }

/* ── SLIDER STATE ── */
const slider = document.getElementById('robuxSlider');
const slFill = document.getElementById('slFill');
const abBig = document.getElementById('abBig');
const abRub = document.getElementById('abRub');
const osRbx = document.getElementById('osRbx');
const osTotal = document.getElementById('osTotal');
const heroCount = document.getElementById('heroCount');
const heroBar = document.getElementById('heroBar');
const heroSub = document.getElementById('heroSub');
const stickyRbx = document.getElementById('stickyRbx');
const stickyPrice = document.getElementById('stickyPrice');

let activeRate = 1;
let activeMethodName = 'Трансфер';
let prevVal = 0;

function updateAll() {
  const v = parseInt(slider.value);
  const pct = ((v - 100) / (10000 - 100)) * 100;
  slFill.style.width = pct + '%';
  if (v !== prevVal) {
    abBig.textContent = fmt(v);
    abBig.classList.add('pop');
    setTimeout(() => abBig.classList.remove('pop'), 160);
    prevVal = v;
  }
  const rub = Math.round(v * activeRate);
  abRub.textContent = fmt(rub) + ' ₽';
  osRbx.textContent = fmt(v) + ' R$';
  osTotal.textContent = fmt(rub) + ' ₽';
  heroCount.textContent = fmt(v);
  heroSub.textContent = 'Robux · ' + activeMethodName;
  heroBar.style.width = (pct * 0.8 + 10) + '%';
  if (stickyRbx) stickyRbx.textContent = fmt(v) + ' R$';
  if (stickyPrice) stickyPrice.textContent = fmt(rub) + ' ₽';
  document.querySelectorAll('.pre').forEach(b =>
    b.classList.toggle('pa', parseInt(b.dataset.v) === v)
  );
}
slider.addEventListener('input', updateAll);
updateAll();

/* ── PRESETS ── */
document.querySelectorAll('.pre').forEach(b => {
  b.addEventListener('click', () => {
    slider.value = b.dataset.v;
    updateAll();
    toast('✓ ' + fmt(parseInt(b.dataset.v)) + ' R$');
  });
});

/* ── METHOD CARDS ── */
document.querySelectorAll('.mcard').forEach(c => {
  c.addEventListener('click', () => {
    if (c.dataset.available !== 'true') {
      showModal({ icon:'⏳', title:'Скоро появится', text:`«${c.dataset.name}» пока недоступен. Используй Трансфер — уже работает!`, warn:true });
      return;
    }
    document.querySelectorAll('.mcard').forEach(x => x.classList.remove('mactive'));
    c.classList.add('mactive');
    activeRate = parseFloat(c.dataset.rate) || 1;
    activeMethodName = c.querySelector('.mname').textContent;
    document.getElementById('osMeth').textContent = activeMethodName;
    updateAll();
    toast('✓ ' + activeMethodName);
  });
});

/* ── NICK INPUTS ── */
function setupNickInput(inputId, clearId, hintId) {
  const input = document.getElementById(inputId);
  const clearBtn = document.getElementById(clearId);
  const hint = document.getElementById(hintId);
  if (!input) return;
  const heroNickDisp = document.getElementById('heroNickDisp');
  const heroAv = document.getElementById('heroAv');

  function validate(v) {
    if (!v) { hint.textContent=''; hint.className='nick-hint'; input.classList.remove('valid'); return; }
    if (v.length < 3) { hint.textContent='Минимум 3 символа'; hint.className='nick-hint err'; input.classList.remove('valid'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(v)) { hint.textContent='Только латиница, цифры и _'; hint.className='nick-hint err'; input.classList.remove('valid'); return; }
    hint.textContent='✓ Ник выглядит верно'; hint.className='nick-hint'; input.classList.add('valid');
  }

  input.addEventListener('input', () => {
    const v = input.value.trim();
    clearBtn.classList.toggle('visible', v.length > 0);
    validate(v);
    const otherId = inputId === 'nickInput' ? 'nickInputMob' : 'nickInput';
    const other = document.getElementById(otherId);
    if (other) other.value = input.value;
    if (heroNickDisp) heroNickDisp.textContent = v || '—';
    if (heroAv) heroAv.textContent = v ? v[0].toUpperCase() : '?';
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.focus();
  });
}

setupNickInput('nickInput', 'nickClear', 'nickHint');
setupNickInput('nickInputMob', 'nickClearMob', 'nickHintMob');

function getNick() {
  const a = document.getElementById('nickInput');
  const b = document.getElementById('nickInputMob');
  return (a?.value || b?.value || '').trim();
}

/* ── ORDER SUBMIT ── */
function submitOrder() {
  const nick = getNick();
  if (!nick) {
    showModal({ icon:'⚠️', title:'Введи ник', text:'Укажи ник своего Roblox аккаунта для оформления заказа.', warn:true });
    (document.getElementById('nickInputMob') || document.getElementById('nickInput'))?.focus();
    return;
  }
  if (nick.length < 3) {
    showModal({ icon:'⚠️', title:'Слишком короткий ник', text:'Ник должен содержать минимум 3 символа.', err:true });
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(nick)) {
    showModal({ icon:'⚠️', title:'Неверный формат ника', text:'Ник может содержать только латинские буквы, цифры и символ _', err:true });
    return;
  }

  const v = parseInt(slider.value);
  const rub = Math.round(v * activeRate);

  showModal({
    icon: '🎉',
    title: 'Заказ принят!',
    text: 'Наш менеджер свяжется с тобой в Telegram и пришлёт ссылку на Game Pass для оплаты.',
    code: `Аккаунт:  ${nick}\nСумма:    ${fmt(v)} R$\nК оплате: ${fmt(rub)} ₽\nСпособ:   ${activeMethodName}\n\nТелеграм: @RbxShop_Manager`
  });
}

document.getElementById('orderBtn').addEventListener('click', submitOrder);
const stickyOrderBtn = document.getElementById('stickyOrderBtn');
if (stickyOrderBtn) stickyOrderBtn.addEventListener('click', submitOrder);
const orderBtnMob = document.getElementById('orderBtnMob');
if (orderBtnMob) orderBtnMob.addEventListener('click', submitOrder);

/* ── NAV BUTTONS ── */
document.getElementById('navHome').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top:0, behavior:'smooth' });
});

function openSupport() {
  showModal({ icon:'💬', title:'Поддержка 24/7', text:'Пиши нам в Telegram — ответим быстро:\n\n@RbxShop_Manager\n@palofsc\n\nСреднее время ответа — 5 минут.' });
}
document.getElementById('navSupport').addEventListener('click', openSupport);
const mobSupport = document.getElementById('mobSupport');
if (mobSupport) mobSupport.addEventListener('click', openSupport);

document.getElementById('heroBuyBtn').addEventListener('click', () => {
  document.getElementById('order').scrollIntoView({ behavior:'smooth' });
});
document.getElementById('heroHowBtn').addEventListener('click', () => {
  document.getElementById('how').scrollIntoView({ behavior:'smooth' });
});
const bannerBuyBtn = document.getElementById('bannerBuyBtn');
if (bannerBuyBtn) bannerBuyBtn.addEventListener('click', () => {
  document.getElementById('order').scrollIntoView({ behavior:'smooth' });
});

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── SCROLL REVEAL ── */
const revEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
  });
}, { threshold:.12 });
revEls.forEach(el => obs.observe(el));

/* ── STICKY BAR ── */
const stickyBar = document.getElementById('stickyBar');
const orderSection = document.getElementById('order');
if (stickyBar && orderSection) {
  const stickyObs = new IntersectionObserver(entries => {
    const inView = entries[0].isIntersecting;
    stickyBar.style.transform = inView ? 'translateY(0)' : 'translateY(100%)';
    stickyBar.style.transition = 'transform .3s ease';
  }, { threshold:.05 });
  stickyObs.observe(orderSection);
}

/* ── INIT ── */
