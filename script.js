/* =======================================
   script.js – Ramesh & Gowri Wedding
   Medium animations, clean & smooth
   ======================================= */

// ── 1. FALLING PETALS (light) ──
(function () {
  const canvas = document.getElementById('petalsCanvas');
  const ctx = canvas.getContext('2d');
  const EMOJIS = ['🌸', '🪷', '✿', '❀', '🌺'];
  let petals = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Petal {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * canvas.width;
      this.y     = init ? Math.random() * canvas.height : -20;
      this.size  = Math.random() * 12 + 7;
      this.speed = Math.random() * 1.2 + 0.4;
      this.sway  = Math.random() * 0.7 + 0.2;
      this.swayOff = Math.random() * Math.PI * 2;
      this.rot   = Math.random() * Math.PI * 2;
      this.rotSpd = (Math.random() - 0.5) * 0.03;
      this.glyph = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      this.alpha = Math.random() * 0.45 + 0.2;
    }
    update(t) {
      this.y += this.speed;
      this.x += Math.sin(t * 0.0008 + this.swayOff) * this.sway;
      this.rot += this.rotSpd;
      if (this.y > canvas.height + 20) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.glyph, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < 20; i++) petals.push(new Petal());

  (function loop(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(loop);
  })(0);
})();


// ── 2. NAVBAR ──
(function () {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const list = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  }, { passive: true });

  ham.addEventListener('click', () => list.classList.toggle('open'));
  list.querySelectorAll('a').forEach(a => a.addEventListener('click', () => list.classList.remove('open')));
})();


// ── 3. DRAGGABLE INVITATION ──
(function () {
  const wrap = document.getElementById('inviteWrap');
  const note = document.getElementById('dragNote');
  if (!wrap) return;

  let drag = false, sx, sy, ox, oy, moved = false;
  const THRESHOLD = 5;

  function getOffset() {
    const s = wrap.style;
    return {
      x: parseInt(s.marginLeft || '0') || 0,
      y: parseInt(s.marginTop  || '0') || 0
    };
  }

  wrap.addEventListener('mousedown', e => {
    drag = true; moved = false;
    sx = e.clientX; sy = e.clientY;
    const o = getOffset();
    ox = o.x; oy = o.y;
    wrap.classList.add('dragging');
    note && (note.style.display = 'none');
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!drag) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > THRESHOLD || Math.abs(dy) > THRESHOLD) moved = true;
    wrap.style.marginLeft = (ox + dx) + 'px';
    wrap.style.marginTop  = (oy + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!drag) return;
    drag = false;
    wrap.classList.remove('dragging');
  });

  // Touch
  wrap.addEventListener('touchstart', e => {
    const t = e.touches[0];
    drag = true; moved = false;
    sx = t.clientX; sy = t.clientY;
    const o = getOffset();
    ox = o.x; oy = o.y;
    note && (note.style.display = 'none');
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!drag) return;
    const t = e.touches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > THRESHOLD || Math.abs(dy) > THRESHOLD) moved = true;
    wrap.style.marginLeft = (ox + dx) + 'px';
    wrap.style.marginTop  = (oy + dy) + 'px';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', () => { drag = false; });
})();


// ── 4. COUNTDOWN ──
(function () {
  const target = new Date('2026-11-01T10:30:00+05:30');
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs')
  };

  function pad(n, l = 2) { return String(n).padStart(l, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    if (els.days)  els.days.textContent  = pad(d, 3);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.mins)  els.mins.textContent  = pad(m);
    if (els.secs)  els.secs.textContent  = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();


// ── 5. SCROLL REVEAL ──
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-card').forEach(el => obs.observe(el));
})();


// ── 6. PARALLAX (subtle) ──
(function () {
  const img = document.querySelector('.hero-image');
  if (!img) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      img.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }
  }, { passive: true });
})();


// ── 7. RSVP ──
(function () {
  const form = document.getElementById('rsvpForm');
  const ok   = document.getElementById('rsvpOk');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-rsvp');
    btn.textContent = '⏳ Confirming...';
    btn.disabled = true;
    setTimeout(() => {
      ok.style.display = 'block';
      form.reset();
      btn.textContent = '💌 Confirm Attendance';
      btn.disabled = false;
      ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });
})();
