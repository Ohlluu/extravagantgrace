/* =====================================================
   EXTRAVAGANT GRACE EVENTS — script.js
   ===================================================== */

/* ── Gold Particle System ── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(H, H + 20),
      size: randomBetween(0.8, 2.5),
      speedY: randomBetween(0.3, 1),
      speedX: randomBetween(-0.3, 0.3),
      opacity: randomBetween(0.1, 0.5),
      life: 0,
      maxLife: randomBetween(200, 500),
    };
  }

  for (let i = 0; i < 60; i++) {
    const p = createParticle();
    p.y = randomBetween(0, H);
    p.life = randomBetween(0, p.maxLife);
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.life++;
      p.x += p.speedX;
      p.y -= p.speedY;
      const lifeRatio = p.life / p.maxLife;
      const fade = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity * fade})`;
      ctx.fill();
      if (p.life >= p.maxLife || p.y < -10) {
        particles[i] = createParticle();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Navbar Scroll Behavior ── */
(function () {
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Mobile Nav Toggle ── */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ── Scroll Reveal (IntersectionObserver) ── */
(function () {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));

  // Fire hero animations immediately
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
})();

/* ── Counting Animations ── */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();

/* ── Testimonials Slider ── */
(function () {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  const dotsWrap = document.getElementById('tDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;
  const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  function totalPages() {
    return Math.ceil(cards.length / visibleCount());
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, totalPages() - 1));
    const vc = visibleCount();
    const cardWidth = cards[0].offsetWidth + 32; // gap 2rem = 32px
    track.style.transform = `translateX(-${current * vc * cardWidth}px)`;
    cards.forEach((c, i) => {
      c.classList.toggle('active', Math.floor(i / vc) === current);
    });
    dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function next() { goTo(current + 1 >= totalPages() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? totalPages() - 1 : current - 1); }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
  goTo(0);
  resetAuto();

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });
})();

/* ── Smooth Parallax on Scroll ── */
(function () {
  const heroBg = document.querySelector('.hero-bg-image');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroBg.style.transform = `scale(1.08) translateY(${offset * 0.25}px)`;
  }, { passive: true });
})();

/* ── Active Nav Link Highlight ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${entry.target.id}`) {
            a.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();

/* ── Magnetic hover effect on CTA buttons ── */
(function () {
  document.querySelectorAll('.hero-btn, .contact-card').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s var(--ease-out)';
    });
  });
})();
