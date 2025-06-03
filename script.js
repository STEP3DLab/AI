// ---------- script.js ----------

document.addEventListener("DOMContentLoaded", () => {
  const MAX_OFFLINE = 16;
  const MAX_ONLINE = 20;

  // Вставьте сюда URL вашего развернутого Google Apps Script (Web App)
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPDns031cBB_RQRiW1vPbcyi6U_99j66BWL-Vtl_WCMY0TcilKo_3tCh9_J1wWblMA/exec";

  const offlineCountEl = document.getElementById("offline-count");
  const onlineCountEl = document.getElementById("online-count");
  const form = document.getElementById("reg-form");
  const statusMessageEl = document.getElementById("status-message");
  const modeInputs = form.querySelectorAll('input[name="mode"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Cоздаём спиннер для кнопки
  const spinner = document.createElement("span");
  spinner.classList.add("spinner");

  /**
   * GET-запрос для получения текущих счётчиков (offline/online)
   */
  async function fetchCounts() {
    try {
      const response = await fetch(SCRIPT_URL, { method: "GET" });
      const data = await response.json();
      return { offline: data.offline, online: data.online };
    } catch (err) {
      console.error("Ошибка при получении счётчиков:", err);
      return { offline: 0, online: 0 };
    }
  }

  /**
   * Обновляем UI: устанавливаем числа и блокируем режимы при достижении лимита
   */
  async function updateUICounts() {
    const counts = await fetchCounts();
    offlineCountEl.textContent = counts.offline;
    onlineCountEl.textContent = counts.online;

    // Блокируем «Очно», если лимит достигнут
    if (counts.offline >= MAX_OFFLINE) {
      modeInputs.forEach((inp) => {
        if (inp.value === "offline") inp.disabled = true;
      });
      if (form.mode.value === "offline") form.mode.value = "online";
    }
    // Блокируем «Онлайн», если лимит достигнут
    if (counts.online >= MAX_ONLINE) {
      modeInputs.forEach((inp) => {
        if (inp.value === "online") inp.disabled = true;
      });
      if (form.mode.value === "online") form.mode.value = "offline";
    }
    // Если оба режима заполнены — блокируем кнопку
    if (counts.offline >= MAX_OFFLINE && counts.online >= MAX_ONLINE) {
      submitBtn.disabled = true;
      statusMessageEl.textContent = "Все очные и онлайн-места заняты.";
    }
  }

  // При загрузке страницы обновляем счётчики
  updateUICounts();

  // Обработчик отправки формы
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const contact = formData.get("contact").trim();
    const mode = formData.get("mode");

    if (!name || !contact) {
      statusMessageEl.textContent = "Пожалуйста, заполните все поля.";
      return;
    }

    // Блокируем кнопку и добавляем к ней спиннер
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка";
    submitBtn.appendChild(spinner);
    statusMessageEl.textContent = "";

    try {
      const payload = { name, contact, mode };
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok && result.message) {
        submitBtn.textContent = "Успешно!";
        setTimeout(() => {
          window.location.href = "thankyou.html";
        }, 1500);
      } else {
        throw new Error(result.message || "Неизвестная ошибка");
      }
    } catch (err) {
      console.error("Ошибка при отправке формы:", err);
      statusMessageEl.textContent = "Ошибка: " + err.message;
      submitBtn.disabled = false;
      submitBtn.textContent = "Записаться";
    }
  });
});
