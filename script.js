/* ==============================================
   script.js – Ramesh & Gowri Wedding
   ============================================== */

// ── 1. FALLING PETALS (Calm & Serene) ─────────
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const GLYPHS = ['🌸', '🪷', '✿', '❀', '🌺'];
  let petals = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Petal {
    constructor(init) {
      this.x     = Math.random() * canvas.width;
      this.y     = init ? Math.random() * canvas.height : -20;
      this.size  = Math.random() * 10 + 6;
      this.speed = Math.random() * 0.4 + 0.22; // Calm, gentle drifting
      this.sway  = Math.random() * 0.35 + 0.15;
      this.off   = Math.random() * Math.PI * 2;
      this.rot   = Math.random() * Math.PI * 2;
      this.rotS  = (Math.random() - 0.5) * 0.012; // Slow graceful spin
      this.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      this.alpha = Math.random() * 0.28 + 0.12; // Subtle, elegant opacity
    }
    update(t) {
      this.y += this.speed;
      this.x += Math.sin(t * 0.0005 + this.off) * this.sway;
      this.rot += this.rotS;
      if (this.y > canvas.height + 20) {
        this.x = Math.random() * canvas.width;
        this.y = -20;
      }
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

  for (let i = 0; i < 18; i++) petals.push(new Petal(true));

  (function loop(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(loop);
  })(0);
})();


// ── 2. NAVBAR ──────────────────────────────────
(function initNav() {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const list = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  }, { passive: true });

  ham.addEventListener('click', () => list.classList.toggle('open'));
  list && list.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => list.classList.remove('open'));
  });
})();


// ── 3. VIDEO BACKGROUND ────────────────────────
(function initVideo() {
  const fileInput = document.getElementById('videoFileInput');
  const videoEl   = document.getElementById('bgVideo');
  const fallback  = document.getElementById('heroFallback');
  if (!videoEl) return;

  function loadVideo(file) {
    if (!file || !file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
    videoEl.play().catch(() => {});
  }

  // Hidden file input (can be triggered programmatically)
  fileInput && fileInput.addEventListener('change', e => loadVideo(e.target.files[0]));

  // Drag & drop video directly onto the hero
  const hero = document.getElementById('hero');
  hero && hero.addEventListener('dragover', e => e.preventDefault());
  hero && hero.addEventListener('drop', e => {
    e.preventDefault();
    loadVideo(e.dataTransfer.files[0]);
  });
})();


// ── 4. INVITATION SLIDER ──────────────────────
(function initSlider() {
  const track  = document.getElementById('inviteTrack');
  const slider = document.getElementById('inviteSlider');
  const prevBtn = document.getElementById('slPrev');
  const nextBtn = document.getElementById('slNext');
  const dots   = document.querySelectorAll('.sl-dot');
  if (!track) return;

  let cur = 0;
  const total = 3;
  let startX = 0, startY = 0, isDragging = false, moved = false;

  function isMobile() { return window.innerWidth < 900; }

  function goTo(idx) {
    if (!isMobile()) return;
    cur = Math.max(0, Math.min(total - 1, idx));
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  // Button clicks
  prevBtn && prevBtn.addEventListener('click', () => goTo(cur - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(cur + 1));

  // Dot clicks
  dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.idx))));

  // ─── TOUCH SWIPE ───────────────────────────
  slider && slider.addEventListener('touchstart', e => {
    if (!isMobile()) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    isDragging = true;
    moved = false;
  }, { passive: true });

  slider && slider.addEventListener('touchmove', e => {
    if (!isDragging || !isMobile()) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) {
      moved = true;
      e.preventDefault(); // prevent vertical scroll when swiping horizontally
    }
  }, { passive: false });

  slider && slider.addEventListener('touchend', e => {
    if (!isDragging || !isMobile()) return;
    isDragging = false;
    if (!moved) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 48) {
      goTo(dx < 0 ? cur + 1 : cur - 1);
    }
  });

  // ─── MOUSE DRAG (desktop slider preview) ───
  slider && slider.addEventListener('mousedown', e => {
    if (!isMobile()) return;
    startX = e.clientX;
    isDragging = true; moved = false;
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging || !isMobile()) return;
    if (Math.abs(e.clientX - startX) > 5) moved = true;
  });
  document.addEventListener('mouseup', e => {
    if (!isDragging || !isMobile()) return;
    isDragging = false;
    if (!moved) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 48) goTo(dx < 0 ? cur + 1 : cur - 1);
  });

  // Reset on resize
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      track.style.transform = '';
    } else {
      goTo(cur);
    }
  });
})();


// ── 5. COUNTDOWN ──────────────────────────────
(function initCountdown() {
  const target = new Date('2026-11-01T10:30:00+05:30');
  const ids = {
    days: 'cd-days', hours: 'cd-hours', mins: 'cd-mins', secs: 'cd-secs'
  };

  function pad(n, l = 2) { return String(n).padStart(l, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      Object.values(ids).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    const dEl = document.getElementById(ids.days);
    const hEl = document.getElementById(ids.hours);
    const mEl = document.getElementById(ids.mins);
    const sEl = document.getElementById(ids.secs);
    if (dEl) dEl.textContent = pad(d, 3);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();


// ── 6. SCROLL REVEAL ──────────────────────────
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-card, .det-card, .gal-item').forEach(el => obs.observe(el));
})();


// ── 7. SUBTLE PARALLAX ────────────────────────
(function initParallax() {
  const couple = document.querySelector('.hero-couple');
  if (!couple) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      couple.style.transform = `translateY(${window.scrollY * 0.11}px)`;
    }
  }, { passive: true });
})();


