// Скрытие загрузчика после загрузки страницы
window.addEventListener('load', function () {
  const loader = document.getElementById('page-loader');
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 500);
});

// Переключение темы с сохранением в localStorage
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}
(function () {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
})();

// FAQ: плавное раскрытие/сжатие
function toggleFaq(item) {
  item.classList.toggle('open');
}

// Sticky header, Back-to-top и параллакс для баннера
window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  // Back-to-top кнопка
  document.querySelector('.back-to-top').style.display = window.scrollY > 300 ? 'block' : 'none';
  // Параллакс-эффект для баннера
  const banner = document.querySelector('.banner');
  if (banner) {
    banner.style.backgroundPositionY = -(window.scrollY * 0.3) + 'px';
  }
});

// Back-to-top функция
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Анимация появления секций при прокрутке (IntersectionObserver)
const sections = document.querySelectorAll('section');
const observerOptions = { threshold: 0.2 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, observerOptions);
sections.forEach(section => {
  sectionObserver.observe(section);
});

// Модальное окно для преподавателей
function openTeacherModal(name, info) {
  document.getElementById('teacher-modal-name').textContent = name;
  document.getElementById('teacher-modal-info').textContent = info;
  document.getElementById('teacher-modal').style.display = 'flex';
  document.getElementById('teacher-modal').setAttribute('aria-hidden', 'false');
}
function closeTeacherModal() {
  document.getElementById('teacher-modal').style.display = 'none';
  document.getElementById('teacher-modal').setAttribute('aria-hidden', 'true');
}
// Закрытие модального окна при клике вне его содержимого
window.addEventListener('click', function (e) {
  const modal = document.getElementById('teacher-modal');
  if (e.target === modal) {
    closeTeacherModal();
  }
});

// Ripple-эффект для кнопок
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    ripple.style.left = e.clientX - rect.left - (rect.width / 2) + 'px';
    ripple.style.top = e.clientY - rect.top - (rect.height / 2) + 'px';
    ripple.className = 'ripple';
    this.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});
