document.addEventListener('DOMContentLoaded', () => {
  // 1) Таймер
  const updateTimer = (end, ids) => {
    const t = setInterval(() => {
      const diff = end - Date.now();
      const d = Math.max(Math.floor(diff/86400000),0);
      const h = Math.max(Math.floor((diff%86400000)/3600000),0);
      const m = Math.max(Math.floor((diff%3600000)/60000),0);
      const s = Math.max(Math.floor((diff%60000)/1000),0);
      document.getElementById(ids.days).textContent    = d;
      document.getElementById(ids.hours).textContent   = h;
      document.getElementById(ids.minutes).textContent = m;
      document.getElementById(ids.seconds).textContent = s;
      if(diff<=0) clearInterval(t);
    },1000);
  };
  updateTimer(new Date('2025-04-29T19:00:00+03:00'), {
    days:'days', hours:'hours', minutes:'minutes', seconds:'seconds'
  });

  // 2) Меню
  const burger = document.querySelector('.burger');
  const nav    = document.querySelector('.nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav--open');
  });

  // 3) Плавный скролл
  document.querySelectorAll('.nav__list a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tgt    = document.querySelector(link.getAttribute('href'));
      const offset = nav.offsetHeight;
      window.scrollTo({
        top: tgt.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
      if(nav.classList.contains('nav--open')) burger.click();
    });
  });

  // 4) Форма
  const form   = document.getElementById('registration-form');
  const btn    = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgAUEz5PIkSGFtu28LNZB9J7L5nF7AGHfkesGPrRz4Iju-G0upbBYPuzwm4rT7N1YUyw/exec';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = '';
    form.querySelectorAll('.input-error').forEach(el => el.textContent = '');
    form.querySelectorAll('input').forEach(i => i.classList.remove('invalid'));

    if (!form.checkValidity()) {
      Array.from(form.elements).forEach(el => {
        if (el.tagName==='INPUT' && !el.checkValidity()) {
          el.classList.add('invalid');
          el.nextElementSibling.textContent = el.validationMessage;
        }
      });
      return;
    }

    btn.disabled = true;
    status.style.color = 'var(--text)';
    status.textContent   = 'Отправка…';

    try {
      const resp = await fetch(SCRIPT_URL, { method:'POST', mode:'cors', body:new FormData(form) });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (data.result==='success') {
        form.innerHTML = `
          <p style="color:green;font-weight:600;">
            Спасибо, <strong>${form.name.value}</strong>!<br>
            Подтверждение отправлено на <strong>${form.email.value}</strong>.
          </p>`;
      } else {
        throw new Error(data.message||'Ошибка сервера');
      }
    } catch (err) {
      console.error(err);
      status.style.color = 'var(--error)';
      status.textContent = `Ошибка отправки: ${err.message}`;
    } finally {
      btn.disabled = false;
    }
  });
});
