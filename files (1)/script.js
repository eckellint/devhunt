/* =========================================================
   BOBO SQUAD — script.js
   Nav sticky + menu mobile, scroll reveal, compteur animé,
   membres (carousel), galerie + lightbox + filtres,
   formulaire de contact avec validation.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAV : effet au scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- 2. Menu burger (mobile) ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- 3. Lien actif selon la section visible ---------- */
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- 4. Reveal au scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 5. Compteurs animés (stat-bar) ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCount);
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const statBar = document.getElementById('statBar');
  if (statBar) statObserver.observe(statBar);

  /* ---------- 6. Membres du squad ---------- */
  const members = [
    { name: 'Romeo',   role: 'Fondateur' },
    { name: 'Ludget',   role: 'Fondateur' },
    { name: 'Luc',  role: 'Fondateur' },
    { name: 'Eckellin',  role: 'Fondateur' },
    { name: 'Lewis',   role: 'Fondateur' },
    { name: 'Dolio',   role: 'Fondateur' },
    { name: 'Julio',   role: 'Membre' },
     { name: 'Kepassa',   role: 'Membre' },
      { name: 'Gabriella',   role: 'Membre' },
  ];
  const track = document.getElementById('membersTrack');
  track.innerHTML = members.map(m => `
    <article class="member-card">
      <div class="avatar">${m.name.slice(0,2).toUpperCase()}</div>
      <p class="member-name">${m.name}</p>
      <p class="member-role">${m.role}</p>
    </article>
  `).join('');

  const prevBtn = document.getElementById('prevMember');
  const nextBtn = document.getElementById('nextMember');
  const scrollAmount = 260;
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount, behavior: 'smooth' }));

  /* ---------- 7. Galerie + filtres + lightbox ---------- */
  const photos = [
    { cap: 'Balade du quartier', cat: 'rue' },
    { cap: 'Session photo squad', cat: 'squad' },
    { cap: 'Sortie du dimanche', cat: 'rue' },
    { cap: 'Anniversaire BOBO', cat: 'event' },
    { cap: 'Match amical', cat: 'event' },
    { cap: 'Tous ensemble', cat: 'squad' },
    { cap: 'Coin de rue favori', cat: 'rue' },
    { cap: 'Soirée squad', cat: 'squad' },
  ];
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = photos.map((p, i) => `
    <div class="grid-item" data-cat="${p.cat}" data-index="${i}">
      <div class="ph"><span class="cap mono">${p.cap}</span></div>
    </div>
  `).join('');

  /* Filtres */
  const filterBtns = document.querySelectorAll('.filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.grid-item').forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    lbContent.textContent = photos[currentIndex].cap;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  const showDelta = (delta) => {
    currentIndex = (currentIndex + delta + photos.length) % photos.length;
    lbContent.textContent = photos[currentIndex].cap;
  };

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.grid-item');
    if (!item) return;
    openLightbox(parseInt(item.dataset.index, 10));
  });
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => showDelta(-1));
  lbNext.addEventListener('click', () => showDelta(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showDelta(-1);
    if (e.key === 'ArrowRight') showDelta(1);
  });

  /* ---------- 8. Formulaire de contact ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const setError = (fieldId, msg) => {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(`err-${fieldId}`);
    field.closest('.field').classList.toggle('invalid', Boolean(msg));
    errEl.textContent = msg || '';
  };

  const validate = () => {
    let valid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name.length < 2) { setError('name', 'Entre au moins 2 caractères.'); valid = false; }
    else setError('name', '');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('email', 'Adresse email invalide.'); valid = false; }
    else setError('email', '');

    if (message.length < 10) { setError('message', 'Dis-nous en un peu plus (10 caractères min.).'); valid = false; }
    else setError('message', '');

    return valid;
  };

  ['name', 'email', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      if (document.getElementById(id).closest('.field').classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      status.textContent = 'Corrige les champs en rouge avant d\'envoyer.';
      return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Envoi en cours...';

    setTimeout(() => {
      status.textContent = `Merci ${document.getElementById('name').value.trim()} ! Le squad revient vers toi très vite.`;
      form.reset();
      submitBtn.disabled = false;
    }, 900);
  });

  /* ---------- 9. Retour en haut ---------- */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
