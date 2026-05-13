/* ============================================================
   NANA FOREX CARTEL — Landing Page
   main.js
   All interactivity, animations and dynamic content
   ============================================================ */

'use strict';

/* ── 1. Navbar scroll effect ────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── 2. Smooth scroll for nav links ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 3. Scroll reveal animation ─────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 4. Animated counter for member count ───────────────────── */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);

  const tick = () => {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start).toLocaleString() + '+';
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toLocaleString() + '+';
    }
  };
  requestAnimationFrame(tick);
}

const counterEl = document.getElementById('counterMembers');
if (counterEl) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(counterEl, 5000);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterObserver.observe(counterEl);
}

/* ── 5. Hero chart (animated line chart on canvas) ──────────── */
const canvas = document.getElementById('heroChart');

if (canvas) {
  const ctx = canvas.getContext('2d');

  // Chart data — realistic looking forex price movement
  const prices = [
    1.0780, 1.0795, 1.0788, 1.0802, 1.0815, 1.0809,
    1.0823, 1.0836, 1.0828, 1.0842, 1.0855, 1.0848,
    1.0862, 1.0875, 1.0869, 1.0882, 1.0895, 1.0888,
    1.0901, 1.0915, 1.0908, 1.0922, 1.0935, 1.0928,
    1.0942, 1.0954, 1.0948, 1.0962, 1.0975, 1.0969,
    1.0982, 1.0996, 1.0989, 1.1002, 1.1015, 1.0854
  ];

  let currentIndex = 0;
  let animationId;

  function drawChart(dataSlice) {
    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 10, right: 10, bottom: 10, left: 10 };

    ctx.clearRect(0, 0, W, H);

    if (dataSlice.length < 2) return;

    const min = Math.min(...dataSlice) - 0.0005;
    const max = Math.max(...dataSlice) + 0.0005;
    const range = max - min;

    const getX = i => pad.left + (i / (dataSlice.length - 1)) * (W - pad.left - pad.right);
    const getY = v => H - pad.bottom - ((v - min) / range) * (H - pad.top - pad.bottom);

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, 'rgba(212, 160, 23, 0.25)');
    gradient.addColorStop(1, 'rgba(212, 160, 23, 0)');

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(dataSlice[0]));
    dataSlice.forEach((v, i) => {
      if (i === 0) return;
      const cpX = (getX(i - 1) + getX(i)) / 2;
      ctx.bezierCurveTo(cpX, getY(dataSlice[i - 1]), cpX, getY(v), getX(i), getY(v));
    });
    ctx.lineTo(getX(dataSlice.length - 1), H);
    ctx.lineTo(getX(0), H);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(dataSlice[0]));
    dataSlice.forEach((v, i) => {
      if (i === 0) return;
      const cpX = (getX(i - 1) + getX(i)) / 2;
      ctx.bezierCurveTo(cpX, getY(dataSlice[i - 1]), cpX, getY(v), getX(i), getY(v));
    });
    ctx.strokeStyle = '#D4A017';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw end dot
    const lastX = getX(dataSlice.length - 1);
    const lastY = getY(dataSlice[dataSlice.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#D4A017';
    ctx.fill();

    // Pulsing ring around dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function animateChart() {
    if (currentIndex < prices.length) {
      drawChart(prices.slice(0, currentIndex + 1));
      currentIndex++;
      animationId = setTimeout(animateChart, 60);
    } else {
      // Loop with small delay
      setTimeout(() => {
        currentIndex = 0;
        animateChart();
      }, 3000);
    }
  }

  animateChart();
}

/* ── 6. Live price ticker simulation ─────────────────────────── */
const pairs = [
  { name: 'EUR/USD', base: 1.0854, dir: 1 },
  { name: 'GBP/USD', base: 1.2732, dir: -1 },
  { name: 'XAU/USD', base: 2345.40, dir: 1 },
  { name: 'GBP/JPY', base: 192.45, dir: 1 },
];

function updatePrices() {
  pairs.forEach(pair => {
    const change = (Math.random() * 0.0008 - 0.0004) * pair.dir;
    pair.base += change;
  });
}

setInterval(updatePrices, 2000);

/* ── 7. CTA button pulse effect ──────────────────────────────── */
const ctaBtn = document.querySelector('.btn-cta-large');

if (ctaBtn) {
  let pulseInterval = setInterval(() => {
    ctaBtn.style.boxShadow = '0 0 0 0 rgba(212, 160, 23, 0.5)';
    ctaBtn.animate([
      { boxShadow: '0 0 0 0 rgba(212, 160, 23, 0.5)' },
      { boxShadow: '0 0 0 20px rgba(212, 160, 23, 0)' }
    ], { duration: 1200, easing: 'ease-out' });
  }, 3000);
}

/* ── 8. Floating cards subtle entrance ──────────────────────── */
const floatingCards = document.querySelectorAll('.floating-card');

floatingCards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  setTimeout(() => {
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 800 + i * 200);
});

/* ── 9. Active nav link on scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

/* ── 10. Telegram button click tracking ─────────────────────── */
document.querySelectorAll('a[href*="t.me"]').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Telegram join clicked — track this conversion');
    // You can add Google Analytics or Facebook Pixel event here later:
    // fbq('track', 'Lead');
    // gtag('event', 'click', { event_category: 'CTA', event_label: 'Telegram Join' });
  });
});

/* ── 11. Page load progress bar ─────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #D4A017, #F0B429);
  z-index: 9999;
  width: 0%;
  transition: width 0.2s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
});
