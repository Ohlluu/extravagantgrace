/* =====================================================
   EXTRAVAGANT GRACE EVENTS — script.js (Luxury Edition)
   ===================================================== */

/* ── Preloader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    revealHero();
  }, 1800);
});


/* ── Navbar Scroll ── */
(function () {
  const nav = document.getElementById('navbar');
  const prog = document.querySelector('.hero-scroll-prog');
  const heroH = () => document.querySelector('.hero')?.offsetHeight || window.innerHeight;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (prog) {
      const pct = Math.min(y / heroH(), 1) * 100;
      prog.style.width = pct + '%';
    }
  }, { passive: true });
})();

/* ── Mobile Nav ── */
(function () {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ── Hero Reveal ── */
function revealHero() {
  const masks = document.querySelectorAll('.h-mask');
  masks.forEach((m, i) => {
    setTimeout(() => {
      m.classList.add('revealed');
      m.classList.add(['d1','d2','d3'][i] || '');
    }, i * 180);
  });
  document.querySelector('.hero-label')?.classList.add('visible');
  setTimeout(() => {
    document.querySelectorAll('.hero-bottom > *').forEach((el, i) => {
      setTimeout(() => el.style.opacity = '1', i * 120);
    });
  }, 600);
}

/* ── Scroll Reveal (IntersectionObserver) ── */
(function () {
  const els = document.querySelectorAll('.fade-up, .clip-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── Count-Up Animation ── */
(function () {
  const el = document.querySelector('.float-num[data-target]');
  if (!el) return;
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    io.disconnect();
  }, { threshold: 0.5 });
  io.observe(el);
})();

/* ── Testimonials Slider ── */
(function () {
  const track  = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  let current = 0;
  let timer;

  function buildDots() {
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 't-dot' + (i === current ? ' active' : '');
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });
  }

  function goTo(idx) {
    cards[current].classList.remove('active');
    dotsWrap.querySelectorAll('.t-dot')[current]?.classList.remove('active');
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    cards[current].classList.add('active');
    dotsWrap.querySelectorAll('.t-dot')[current]?.classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Swipe
  let sx = 0;
  track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = sx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();
  goTo(0);
})();

/* ── Parallax Hero Image ── */
(function () {
  const img = document.querySelector('.hero-img');
  if (!img) return;
  window.addEventListener('scroll', () => {
    img.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
})();

/* ── Magnetic Buttons ── */
(function () {
  document.querySelectorAll('.cta-pill, .service-row').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.06;
      const y = (e.clientY - r.top - r.height / 2) * 0.06;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

/* ── Active Nav Highlight ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${entry.target.id}`) a.style.color = 'var(--gold)';
      });
    });
  }, { threshold: 0.45 });
  sections.forEach(s => io.observe(s));
})();
