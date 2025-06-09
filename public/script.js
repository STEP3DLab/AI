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
        offlineLeftEl.textContent = data.offline;
        onlineLeftEl.textContent = data.online;
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
    setTimeout(() => {
        messageEl.hidden = true;
    }, 4000);
}

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

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.body.classList.toggle("dark", savedTheme === "dark");
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark");
}
themeToggle.setAttribute("aria-pressed", document.body.classList.contains("dark"));

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.setAttribute("aria-pressed", isDark);
});

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 100);
});
backToTop.addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo({top:0, behavior:"smooth"});
});

