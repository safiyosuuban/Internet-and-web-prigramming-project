// ============================================
// Portfolio — Main JavaScript
// ============================================

'use strict';

// ── Dark / Light Mode Toggle ─────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  document.cookie = `theme=${theme};path=/;max-age=${60*60*24*365}`;
}

function getCookie(name) {
  return document.cookie.split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1];
}

// Apply saved theme
const savedTheme = getCookie('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
  });
}

// ── Navbar Scroll ────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile Menu ──────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Active Nav Link on Scroll ────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Scroll Reveal ────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Skill Bars ───────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.querySelector('#about');
if (skillsSection) skillObserver.observe(skillsSection);

// ── Projects — AJAX Fetch ────────────────────
const projectsGrid   = document.getElementById('projectsGrid');
const filterTabs     = document.querySelectorAll('.filter-tab');
let   currentCategory = 'all';

async function loadProjects(category = 'all') {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = `<div class="loading-spinner">⟳ Loading projects…</div>`;

  try {
    const url = category === 'all'
      ? 'php/projects.php'
      : `php/projects.php?category=${category}`;

    const res  = await fetch(url);
    const data = await res.json();

    if (!data.length) {
      projectsGrid.innerHTML = `<p style="color:var(--text-muted);font-family:var(--font-mono)">No projects found.</p>`;
      return;
    }

    projectsGrid.innerHTML = data.map(p => createProjectCard(p)).join('');

  } catch (err) {
    // Fallback: use hardcoded sample data if PHP not available
    projectsGrid.innerHTML = getSampleProjects()
      .filter(p => category === 'all' || p.category === category)
      .map(p => createProjectCard(p)).join('');
  }
}

function createProjectCard(p) {
  const techTags = p.tech_stack.split(',')
    .map(t => `<span class="stack-tag">${t.trim()}</span>`).join('');

  const icons = { web: '🌐', backend: '⚙️', mobile: '📱', other: '🔧' };
  const icon  = icons[p.category] || '🔧';

  return `
    <article class="project-card reveal">
      <div class="project-thumb">${icon}</div>
      <div class="project-body">
        <p class="project-category">${p.category}</p>
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-stack">${techTags}</div>
        <div class="project-links">
          ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener">⌥ GitHub</a>` : ''}
          ${p.live_url && p.live_url !== '#' ? `<a href="${p.live_url}" target="_blank" rel="noopener">↗ Live Demo</a>` : ''}
        </div>
      </div>
    </article>`;
}

function getSampleProjects() {
  return [
    { id:1, title:'Full-Stack Portfolio', description:'A comprehensive portfolio built with HTML5, CSS3, JavaScript, PHP, and MySQL.', tech_stack:'HTML5, CSS3, JavaScript, PHP, MySQL', github_url:'https://github.com/safiyosuuban', live_url:'#', category:'web', featured:1 },
    { id:2, title:'Student Management System', description:'Web app to manage student records, grades, and attendance with CRUD operations.', tech_stack:'PHP, MySQL, Bootstrap', github_url:'https://github.com/safiyosuuban', live_url:'#', category:'backend', featured:1 },
    { id:3, title:'E-Commerce Product Catalog', description:'Dynamic product catalog with filtering, sorting, and a shopping cart.', tech_stack:'HTML5, CSS3, JavaScript', github_url:'https://github.com/safiyosuuban', live_url:'#', category:'web', featured:1 },
    { id:4, title:'REST API with Auth', description:'RESTful API with JWT authentication, rate limiting, and CRUD endpoints.', tech_stack:'PHP, MySQL, JWT', github_url:'https://github.com/safiyosuuban', live_url:'#', category:'backend', featured:0 },
  ];
}

// ── Filter Tabs ──────────────────────────────
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    loadProjects(currentCategory);
  });
});

// Initial load
loadProjects();

// ── Contact Form Validation & Submit ─────────
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

function validateField(field) {
  const val = field.value.trim();
  const group = field.closest('.form-group');
  let errEl = group.querySelector('.field-error');
  if (!errEl) { errEl = document.createElement('p'); errEl.className = 'field-error'; group.appendChild(errEl); }

  let error = '';
  if (field.name === 'name'    && val.length < 2)       error = 'Name must be at least 2 characters.';
  if (field.name === 'email'   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Enter a valid email address.';
  if (field.name === 'subject' && val.length < 3)       error = 'Subject is too short.';
  if (field.name === 'message' && val.length < 10)      error = 'Message must be at least 10 characters.';

  field.classList.toggle('error', !!error);
  errEl.textContent = error;
  return !error;
}

contactForm?.querySelectorAll('.form-control').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => validateField(field));
});

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fields = [...contactForm.querySelectorAll('.form-control')];
  const valid  = fields.map(f => validateField(f)).every(Boolean);
  if (!valid) return;

  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  const body = Object.fromEntries(new FormData(contactForm));

  try {
    const res  = await fetch('php/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      formMessage.className = 'form-message success';
      formMessage.textContent = data.message;
      contactForm.reset();
    } else {
      formMessage.className = 'form-message error';
      formMessage.textContent = (data.errors || ['Something went wrong.']).join(' ');
    }
  } catch {
    formMessage.className = 'form-message success';
    formMessage.textContent = 'Thank you! Message received. (Demo mode)';
    contactForm.reset();
  }

  submitBtn.textContent = 'Send Message';
  submitBtn.disabled = false;
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── Image Slider / Hero Typing Effect ────────
const typingEl = document.getElementById('typingText');
const roles = ['Full-Stack Developer', 'Problem Solver', 'CS Student', 'Web Enthusiast'];
let roleIndex = 0, charIndex = 0, deleting = false;

function typeRole() {
  if (!typingEl) return;
  const current = roles[roleIndex];
  typingEl.textContent = current.slice(0, charIndex) + (deleting ? '' : '|');

  if (!deleting && charIndex === current.length) {
    setTimeout(() => { deleting = true; }, 1800);
    setTimeout(typeRole, 2000);
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 400);
  } else {
    charIndex += deleting ? -1 : 1;
    setTimeout(typeRole, deleting ? 50 : 90);
  }
}
typeRole();

// ── DOM Event: Back to Top ───────────────────
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Helpers ──────────────────────────────────
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
