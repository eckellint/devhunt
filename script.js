// ---------- Thème clair / sombre ----------
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme){
  if(theme === 'light'){
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
  localStorage.setItem('portfolio-theme', theme);
}

// Thème sauvegardé, sinon préférence système
const saved = localStorage.getItem('portfolio-theme');
if(saved){
  applyTheme(saved);
} else if(window.matchMedia('(prefers-color-scheme: light)').matches){
  applyTheme('light');
}

themeToggle?.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
});

// ---------- Menu mobile ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Lien actif au scroll ----------
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

// ---------- Année du footer ----------
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
