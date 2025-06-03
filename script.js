document.getElementById('reg-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    name: form.name.value,
    contact: form.contact.value
  };
  const response = await fetch('YOUR_GOOGLE_SCRIPT_URL', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await response.json();
  document.getElementById('status-message').textContent = result.message || 'Готово!';
});

// Появление элементов при прокрутке
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
});
