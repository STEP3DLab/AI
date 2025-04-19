document.addEventListener('DOMContentLoaded', () => {
  // Countdown
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
    days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds'
  });

  // Burger menu
  const burger = document.querySelector('.burger');
  const nav    = document.querySelector('.nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav--open');
  });

  // Smooth scroll
  document.querySelectorAll('.nav__list a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tgt = document.querySelector(link.getAttribute('href'));
      const offset = nav.offsetHeight;
      window.scrollTo({
        top: tgt.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
      if (nav.classList.contains('nav--open')) burger.click();
    });
  });

  // AJAX‑form
  const form   = document.getElementById('registration-form');
  const btn    = form.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  const URL    = 'https://script.google.com/macros/s/AKfycbwgAUEz5PIkSGFtu28LNZB9J7L5nF7AGHfkesGPrRz4Iju-G0upbBYPuzwm4rT7N1YUyw/exec';

  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    status.style.color = 'var(--text)';
    status.textContent = 'Отправка…';

    fetch(URL, {
      method: 'POST',
      mode:   'cors',
      body:   new FormData(form)
    })
    .then(r => r.json())
    .then(d => {
      if (d.result === 'success') {
        const params = new URLSearchParams({
          name:  form.name.value,
          email: form.email.value
        });
        window.location.href = `thankyou.html?${params.toString()}`;
      } else {
        throw new Error(d.message || 'Ошибка сервера');
      }
    })
    .catch(err => {
      console.error(err);
      status.style.color = 'var(--error)';
      status.textContent = 'Ошибка отправки. Попробуйте позже.';
    })
    .finally(() => btn.disabled = false);
  });
});
