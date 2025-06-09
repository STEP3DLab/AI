// RU: URL веб-приложения Apps Script
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwaj2ykBqQ3vRHPktKr_YBEoVkeJ7cTX5kG-HzZ7sV7JBmY0SFM1w1peCzEER0asT7H/exec'; // замените на URL деплоя

const offlineLeftEl = document.getElementById('offline-left');
const onlineLeftEl = document.getElementById('online-left');
const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('reg-form');
const spinner = document.getElementById('spinner');
const messageEl = document.getElementById('message');
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.querySelector(".back-to-top");
const progressBar = document.getElementById('progress');
const countdownEl = document.getElementById('countdown');

function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Светлая тема' : 'Темная тема');
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
progressBar.style.width = '0%';
function formatDate() {
    const date = new Date('2025-06-11T19:00:00+03:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    document.getElementById('event-date').innerHTML =
        `${new Intl.DateTimeFormat('ru-RU', options).format(date)},<br>` +
        `${new Intl.DateTimeFormat('ru-RU', timeOptions).format(date)}–20:30 МСК`;
}

async function updateSeats() {
    try {
        const resp = await fetch(`${WEB_APP_URL}?action=count`);
        const data = await resp.json();
        offlineLeftEl.textContent = (data.offline>0?data.offline:"нет");
        onlineLeftEl.textContent = (data.online>0?data.online:"нет");
        if (data.offline <= 0) form.querySelector('input[value="offline"]').disabled = true;
        if (data.online <= 0) form.querySelector('input[value="online"]').disabled = true;
    } catch (e) {
        console.error('Не удалось получить данные мест', e);
    }
}

function showMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.className = isError ? 'error' : 'success';
    messageEl.hidden = false;
    messageEl.classList.add('visible');
    setTimeout(() => {
        messageEl.classList.remove('visible');
        messageEl.hidden = true;
    }, 4000);
}

messageEl.addEventListener('click', () => {
    messageEl.classList.remove('visible');
    messageEl.hidden = true;
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    spinner.hidden = false;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
        const resp = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const res = await resp.json();
        if (res.status === 'ok') {
            showMessage('Успешно! Инструкция отправлена на почту');
            form.reset();
            ['name','email','phone','mode'].forEach(k => localStorage.removeItem(k));
            updateSeats();
        } else {
            showMessage('Ошибка: ' + res.message, true);
        }
    } catch (err) {
        showMessage('Ошибка отправки', true);
    } finally {
        submitBtn.disabled = false;
        spinner.hidden = true;
    }
});

formatDate();
updateSeats();
themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.classList.add('active');
    setTimeout(() => themeToggle.classList.remove('active'), 600);
});
window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 100);
    const progress = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    const percent = Math.round(progress * 100);
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
});
backToTop.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({top:0, behavior:"smooth"});
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {threshold: 0.1});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

restoreForm();
setInterval(updateCountdown, 1000);
updateCountdown();

function updateCountdown() {
    const eventDate = new Date('2025-06-11T19:00:00+03:00');
    const diff = eventDate - new Date();
    if (diff <= 0) { countdownEl.textContent = 'Событие началось'; return; }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor(diff / (1000*60*60) % 24);
    const m = Math.floor(diff / (1000*60) % 60);
    const s = Math.floor(diff / 1000 % 60);
    countdownEl.textContent = `${d}д ${h}ч ${m}м ${s}с`;
}

function restoreForm() {
    ['name','email','phone','mode'].forEach(id => {
        const val = localStorage.getItem(id);
        if (val) {
            const el = form.querySelector(`[name="${id}"]`);
            if (el.type === 'radio') {
                form.querySelector(`[value="${val}"]`).checked = true;
            } else {
                el.value = val;
            }
        }
    });
}

form.addEventListener('input', e => {
    if (e.target.name) {
        localStorage.setItem(e.target.name, e.target.value);
    }
});

