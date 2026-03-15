/* ===================================================
   main.js — Інтерактивність сайту медичного кабінету
   Практична робота №1
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============ Мобільний бургер-меню ============
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav   = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
    });

    // Закрити меню при кліку по посиланню
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Закрити меню при кліку поза межами
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============ Підсвічування активного пункту меню ============
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // ============ Перемикач вкладок форм ============
  document.querySelectorAll('.form-tabs').forEach(tabsEl => {
    const tabs   = tabsEl.querySelectorAll('.form-tab');
    const panels = tabsEl.closest('.form-wrapper')?.querySelectorAll('.form-panel') ||
                   document.querySelectorAll('.form-panel');

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        panels[i]?.classList.add('active');
      });
    });
  });

  // ============ Обробка форми реєстрації пацієнта ============
  const regForm = document.getElementById('form-register');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(regForm, 'Пацієнта успішно зареєстровано! Дані збережено в системі.');
    });
  }

  // ============ Обробка форми запису на прийом ============
  const apptForm = document.getElementById('form-appointment');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(apptForm, 'Запис на прийом підтверджено! Очікуйте SMS-підтвердження.');
    });
  }

  // ============ Спільна логіка сабміту ============
  function handleFormSubmit(form, successMsg) {
    // Перевіряємо валідність
    if (!form.checkValidity()) {
      form.querySelectorAll('input, select, textarea').forEach(field => {
        if (!field.validity.valid) {
          field.focus();
        }
      });
      showAlert(form, 'Будь ласка, заповніть усі обов\'язкові поля коректно.', 'error');
      return;
    }

    // Кнопка submit — стан завантаження
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Надсилання...';

    // Імітація запиту
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = originalText;
      showAlert(form, successMsg, 'success');
      form.reset();
    }, 1200);
  }

  // ============ Показ повідомлення ============
  function showAlert(form, message, type) {
    // Видаляємо попередні
    form.querySelectorAll('.alert').forEach(a => a.remove());

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
    form.appendChild(alert);

    // Автозникнення через 5 сек
    setTimeout(() => alert.remove(), 5000);
  }

  // ============ Встановлення мінімальної дати (сьогодні) ============
  document.querySelectorAll('input[type="date"]').forEach(input => {
    if (input.id === 'appt-date' || input.name === 'appointmentDate') {
      const today = new Date().toISOString().split('T')[0];
      input.min = today;
    }
    if (input.id === 'birth-date') {
      const today = new Date().toISOString().split('T')[0];
      input.max = today;
    }
  });

  // ============ Плавна поява елементів при прокрутці ============
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.doctor-card, .stat-card, .card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

});
