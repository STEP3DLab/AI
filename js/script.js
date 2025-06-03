// Прелоадер скрывается после загрузки
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
});

// Скролл–прогресс бар и активная ссылка в навигации
document.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) {
    bar.style.width = scrollPercent + '%';
    bar.setAttribute('aria-valuenow', Math.round(scrollPercent));
  }

  // Показ/скрытие кнопки "Наверх"
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    if (scrollTop > 300) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  }

  // Подсветка активного пункта меню
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const section = document.querySelector(href);
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

// Кнопка "Наверх"
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Появление секций через IntersectionObserver
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

// Модальное окно: открытие/закрытие и блокировка скролла
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('modal-close');
const mainContent = document.querySelector('main');

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (mainContent) mainContent.removeAttribute('aria-hidden');
  document.body.style.overflow = '';
  openModalBtn?.focus();
}

if (openModalBtn && modal) {
  openModalBtn.addEventListener('click', e => {
    e.preventDefault();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'hidden';
    document.getElementById('name')?.focus();
  });
}
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}
if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}

// Сохранение темы (data-theme="dark") в localStorage
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
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
}

// Валидация формы регистрации
const form = document.getElementById('regForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const errorName = document.getElementById('error-name');
const errorEmail = document.getElementById('error-email');
const errorPhone = document.getElementById('error-phone');
const thankYou = document.getElementById('thank-you');

function resetError(input, errorElem) {
  if (!input || !errorElem) return;
  input.addEventListener('input', () => {
    errorElem.classList.remove('active');
  });
}
resetError(nameInput, errorName);
resetError(emailInput, errorEmail);
resetError(phoneInput, errorPhone);

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    if (!nameInput.value.trim()) {
      errorName.classList.add('active');
      valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      errorEmail.classList.add('active');
      valid = false;
    }
    const phonePattern = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
      errorPhone.classList.add('active');
      valid = false;
    }
    if (!valid) return;
    if (thankYou) thankYou.style.display = 'block';
    form.reset();
    setTimeout(() => {
      if (thankYou) thankYou.style.display = 'none';
      closeModal();
    }, 3000);
  });
}

// Фильтр FAQ
const faqFilter = document.getElementById('faq-filter');
faqFilter?.addEventListener('input', () => {
  const query = faqFilter.value.trim().toLowerCase();
  document.querySelectorAll('.faq-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? '' : 'none';
  });
});
document.querySelectorAll('.faq-item').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) {
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== detail) other.open = false;
      });
    }
  });
});

// Обновление таймера обратного отсчёта
function updateCountdown() {
  const eventDate = new Date('2025-07-15T11:00:00');
  const now = new Date();
  const diff = eventDate - now;
  const countdownTimer = document.getElementById('countdown-timer');
  if (!countdownTimer) return;
  if (diff <= 0) {
    countdownTimer.textContent = 'Событие началось!';
    openModalBtn.disabled = true;
    openModalBtn.textContent = 'Регистрация закрыта';
    clearInterval(countdownInterval);
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownTimer.textContent = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
