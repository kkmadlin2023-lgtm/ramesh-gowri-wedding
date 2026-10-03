/* ========================================
   script.js – Ramesh & Gowri Wedding Site
   ======================================== */

// ---- 1. FALLING PETALS (Canvas) ----
(function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  const ctx    = canvas.getContext('2d');
  let petals   = [];
  const COLORS = ['#ffb7c5', '#ffc8d4', '#ff9eb5', '#ffa5a5', '#ffcba4', '#ffefd5'];
  const SHAPES = ['🌸', '🌺', '🪷', '✿', '❀'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = -20;
      this.size  = Math.random() * 14 + 8;
      this.speed = Math.random() * 1.5 + 0.5;
      this.sway  = Math.random() * 0.8 + 0.3;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.opacity = Math.random() * 0.6 + 0.3;
    }
    update(t) {
      this.y += this.speed;
      this.x += Math.sin(t * 0.001 + this.swayOffset) * this.sway;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.shape, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < 28; i++) {
    const p = new Petal();
    p.y = Math.random() * window.innerHeight;
    petals.push(p);
  }

  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();


// ---- 2. NAVBAR SCROLL ----
(function initNav() {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  ham.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();


// ---- 3. DRAGGABLE INVITATION CARD ----
(function initDraggableCard() {
  const card       = document.getElementById('inviteCard');
  const scene      = document.getElementById('inviteScene');
  const dragHint   = document.getElementById('dragHint');
  let isDragging   = false;
  let startX, startY, origLeft, origTop;
  let moved        = false;
  let dragThreshold = 5;

  // Center the card initially
  function centerCard() {
    const sr = scene.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    card.style.left = ((sr.width - cw) / 2) + 'px';
    card.style.top  = ((sr.height - ch) / 2) + 'px';
  }
  centerCard();
  window.addEventListener('resize', centerCard);

  // Mouse drag
  card.addEventListener('mousedown', (e) => {
    isDragging = true;
    moved      = false;
    startX     = e.clientX;
    startY     = e.clientY;
    origLeft   = card.offsetLeft;
    origTop    = card.offsetTop;
    card.style.transition = 'none';
    card.style.zIndex = '100';
    dragHint.style.opacity = '0';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) moved = true;
    card.style.left = (origLeft + dx) + 'px';
    card.style.top  = (origTop + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
    card.style.transition = 'box-shadow 0.3s ease, filter 0.3s ease';
  });

  // Touch drag
  card.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    isDragging = true;
    moved      = false;
    startX     = t.clientX;
    startY     = t.clientY;
    origLeft   = card.offsetLeft;
    origTop    = card.offsetTop;
    card.style.transition = 'none';
    card.style.zIndex = '100';
    dragHint.style.opacity = '0';
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) moved = true;
    card.style.left = (origLeft + dx) + 'px';
    card.style.top  = (origTop + dy) + 'px';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', () => { isDragging = false; });

  // Flip on click (only if not dragged)
  card.addEventListener('click', () => {
    if (!moved) card.classList.toggle('flipped');
  });
})();


// ---- 4. COUNTDOWN TIMER ----
(function initCountdown() {
  const wedding = new Date('2026-11-01T10:30:00+05:30');

  function update() {
    const now  = new Date();
    const diff = wedding - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent    = '000';
      document.getElementById('cd-hours').textContent   = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent    = String(days).padStart(3, '0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
})();


// ---- 5. SCROLL ANIMATIONS (Intersection Observer) ----
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.event-card, .family-card, .gallery-item, .cd-unit, .venue-info-box, .venue-map-container').forEach(el => {
    observer.observe(el);
  });
})();


// ---- 6. SMOOTH PARALLAX on hero ----
(function initParallax() {
  const hero = document.querySelector('.hero');
  const illustration = document.querySelector('.couple-illustration');
  if (!illustration) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      illustration.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });
})();


// ---- 7. VIDEO UPLOAD ----
(function initVideoUpload() {
  const placeholder = document.getElementById('videoPlaceholder');
  const videoEl     = document.getElementById('weddingVideo');
  const uploadInput = document.getElementById('videoUpload');

  if (!placeholder) return;

  placeholder.addEventListener('click', () => uploadInput.click());

  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.style.display = 'block';
    placeholder.style.display = 'none';
  });

  // Drag-and-drop video
  placeholder.addEventListener('dragover', (e) => {
    e.preventDefault();
    placeholder.style.borderColor = 'var(--gold)';
  });
  placeholder.addEventListener('dragleave', () => {
    placeholder.style.borderColor = 'rgba(201,168,76,0.5)';
  });
  placeholder.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.style.display = 'block';
    placeholder.style.display = 'none';
  });
})();


// ---- 8. RSVP FORM ----
(function initRSVP() {
  const form    = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-rsvp');
    btn.textContent = '⏳ Sending...';
    btn.disabled = true;

    setTimeout(() => {
      success.style.display = 'block';
      form.reset();
      btn.textContent = '💌 Confirm RSVP';
      btn.disabled = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  });
})();


// ---- 9. 3D TILT EFFECT on invitation card ----
(function initTilt() {
  const card = document.getElementById('inviteCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    if (card.style.cursor === 'grabbing') return;
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const rx     = ((e.clientY - cy) / (rect.height / 2)) * 8;
    const ry     = ((e.clientX - cx) / (rect.width  / 2)) * -8;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
})();


// ---- 10. NAV SMOOTH HIGHLIGHT ----
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--maroon)' : '';
    });
  }, { passive: true });
})();
