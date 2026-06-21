/* =====================================================
   EXTRAVAGANT GRACE EVENTS, script.js (Luxury Edition)
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
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.classList.add('open');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
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

/* ── Testimonials ── */
(function () {
  const quotes = [
    { text: "She turned my daughter's sweet sixteen into something straight out of a fairy tale. Every single detail was perfect. I didn't have to worry about a single thing.", name: "Toyin M.", event: "Sweet Sixteen, Houston, TX" },
    { text: "Our wedding was everything we dreamed of and more. Extravagant Grace handled everything with such professionalism and elegance. Our guests are still talking about it.", name: "Amara & Chidi", event: "Wedding, Houston, TX" },
    { text: "I've worked with event planners before, but nothing compares to this level of dedication. Extravagant isn't just a name, it is a promise she keeps every single time.", name: "Rhonda O.", event: "Corporate Gala, Houston, TX" },
    { text: "My baby shower was absolutely stunning. The décor, the flow, the food, everything was seamless. I felt like royalty on my special day.", name: "Ngozi B.", event: "Baby Shower, Katy, TX" },
    { text: "She understood my vision even before I could fully articulate it. The event felt deeply personal and utterly luxurious at the same time. Extraordinary woman.", name: "Fatima K.", event: "Anniversary Dinner, Houston, TX" },
  ];

  const quoteEl = document.getElementById('testiQuote');
  const nameEl  = document.getElementById('testiName');
  const eventEl = document.getElementById('testiEvent');
  const thumbs  = document.querySelectorAll('.testi-thumb');
  if (!quoteEl) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    thumbs[current].classList.remove('active');
    current = (idx + quotes.length) % quotes.length;

    quoteEl.classList.add('switching');
    setTimeout(() => {
      quoteEl.textContent = quotes[current].text;
      nameEl.textContent  = quotes[current].name;
      eventEl.textContent = quotes[current].event;
      quoteEl.classList.remove('switching');
    }, 350);

    thumbs[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 7000);
  }

  thumbs.forEach(t => t.addEventListener('click', () => goTo(parseInt(t.dataset.index))));

  timer = setInterval(() => goTo(current + 1), 7000);
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
