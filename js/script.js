// РџСЂРѕРіСЂРµСЃСЃ-Р±Р°СЂ Рё Р°РєС‚РёРІРЅС‹Р№ nav (СЃ aria-valuenow)
document.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  const bar = document.getElementById('progress-bar');
  bar.style.width = scrollPercent + '%';
  bar.setAttribute('aria-valuenow', Math.round(scrollPercent));

  // РљРЅРѕРїРєР° В«РќР°РІРµСЂС…В»
  const backBtn = document.getElementById('back-to-top');
  if (scrollTop > 300) backBtn.classList.add('show');
  else backBtn.classList.remove('show');

  // РђРєС‚РёРІРЅР°СЏ СЃСЃС‹Р»РєР°
  document.querySelectorAll('.nav-link').forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.2 && rect.bottom >= window.innerHeight * 0.2) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

// В«РќР°РІРµСЂС…В»
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Intersection Observer РґР»СЏ СЃРµРєС†РёР№
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section').forEach(s => observer.observe(s));
});

// РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ: РґРѕР±Р°РІР»СЏРµРј aria-hidden РЅР° main
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('modal-close');
const mainContent = document.querySelector('main');

openModalBtn.addEventListener('click', e => {
  e.preventDefault();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  mainContent.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'hidden';
  document.getElementById('name').focus();
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  mainContent.removeAttribute('aria-hidden');
  document.body.style.overflow = '';
  openModalBtn.focus();
}
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// РЎРѕС…СЂР°РЅРµРЅРёРµ С‚РµРјС‹ РІ localStorage
const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
  themeToggle.checked = true;
  document.documentElement.setAttribute('data-theme', 'dark');
}
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
});

// РћР±РЅРѕРІР»РµРЅРёРµ С‚Р°Р№РјРµСЂР° РѕР±СЂР°С‚РЅРѕРіРѕ РѕС‚СЃС‡С‘С‚Р°
function updateCountdown() {
  const eventDate = new Date('2025-07-15T11:00:00');
  const now = new Date();
  const diff = eventDate - now;
  const countdownTimer = document.getElementById('countdown-timer');
  if (diff <= 0) {
    countdownTimer.textContent = 'РЎРѕР±С‹С‚РёРµ РЅР°С‡Р°Р»РѕСЃСЊ!';
    openModalBtn.disabled = true;
    openModalBtn.textContent = 'Р РµРіРёСЃС‚СЂР°С†РёСЏ Р·Р°РєСЂС‹С‚Р°';
    clearInterval(countdownInterval);
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownTimer.textContent = `${days}Рґ ${hours}С‡ ${minutes}Рј ${seconds}СЃ`;
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Р“Р°РјР±СѓСЂРіРµСЂ-РјРµРЅСЋ
const hamburgerBtn = document.getElementById('hamburger');
const navigation = document.querySelector('nav.nav-links');
hamburgerBtn.addEventListener('click', () => {
  const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  navigation.classList.toggle('open');
});
document.querySelectorAll('nav.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navigation.classList.contains('open')) {
      navigation.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
