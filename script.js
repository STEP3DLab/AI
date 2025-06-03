// ---------- script.js ----------

document.addEventListener("DOMContentLoaded", () => {
  const MAX_OFFLINE = 16;
  const MAX_ONLINE = 20;

  // Вставьте сюда URL вашего развернутого Google Apps Script (Web App)
  const SCRIPT_URL = "https://script.google.com/macros/s/ВАШ_ID_СКРИПТА/exec";

  const offlineCountEl = document.getElementById("offline-count");
  const onlineCountEl = document.getElementById("online-count");
  const form = document.getElementById("reg-form");
  const statusMessageEl = document.getElementById("status-message");
  const modeInputs = form.querySelectorAll('input[name="mode"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Спиннер, который добавляется внутрь кнопки при отправке
  const spinner = document.createElement("span");
  spinner.classList.add("spinner");

  /**
   * Запрос к Google Apps Script (GET) — получает текущее число участников
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
   * Обновление UI: вставляем цифры и при необходимости блокируем режимы/кнопку
   */
  async function updateUICounts() {
    const counts = await fetchCounts();
    offlineCountEl.textContent = counts.offline;
    onlineCountEl.textContent = counts.online;

    // Если оффлайн заполнено, отключаем радио «очно»
    if (counts.offline >= MAX_OFFLINE) {
      modeInputs.forEach((inp) => {
        if (inp.value === "offline") inp.disabled = true;
      });
      if (form.mode.value === "offline") {
        form.mode.value = "online";
      }
    }

    // Если онлайн заполнено, отключаем радио «онлайн»
    if (counts.online >= MAX_ONLINE) {
      modeInputs.forEach((inp) => {
        if (inp.value === "online") inp.disabled = true;
      });
      if (form.mode.value === "online") {
        form.mode.value = "offline";
      }
    }

    // Если оба режима заполнены, блокируем кнопку
    if (counts.offline >= MAX_OFFLINE && counts.online >= MAX_ONLINE) {
      submitBtn.disabled = true;
      statusMessageEl.textContent = "Все очные и онлайн-места заняты.";
    }
  }

  // При загрузке страницы сразу обновляем счётчики
  updateUICounts();

  // Обработчик отправки формы
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Сбор данных формы
    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const contact = formData.get("contact").trim();
    const mode = formData.get("mode");

    if (!name || !contact) {
      statusMessageEl.textContent = "Пожалуйста, заполните все поля.";
      return;
    }

    // Отключаем кнопку и добавляем спиннер
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
        // Если успешно, показываем «Успешно!» и делаем редирект
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
