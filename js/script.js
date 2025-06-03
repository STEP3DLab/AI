// Inject noisy background сразу при загрузке <head>
(function() {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
      <filter id='n'>
        <feTurbulence baseFrequency='.8' numOctaves='4'/>
        <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .32 -.05'/>
      </filter>
      <rect width='64' height='64' filter='url(#n)'/>
    </svg>`;
  const noiseStyle = document.getElementById('noise-style');
  if (noiseStyle) {
    noiseStyle.textContent = `
      body { background: url(data:image/svg+xml;base64,${btoa(svg)}) repeat var(--bg); }
    `;
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // Автоматический выбор темы по системным настройкам
  const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (preferDark) html.setAttribute('data-theme', 'dark');

  // Плавное появление карточки
  const card = document.getElementById('main-card');
  if (card) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 }).observe(card);
  }

  // Прогресс-бар прокрутки и кнопка "Наверх"
  const prog = document.getElementById('scroll-progress');
  const topBtn = document.getElementById('top-btn');
  if (prog && topBtn) {
    window.addEventListener('scroll', () => {
      const d = document.documentElement;
      const scrollRatio = d.scrollTop / (d.scrollHeight - d.clientHeight);
      prog.style.transform = `scaleX(${scrollRatio})`;
      topBtn.classList.toggle('show', d.scrollTop > 400);
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Переключатель темы
  const themeBtn = document.getElementById('theme-switch');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'light' ? '🌙' : '☀️';
      const meta = document.getElementById('meta-theme');
      if (meta) {
        meta.setAttribute('content', next === 'light' ? '#ffffff' : '#000000');
      }
    });
  }

  // Плавный скролл к форме при клике на "Получать анонсы"
  const nlBtn = document.getElementById('nl-open');
  if (nlBtn) {
    nlBtn.addEventListener('click', () => {
      const form = document.getElementById('reg-form');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Простая валидация поля E-mail/телефон
  const regForm = document.getElementById('reg-form');
  if (regForm) {
    regForm.addEventListener('submit', event => {
      const input = regForm.querySelector('input[name="_replyto"]');
      if (!input) return;
      const value = input.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[\d+\-()\s]{5,20}$/;
      if (!emailPattern.test(value) && !phonePattern.test(value)) {
        event.preventDefault();
        alert('Введите валидный E-mail или телефон');
        input.focus();
      }
    });
  }

  // Раскрытие текста публичной оферты
  const offerLink = document.getElementById('offer-link');
  const offerText = document.getElementById('offer-text');
  if (offerLink && offerText) {
    offerLink.addEventListener('click', e => {
      e.preventDefault();
      offerText.style.display = (offerText.style.display === 'none' ? 'block' : 'none');
    });
  }
});
