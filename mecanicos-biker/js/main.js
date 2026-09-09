(function () {
  var WHATSAPP_NUMBER = '524612315670';

  /* =========================================================
     Header / nav / FAQ
     ========================================================= */
  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    }
  });

  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* =========================================================
     Utilities
     ========================================================= */
  function formatMoney(amount) {
    return '$' + amount.toLocaleString('es-MX') + ' MXN';
  }

  function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  /* =========================================================
     Cart
     ========================================================= */
  var CART_KEY = 'mecanicosBikerCart';
  var cart = loadCart();

  var cartToggle = document.getElementById('cartToggle');
  var cartClose = document.getElementById('cartClose');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartPanel = document.getElementById('cartPanel');
  var cartItemsEl = document.getElementById('cartItems');
  var cartEmptyEl = document.getElementById('cartEmpty');
  var cartCountEl = document.getElementById('cartCount');
  var cartSubtotalEl = document.getElementById('cartSubtotal');
  var cartWhatsappEl = document.getElementById('cartWhatsapp');

  function loadCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      /* localStorage unavailable — cart still works for this page view */
    }
  }

  function addToCart(name, price) {
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name: name, price: price, qty: 1 });
    }
    saveCart();
    renderCart();
    pulseCartIcon();
  }

  function pulseCartIcon() {
    cartToggle.classList.remove('cart-toggle--pulse');
    void cartToggle.offsetWidth; // reinicia la animación aunque se agregue rápido varias veces
    cartToggle.classList.add('cart-toggle--pulse');
  }

  function changeQty(name, delta) {
    var item = cart.find(function (i) { return i.name === name; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(function (i) { return i.name !== name; });
    }
    saveCart();
    renderCart();
  }

  function cartTotal() {
    return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
  }

  function cartCount() {
    return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function renderCart() {
    var count = cartCount();
    cartCountEl.textContent = String(count);
    cartCountEl.hidden = count === 0;

    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartItemsEl.appendChild(cartEmptyEl);
      cartEmptyEl.hidden = false;
    } else {
      cartEmptyEl.hidden = true;
      cart.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML =
          '<div class="cart-item-info">' +
            '<strong>' + escapeHtml(item.name) + '</strong>' +
            '<span>' + formatMoney(item.price) + '</span>' +
          '</div>' +
          '<div class="cart-item-qty">' +
            '<button type="button" class="qty-btn" data-action="dec" aria-label="Quitar uno de ' + escapeHtml(item.name) + '">&minus;</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" class="qty-btn" data-action="inc" aria-label="Agregar uno de ' + escapeHtml(item.name) + '">+</button>' +
          '</div>';
        row.querySelector('[data-action="inc"]').addEventListener('click', function () { changeQty(item.name, 1); });
        row.querySelector('[data-action="dec"]').addEventListener('click', function () { changeQty(item.name, -1); });
        cartItemsEl.appendChild(row);
      });
    }

    cartSubtotalEl.textContent = formatMoney(cartTotal());

    var waText = 'Hola, quiero pedir:%0A';
    cart.forEach(function (item) {
      waText += '- ' + item.qty + ' x ' + item.name + ' (' + formatMoney(item.price) + ' c/u)%0A';
    });
    waText += 'Subtotal: ' + formatMoney(cartTotal());
    cartWhatsappEl.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waText;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function openCart() {
    cartPanel.classList.add('is-open');
    cartPanel.setAttribute('aria-hidden', 'false');
    cartOverlay.hidden = false;
    cartToggle.setAttribute('aria-expanded', 'true');
  }
  function closeCart() {
    cartPanel.classList.remove('is-open');
    cartPanel.setAttribute('aria-hidden', 'true');
    cartOverlay.hidden = true;
    cartToggle.setAttribute('aria-expanded', 'false');
  }

  cartToggle.addEventListener('click', function () {
    if (cartPanel.classList.contains('is-open')) closeCart(); else openCart();
  });
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeCart();
  });

  document.querySelectorAll('.add-to-cart').forEach(function (button) {
    button.addEventListener('click', function () {
      addToCart(button.dataset.name, Number(button.dataset.price));
    });
  });

  renderCart();

  /* =========================================================
     Product filters
     ========================================================= */
  var filterButtons = document.querySelectorAll('.filter-chip');
  var productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      var filter = button.dataset.filter;
      productCards.forEach(function (card) {
        var show = filter === 'todos' || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });

  /* =========================================================
     Booking calendar
     ========================================================= */
  var MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var WEEKDAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  var calMonthLabel = document.getElementById('calMonthLabel');
  var calendarGrid = document.getElementById('calendarGrid');
  var calPrev = document.getElementById('calPrev');
  var calNext = document.getElementById('calNext');
  var slotLabel = document.getElementById('slotLabel');
  var slotGrid = document.getElementById('slotGrid');
  var bookingSelection = document.getElementById('bookingSelectionText');
  var bookingSubmit = document.getElementById('bookingSubmit');
  var bookingForm = document.getElementById('bookingForm');

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var maxMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  var viewMonth = new Date(minMonth);

  var selectedDate = null; // Date at midnight
  var selectedHour = null; // number, e.g. 9

  function dateKey(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  function isPast(date) {
    return date.getTime() < today.getTime();
  }

  function isSunday(date) {
    return date.getDay() === 0;
  }

  function hoursForDate(date) {
    var day = date.getDay();
    if (day === 0) return [];
    if (day === 6) return [9, 10, 11, 12, 13, 14];
    return [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  }

  function isHourBusy(date, hour) {
    var seed = hashString(dateKey(date) + '-' + hour);
    return seed % 100 < 32; // ~32% de los horarios simulados como ocupados
  }

  function dayHasFreeSlot(date) {
    var hours = hoursForDate(date);
    if (hours.length === 0) return false;
    var isToday = date.getTime() === today.getTime();
    return hours.some(function (h) {
      if (isToday && h <= new Date().getHours()) return false;
      return !isHourBusy(date, h);
    });
  }

  function renderCalendar() {
    calMonthLabel.textContent = MONTHS_ES[viewMonth.getMonth()].charAt(0).toUpperCase() + MONTHS_ES[viewMonth.getMonth()].slice(1) + ' ' + viewMonth.getFullYear();
    calPrev.disabled = viewMonth.getTime() <= minMonth.getTime();
    calNext.disabled = viewMonth.getTime() >= maxMonth.getTime();

    calendarGrid.innerHTML = '';

    var firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    var startOffset = firstDay.getDay();
    var daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

    for (var i = 0; i < startOffset; i++) {
      var blank = document.createElement('span');
      blank.className = 'calendar-cell calendar-cell--blank';
      calendarGrid.appendChild(blank);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'calendar-cell';
      btn.textContent = String(d);

      var closed = isSunday(cellDate);
      var past = isPast(cellDate);
      var hasFree = !closed && !past && dayHasFreeSlot(cellDate);

      if (past || closed) {
        btn.classList.add(closed ? 'is-closed' : 'is-past');
        btn.disabled = true;
      } else if (!hasFree) {
        btn.classList.add('is-busy');
        btn.disabled = true;
      } else {
        btn.classList.add('is-free');
      }

      if (cellDate.getTime() === today.getTime()) {
        btn.classList.add('is-today');
      }
      if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
        btn.classList.add('is-selected');
      }

      btn.addEventListener('click', function (dateForCell) {
        return function () {
          selectedDate = dateForCell;
          selectedHour = null;
          renderCalendar();
          renderSlots();
          updateSelectionSummary();
        };
      }(cellDate));

      calendarGrid.appendChild(btn);
    }
  }

  function renderSlots() {
    slotGrid.innerHTML = '';

    if (!selectedDate) {
      slotLabel.textContent = 'Elige primero una fecha';
      return;
    }

    var dayName = WEEKDAYS_ES[selectedDate.getDay()];
    slotLabel.textContent = 'Horarios para el ' + dayName + ' ' + selectedDate.getDate() + ' de ' + MONTHS_ES[selectedDate.getMonth()];

    var hours = hoursForDate(selectedDate);
    var isToday = selectedDate.getTime() === today.getTime();
    var nowHour = new Date().getHours();

    hours.forEach(function (hour) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-chip';
      btn.textContent = (hour < 10 ? '0' + hour : hour) + ':00';

      var pastHour = isToday && hour <= nowHour;
      var busy = pastHour || isHourBusy(selectedDate, hour);

      if (busy) {
        btn.classList.add('is-busy');
        btn.disabled = true;
      } else {
        btn.classList.add('is-free');
        if (selectedHour === hour) btn.classList.add('is-selected');
        btn.addEventListener('click', function () {
          selectedHour = hour;
          renderSlots();
          updateSelectionSummary();
        });
      }

      slotGrid.appendChild(btn);
    });
  }

  function updateSelectionSummary() {
    if (selectedDate && selectedHour !== null) {
      var dayName = WEEKDAYS_ES[selectedDate.getDay()];
      var hourLabel = (selectedHour < 10 ? '0' + selectedHour : selectedHour) + ':00';
      bookingSelection.textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1) + ' ' + selectedDate.getDate() + ' de ' + MONTHS_ES[selectedDate.getMonth()] + ', ' + hourLabel + ' hrs';
      bookingSubmit.disabled = false;
    } else if (selectedDate) {
      bookingSelection.textContent = 'Elige un horario disponible';
      bookingSubmit.disabled = true;
    } else {
      bookingSelection.textContent = 'Sin fecha ni horario seleccionados';
      bookingSubmit.disabled = true;
    }
  }

  calPrev.addEventListener('click', function () {
    if (viewMonth.getTime() <= minMonth.getTime()) return;
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  calNext.addEventListener('click', function () {
    if (viewMonth.getTime() >= maxMonth.getTime()) return;
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!selectedDate || selectedHour === null) return;

    var nombre = document.getElementById('nombre').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var servicio = document.getElementById('servicio').value;

    if (!nombre || !telefono) {
      bookingForm.reportValidity();
      return;
    }

    var dayName = WEEKDAYS_ES[selectedDate.getDay()];
    var hourLabel = (selectedHour < 10 ? '0' + selectedHour : selectedHour) + ':00';
    var fechaTexto = dayName + ' ' + selectedDate.getDate() + ' de ' + MONTHS_ES[selectedDate.getMonth()] + ' de ' + selectedDate.getFullYear();

    var message = 'Hola, quiero agendar una cita:%0A' +
      '- Nombre: ' + nombre + '%0A' +
      '- Teléfono: ' + telefono + '%0A' +
      '- Servicio: ' + servicio + '%0A' +
      '- Fecha: ' + fechaTexto + '%0A' +
      '- Hora: ' + hourLabel + ' hrs';

    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message, '_blank', 'noopener');
  });

  renderCalendar();
  renderSlots();
  updateSelectionSummary();
})();
