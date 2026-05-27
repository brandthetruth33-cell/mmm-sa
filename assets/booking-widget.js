(function () {
  'use strict';

  if (window._bookingWidgetInitialized) return;
  window._bookingWidgetInitialized = true;

  var MAKES = [
    'Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge',
    'Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Land Rover',
    'Lexus','Lincoln','Mazda','Mercedes-Benz','Mitsubishi','Nissan','RAM',
    'Subaru','Tesla','Toyota','Volkswagen','Volvo','Other'
  ];

  var TIME_SLOTS = [
    { label: '9:00 AM',  value: '09:00 AM' },
    { label: '10:00 AM', value: '10:00 AM' },
    { label: '11:00 AM', value: '11:00 AM' },
    { label: '12:00 PM', value: '12:00 PM' },
    { label: '1:00 PM',  value: '01:00 PM' },
    { label: '2:00 PM',  value: '02:00 PM' },
    { label: '3:00 PM',  value: '03:00 PM' },
    { label: '4:00 PM',  value: '04:00 PM' }
  ];

  var STEP_LABELS = ['Car & Location', 'Services', 'Appointment', 'Book & Confirm'];
  var STEP_SHORT  = ['Car', 'Services', 'Time', 'Book'];

  var state = {
    step: 1,
    location: '', year: '', make: '', model: '', variant: '',
    services: [],
    date: '', time: '',
    name: '', email: '', phone: '', address: '', notes: ''
  };

  var overlay, activeTrigger;

  /* ── Utilities ──────────────────────────────────────────────── */

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function today() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function currentYear() { return new Date().getFullYear(); }

  function findService(id) {
    var services = window.MMMServices || [];
    for (var i = 0; i < services.length; i++) {
      if (services[i].id === id) return services[i];
    }
    return null;
  }

  /* ── HTML builders ──────────────────────────────────────────── */

  function buildStepBar() {
    var html = '<div class="mmm-step-bar">';
    for (var i = 0; i < STEP_SHORT.length; i++) {
      var n = i + 1;
      if (i > 0) {
        var lineDone = state.step > i ? ' mmm-step-line--done' : '';
        html += '<div class="mmm-step-line' + lineDone + '"></div>';
      }
      var cls = state.step > n ? 'done' : state.step === n ? 'active' : 'idle';
      html += '<div class="mmm-step-dot mmm-step-dot--' + cls + '">';
      html += state.step > n ? '&#10003;' : n;
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function buildYearOptions() {
    var opts = '<option value="">Year</option>';
    var yr = currentYear();
    for (var y = yr; y >= yr - 30; y--) {
      opts += '<option value="' + y + '"' + (state.year == y ? ' selected' : '') + '>' + y + '</option>';
    }
    return opts;
  }

  function buildMakeOptions() {
    var opts = '<option value="">Make</option>';
    for (var i = 0; i < MAKES.length; i++) {
      var m = MAKES[i];
      opts += '<option value="' + esc(m) + '"' + (state.make === m ? ' selected' : '') + '>' + esc(m) + '</option>';
    }
    return opts;
  }

  function buildServiceCards() {
    var services = window.MMMServices || [];
    if (!services.length) {
      return '<p style="color:var(--mmm-muted);text-align:center;padding:1rem">Service list unavailable. Please call <a href="tel:+12103185426" style="color:var(--mmm-cyan)">(210)-318-5426</a>.</p>';
    }
    var html = '';
    for (var i = 0; i < services.length; i++) {
      var s = services[i];
      var sel = state.services.indexOf(s.id) > -1;
      var priceLabel = s.priceMin === s.priceMax
        ? '$' + s.priceMin
        : '$' + s.priceMin + '&ndash;$' + s.priceMax;
      html += '<div class="mmm-service-card' + (sel ? ' mmm-service-card--selected' : '') + '"'
            + ' data-id="' + esc(s.id) + '" role="checkbox" aria-checked="' + sel + '" tabindex="0">'
            + '<div class="mmm-service-check"><span>' + (sel ? '&#10003;' : '') + '</span></div>'
            + '<div class="mmm-service-info">'
            + '<div class="mmm-service-name">' + esc(s.name) + '</div>'
            + '<div class="mmm-service-desc">' + esc(s.description) + '</div>'
            + '<div class="mmm-service-duration">' + esc(s.duration) + '</div>'
            + '</div>'
            + '<div class="mmm-service-price">' + priceLabel + '</div>'
            + '</div>';
    }
    return html;
  }

  function getServicesTotal() {
    var min = 0, max = 0;
    for (var i = 0; i < state.services.length; i++) {
      var s = findService(state.services[i]);
      if (s) { min += s.priceMin; max += s.priceMax; }
    }
    return { min: min, max: max };
  }

  function buildTotalBar() {
    if (!state.services.length) {
      return '<div class="mmm-total-bar mmm-total-bar--empty">Select at least one service to continue.</div>';
    }
    var t = getServicesTotal();
    var label = t.min === t.max ? '$' + t.min : '$' + t.min + '&ndash;$' + t.max;
    return '<div class="mmm-total-bar">'
         + '<span class="mmm-total-label">Estimated: <strong>' + label + '</strong></span>'
         + '<span class="mmm-deposit-note">$50 deposit now &bull; balance due on-site</span>'
         + '</div>';
  }

  function buildTimeslots() {
    var html = '';
    for (var i = 0; i < TIME_SLOTS.length; i++) {
      var slot = TIME_SLOTS[i];
      var sel = state.time === slot.value;
      html += '<button type="button" class="mmm-timeslot-btn' + (sel ? ' mmm-timeslot-btn--selected' : '') + '"'
            + ' data-time="' + esc(slot.value) + '">' + esc(slot.label) + '</button>';
    }
    return html;
  }

  function buildOrderSummary() {
    var names = [];
    for (var i = 0; i < state.services.length; i++) {
      var s = findService(state.services[i]);
      names.push(s ? s.name : state.services[i]);
    }
    var t = getServicesTotal();
    var totalLabel = !state.services.length ? '&mdash;'
      : (t.min === t.max ? '$' + t.min : '$' + t.min + '&ndash;$' + t.max);
    var vehicle = [state.year, state.make, state.model, state.variant].filter(Boolean).join(' ');
    var appt = state.date && state.time ? esc(state.date) + ' at ' + esc(state.time) : '&mdash;';

    return '<div class="mmm-summary">'
         + '<div class="mmm-summary-title">Order Summary</div>'
         + '<div class="mmm-summary-row"><span>Vehicle</span><span>' + esc(vehicle || '—') + '</span></div>'
         + '<div class="mmm-summary-row"><span>Services</span><span>' + esc(names.join(', ') || '—') + '</span></div>'
         + '<div class="mmm-summary-row"><span>Appointment</span><span>' + appt + '</span></div>'
         + '<div class="mmm-summary-row"><span>Estimate</span><span>' + totalLabel + '</span></div>'
         + '<div class="mmm-summary-divider"></div>'
         + '<div class="mmm-summary-row mmm-summary-deposit"><span>Deposit due now</span><span>$50.00</span></div>'
         + '<p class="mmm-summary-note">Balance due on-site. We accept cash, card &amp; Zelle.</p>'
         + '</div>';
  }

  /* ── Step content renderers ─────────────────────────────────── */

  function renderStep1() {
    return '<div class="mmm-book-field">'
         + '<label class="mmm-book-label" for="mmm-location">Where should we come to?</label>'
         + '<input class="mmm-book-input" id="mmm-location" placeholder="Street address, San Antonio TX" value="' + esc(state.location) + '" />'
         + '</div>'
         + '<div class="mmm-book-row">'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-year">Year</label>'
         + '<select class="mmm-book-select" id="mmm-year">' + buildYearOptions() + '</select></div>'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-make">Make</label>'
         + '<select class="mmm-book-select" id="mmm-make">' + buildMakeOptions() + '</select></div>'
         + '</div>'
         + '<div class="mmm-book-row">'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-model">Model</label>'
         + '<input class="mmm-book-input" id="mmm-model" placeholder="e.g. Camry" value="' + esc(state.model) + '" /></div>'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-variant">Trim <span class="mmm-optional">(optional)</span></label>'
         + '<input class="mmm-book-input" id="mmm-variant" placeholder="e.g. LE, Sport" value="' + esc(state.variant) + '" /></div>'
         + '</div>';
  }

  function renderStep2() {
    return '<div class="mmm-service-grid">' + buildServiceCards() + '</div>'
         + buildTotalBar();
  }

  function renderStep3() {
    return '<div class="mmm-book-field">'
         + '<label class="mmm-book-label" for="mmm-date">Preferred date</label>'
         + '<input class="mmm-book-input" id="mmm-date" type="date" min="' + today() + '" value="' + esc(state.date) + '" />'
         + '</div>'
         + '<div class="mmm-book-field">'
         + '<label class="mmm-book-label">Preferred time <span class="mmm-tz">Central Time (US &amp; Canada)</span></label>'
         + '<div class="mmm-timeslot-grid">' + buildTimeslots() + '</div>'
         + '</div>';
  }

  function renderStep4() {
    return buildOrderSummary()
         + '<div class="mmm-book-row">'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-name">Full name</label>'
         + '<input class="mmm-book-input" id="mmm-name" value="' + esc(state.name) + '" /></div>'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-phone">Phone</label>'
         + '<input class="mmm-book-input" id="mmm-phone" type="tel" placeholder="(210) 555-1234" value="' + esc(state.phone) + '" /></div>'
         + '</div>'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-email">Email</label>'
         + '<input class="mmm-book-input" id="mmm-email" type="email" value="' + esc(state.email) + '" /></div>'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-address">Service address <span class="mmm-optional">(confirm or update)</span></label>'
         + '<input class="mmm-book-input" id="mmm-address" value="' + esc(state.address || state.location) + '" /></div>'
         + '<div class="mmm-book-field"><label class="mmm-book-label" for="mmm-notes">Describe the issue <span class="mmm-optional">(optional)</span></label>'
         + '<textarea class="mmm-book-textarea" id="mmm-notes">' + esc(state.notes) + '</textarea></div>';
  }

  /* ── Footer builder ─────────────────────────────────────────── */

  function buildFooter() {
    var isLast = state.step === 4;
    var nextLabel = isLast ? 'Pay $50.00 Deposit &#8594;' : 'Next &#8594;';
    return '<div class="mmm-foot-status" id="mmm-status"></div>'
         + '<div class="mmm-foot-actions">'
         + (state.step > 1 ? '<button class="mmm-btn-secondary" id="mmm-back">&#8592; Back</button>' : '')
         + '<button class="mmm-btn-primary" id="mmm-next">' + nextLabel + '</button>'
         + '</div>';
  }

  /* ── Render orchestration ───────────────────────────────────── */

  function renderAll() {
    var stepBarEl = overlay.querySelector('.mmm-step-bar');
    if (stepBarEl) stepBarEl.outerHTML = buildStepBar();

    overlay.querySelector('.mmm-book-title').textContent = STEP_LABELS[state.step - 1];

    var body = overlay.querySelector('.mmm-book-body');
    var stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4];
    body.innerHTML = stepRenderers[state.step - 1]();

    overlay.querySelector('.mmm-book-footer').innerHTML = buildFooter();

    var wireFns = [wireStep1, wireStep2, wireStep3, wireStep4];
    wireFns[state.step - 1]();

    body.scrollTop = 0;
  }

  /* ── Step event wiring ──────────────────────────────────────── */

  function wireStep1() {
    document.getElementById('mmm-location').addEventListener('input', function () { state.location = this.value; });
    document.getElementById('mmm-year').addEventListener('change',    function () { state.year    = this.value; });
    document.getElementById('mmm-make').addEventListener('change',    function () { state.make    = this.value; });
    document.getElementById('mmm-model').addEventListener('input',    function () { state.model   = this.value; });
    document.getElementById('mmm-variant').addEventListener('input',  function () { state.variant = this.value; });

    document.getElementById('mmm-next').addEventListener('click', function () {
      if (!state.location.trim()) return setStatus('Please enter a service location.');
      if (!state.year)            return setStatus('Please select a vehicle year.');
      if (!state.make)            return setStatus('Please select the make.');
      if (!state.model.trim())    return setStatus('Please enter the model.');
      setStatus('');
      goStep(2);
    });
  }

  function wireStep2() {
    wireServiceGrid();

    document.getElementById('mmm-next').addEventListener('click', function () {
      if (!state.services.length) return setStatus('Please select at least one service.');
      setStatus('');
      goStep(3);
    });
    wireBack();
  }

  function wireServiceGrid() {
    var grid = overlay.querySelector('.mmm-service-grid');
    if (!grid) return;

    function handleCard(el) {
      var card = el.closest ? el.closest('.mmm-service-card') : null;
      if (!card) return;
      toggleService(card.getAttribute('data-id'));
    }

    grid.addEventListener('click', function (e) { handleCard(e.target); });
    grid.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleCard(e.target);
      }
    });
  }

  function toggleService(id) {
    if (!id) return;
    var idx = state.services.indexOf(id);
    if (idx > -1) {
      state.services.splice(idx, 1);
    } else {
      state.services.push(id);
    }
    var body = overlay.querySelector('.mmm-book-body');
    body.innerHTML = renderStep2();
    wireServiceGrid();
  }

  function wireStep3() {
    document.getElementById('mmm-date').addEventListener('change', function () { state.date = this.value; });

    overlay.querySelector('.mmm-timeslot-grid').addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.mmm-timeslot-btn') : null;
      if (!btn) return;
      state.time = btn.getAttribute('data-time');
      var allBtns = overlay.querySelectorAll('.mmm-timeslot-btn');
      for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.toggle('mmm-timeslot-btn--selected', allBtns[i].getAttribute('data-time') === state.time);
      }
    });

    document.getElementById('mmm-next').addEventListener('click', function () {
      if (!state.date) return setStatus('Please select a date.');
      if (!state.time) return setStatus('Please select a time slot.');
      setStatus('');
      goStep(4);
    });
    wireBack();
  }

  function wireStep4() {
    document.getElementById('mmm-name').addEventListener('input',    function () { state.name    = this.value; });
    document.getElementById('mmm-phone').addEventListener('input',   function () { state.phone   = this.value; });
    document.getElementById('mmm-email').addEventListener('input',   function () { state.email   = this.value; });
    document.getElementById('mmm-address').addEventListener('input', function () { state.address = this.value; });
    document.getElementById('mmm-notes').addEventListener('input',   function () { state.notes   = this.value; });

    document.getElementById('mmm-next').addEventListener('click', submitBooking);
    wireBack();
  }

  function wireBack() {
    var btn = document.getElementById('mmm-back');
    if (!btn) return;
    btn.addEventListener('click', function () { goStep(state.step - 1); });
  }

  /* ── Navigation ─────────────────────────────────────────────── */

  function goStep(n) {
    state.step = n;
    renderAll();
    var first = overlay.querySelector('.mmm-book-body input, .mmm-book-body select, .mmm-book-body .mmm-service-card');
    if (first && first.focus) first.focus();
  }

  /* ── Status ─────────────────────────────────────────────────── */

  function setStatus(msg, type) {
    var el = document.getElementById('mmm-status');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'mmm-foot-status' + (type ? ' mmm-status--' + type : '');
  }

  /* ── Submit ─────────────────────────────────────────────────── */

  function submitBooking() {
    var nameEl    = document.getElementById('mmm-name');
    var phoneEl   = document.getElementById('mmm-phone');
    var emailEl   = document.getElementById('mmm-email');
    var addressEl = document.getElementById('mmm-address');
    var notesEl   = document.getElementById('mmm-notes');

    state.name    = (nameEl    ? nameEl.value    : state.name).trim();
    state.phone   = (phoneEl   ? phoneEl.value   : state.phone).trim();
    state.email   = (emailEl   ? emailEl.value   : state.email).trim();
    state.address = (addressEl ? addressEl.value : state.address || state.location).trim();
    state.notes   = (notesEl   ? notesEl.value   : state.notes).trim();

    if (!state.name)  return setStatus('Please enter your full name.');
    if (!state.phone) return setStatus('Please enter your phone number.');
    if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      return setStatus('Please enter a valid email address.');
    }
    if (!state.address) return setStatus('Please confirm your service address.');

    var btn = document.getElementById('mmm-next');
    if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; }
    setStatus('Submitting your request…');

    var payload = {
      location: state.location,
      year:     state.year,
      make:     state.make,
      model:    state.model,
      variant:  state.variant,
      services: state.services,
      date:     state.date,
      time:     state.time,
      name:     state.name,
      email:    state.email,
      phone:    state.phone,
      address:  state.address,
      notes:    state.notes
    };

    fetch('/api/book.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok) throw new Error(json.error || 'Server error. Please try again.');
        setStatus('Redirecting to secure payment…', 'success');
        window.location.href = json.stripeSessionUrl;
      })
      .catch(function (err) {
        setStatus(err.message, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = 'Pay $50.00 Deposit &#8594;'; }
      });
  }

  /* ── Modal lifecycle ────────────────────────────────────────── */

  function createModal() {
    state = {
      step: 1,
      location: '', year: '', make: '', model: '', variant: '',
      services: [],
      date: '', time: '',
      name: '', email: '', phone: '', address: '', notes: ''
    };

    overlay = document.createElement('div');
    overlay.className = 'mmm-book-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'mmm-book-title');

    overlay.innerHTML = '<div class="mmm-book-modal">'
      + '<div class="mmm-book-header">'
      + '<div class="mmm-book-title" id="mmm-book-title">' + STEP_LABELS[0] + '</div>'
      + '<button class="mmm-book-close" aria-label="Close booking">&times;</button>'
      + '</div>'
      + buildStepBar()
      + '<div class="mmm-book-body"></div>'
      + '<div class="mmm-book-footer"></div>'
      + '</div>';

    document.body.appendChild(overlay);

    overlay.querySelector('.mmm-book-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', escListener);

    renderAll();

    setTimeout(function () {
      var first = overlay.querySelector('.mmm-book-body input, .mmm-book-body select');
      if (first) first.focus();
    }, 30);
  }

  function escListener(e) {
    if (e.key === 'Escape' && overlay) {
      e.preventDefault();
      closeModal();
    }
  }

  function closeModal() {
    if (!overlay) return;
    document.removeEventListener('keydown', escListener);
    overlay.remove();
    overlay = null;
    window._bookingWidgetInitialized = false;
    if (activeTrigger && typeof activeTrigger.focus === 'function') {
      activeTrigger.focus();
    }
  }

  /* ── Public API ─────────────────────────────────────────────── */

  function open(triggerEl) {
    activeTrigger = triggerEl || document.activeElement;
    if (!overlay) createModal();
  }

  window.BookingWidget = window.BookingWidget || {};
  window.BookingWidget.open = function () { open(); };
  window.BookingWidget.close = closeModal;

  if (window._bookingWidgetOpenWhenReady) {
    open();
    window._bookingWidgetOpenWhenReady = false;
  }
})();
