// ---------- script.js ----------

document.addEventListener("DOMContentLoaded", () => {
  const MAX_OFFLINE = 16;
  const MAX_ONLINE  = 20;

  // Замените на URL вашего веб-приложения Google Script (doGet/doPost)
  const SCRIPT_URL = "https://script.google.com/macros/s/ВАШ_ИД_СКРИПТА/exec";

  const offlineCountEl  = document.getElementById("offline-count");
  const onlineCountEl   = document.getElementById("online-count");
  const form            = document.getElementById("reg-form");
  const statusMessageEl = document.getElementById("status-message");
  const modeInputs      = form.querySelectorAll('input[name="mode"]');
  const submitBtn       = form.querySelector('button[type="submit"]');

  // GET-запрос для получения текущих счётчиков (offline/online)
  async function fetchCounts() {
    try {
      const response = await fetch(SCRIPT_URL, { method: "GET" });
      const data = await response.json();
      return {
        offline: data.offline,
        online: data.online
      };
    } catch (err) {
      console.error("Ошибка при получении счётчиков:", err);
      return { offline: 0, online: 0 };
    }
  }

  // Обновление UI: ставим числа в <span> и блокируем, если лимит достигнут
  async function updateUICounts() {
    const counts = await fetchCounts();

    offlineCountEl.textContent = counts.offline;
    onlineCountEl.textContent  = counts.online;

    // Если оффлайн заполнено, отключаем radio[offline]
    if (counts.offline >= MAX_OFFLINE) {
      modeInputs.forEach(inp => {
        if (inp.value === "offline") inp.disabled = true;
      });
      if (form.mode.value === "offline") {
        form.mode.value = "online";
      }
    }

    // Если онлайн заполнено, отключаем radio[online]
    if (counts.online >= MAX_ONLINE) {
      modeInputs.forEach(inp => {
        if (inp.value === "online") inp.disabled = true;
      });
      if (form.mode.value === "online") {
        form.mode.value = "offline";
      }
    }

    // Если обе группы заполнены — блокируем кнопку и показываем сообщение
    if (
      counts.offline >= MAX_OFFLINE &&
      counts.online  >= MAX_ONLINE
    ) {
      submitBtn.disabled = true;
      statusMessageEl.textContent = "К сожалению, и оффлайн, и онлайн группы уже заполнены.";
      statusMessageEl.style.color = "red";
    }
  }

  // Сразу при загрузке страницы показываем текущее состояние
  updateUICounts();

  // Обработчик отправки формы
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name    = formData.get("name").trim();
    const contact = formData.get("contact").trim();
    const mode    = formData.get("mode");

    if (!name || !contact) {
      statusMessageEl.textContent = "Пожалуйста, заполните все поля.";
      statusMessageEl.style.color = "red";
      return;
    }

    submitBtn.disabled = true;
    statusMessageEl.textContent = "Отправка...";
    statusMessageEl.style.color = "black";

    try {
      const payload = { name, contact, mode };
      const response = await fetch(SCRIPT_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok && result.message) {
        statusMessageEl.textContent = result.message;
        statusMessageEl.style.color = "green";
        // После успешного добавления перезапрашиваем счётчики
        await updateUICounts();
      } else {
        throw new Error(result.message || "Неизвестная ошибка");
      }
    } catch (err) {
      console.error("Ошибка при отправке формы:", err);
      statusMessageEl.textContent = "Ошибка при отправке: " + err.message;
      statusMessageEl.style.color = "red";
      submitBtn.disabled = false;
    }
  });
});
