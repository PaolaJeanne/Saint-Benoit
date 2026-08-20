// ==============================
// PAROISSE SAINT-BENOÎT - JAVASCRIPT
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==============================
    // MENU MOBILE
    // ==============================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animation de l'icône hamburger
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // ==============================
    // FILTRES ACTUALITÉS
    // ==============================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active et aria-pressed de tous les boutons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filter = this.getAttribute('data-filter');
            
            newsCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
            
            // Compter les actualités visibles
            const visibleCards = document.querySelectorAll('.news-card[style*="block"]').length;
            updateNewsCount(visibleCards);
        });
    });
    
    // ==============================
    // FORMULAIRE DE CONTACT (Formspree)
    // ==============================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('form-success');
    
    // Afficher le message de succès si redirigé avec ?merci=1
    if (formSuccess && window.location.search.includes('merci=1')) {
        if (contactForm) contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
    }
    
    // Validation côté client avant soumission à Formspree
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = this.name.value;
            const email = this.email.value;
            const subject = this.subject.value;
            const message = this.message.value;
            
            if (!name || name.trim().length < 2) {
                e.preventDefault();
                showNotification('Le nom doit contenir au moins 2 caractères.', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                e.preventDefault();
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            if (!subject) {
                e.preventDefault();
                showNotification('Veuillez sélectionner un sujet.', 'error');
                return;
            }
            if (!message || message.trim().length < 10) {
                e.preventDefault();
                showNotification('Le message doit contenir au moins 10 caractères.', 'error');
                return;
            }
            
            // Feedback visuel pendant l'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
        });
    }
    
    // ==============================
    // NEWSLETTER
    // ==============================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (!isValidEmail(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }
            
            // Simulation d'inscription
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Inscription...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Inscription à la newsletter réussie !', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    });
    
    // ==============================
    // ANIMATIONS AU SCROLL
    // ==============================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.card, .news-card, .team-member, .messe-card, .value-item');
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // ==============================
    // SCROLL SMOOTH
    // ==============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ==============================
    // NAVIGATION ACTIVE
    // ==============================
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // ==============================
    // BOUTON RETOUR EN HAUT
    // ==============================
    createBackToTopButton();
    
    // ==============================
    // HORLOGE TEMPS RÉEL (pour les horaires)
    // ==============================
    if (document.querySelector('.current-time')) {
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    }
    
    // ==============================
    // DÉTECTION HORS LIGNE
    // ==============================
    handleOfflineStatus();
});

// ==============================
// FONCTIONS UTILITAIRES
// ==============================

// Valider un email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mettre à jour le compteur d'actualités
function updateNewsCount(count) {
    const existingCounter = document.querySelector('.news-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    if (count === 0) {
        const filtersContainer = document.querySelector('.filters');
        if (filtersContainer) {
            const counter = document.createElement('p');
            counter.className = 'news-counter';
            counter.textContent = 'Aucune actualité trouvée pour cette catégorie.';
            counter.style.textAlign = 'center';
            counter.style.color = 'var(--gray)';
            counter.style.marginTop = '1rem';
            filtersContainer.parentNode.insertBefore(counter, filtersContainer.nextSibling);
        }
    }
}

// Créer le bouton retour en haut
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Retour en haut de page');
    
    // Styles du bouton
    const styles = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--secondary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: var(--shadow);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
            z-index: 1000;
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .back-to-top:hover {
            background: #b8941f;
            transform: translateY(-2px);
        }
    `;
    
    if (!document.querySelector('#back-to-top-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'back-to-top-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(backToTop);
    
    // Afficher/masquer selon le scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Action du bouton
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mettre à jour l'heure actuelle (seulement si l'élément existe dans la page)
function updateCurrentTime() {
    const timeElements = document.querySelectorAll('.current-time');
    if (timeElements.length === 0) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    timeElements.forEach(el => el.textContent = timeString);
}

// Gérer le statut hors ligne
function handleOfflineStatus() {
    function updateOnlineStatus() {
        if (navigator.onLine) {
            hideOfflineNotification();
        } else {
            showOfflineNotification();
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.innerHTML = `
        <i class="fas fa-wifi"></i>
        <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
    `;
    
    const styles = `
        #offline-notification {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc3545;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
    `;
    
    if (!document.querySelector('#offline-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'offline-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    if (!document.querySelector('#offline-notification')) {
        document.body.appendChild(notification);
    }
}

function hideOfflineNotification() {
    const notification = document.querySelector('#offline-notification');
    if (notification) {
        notification.remove();
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer l'élément notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Fermer la notification">&times;</button>
    `;
    
    // Ajouter les styles si pas encore fait
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                box-shadow: var(--shadow);
            }
            .notification-success { background: #28a745; }
            .notification-error { background: #dc3545; }
            .notification-info { background: #17a2b8; }
            .notification-warning { background: #ffc107; color: #212529; }
            .notification button {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.8;
            }
            .notification button:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}


// ==============================
// API DYNAMIQUE — CHARGEMENT DEPUIS LE BACKEND
// ==============================

// Quand servi par Express (port 3000) : même origine → ''
// Quand ouvert directement en file:// ou autre port → pointer vers le serveur local
const API_BASE = (window.location.protocol === 'file:' || window.location.port !== '3000')
  ? 'http://localhost:3000'
  : '';

// ---- Horaires des messes ----
async function loadMesses() {
  const container = document.getElementById('messes-dynamic');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/messes`);
    if (!res.ok) throw new Error('API indisponible');
    const messes = await res.json();

    if (messes.length === 0) {
      container.innerHTML = '<p class="messes-fallback" style="padding:2rem;text-align:center;color:var(--text-gray)">Aucun horaire disponible pour le moment.</p>';
      return;
    }

    // Regrouper par jour (en conservant l'ordre)
    const grouped = {};
    const ordre = [];
    messes.forEach(m => {
      if (!grouped[m.jour]) { grouped[m.jour] = []; ordre.push(m.jour); }
      grouped[m.jour].push(m);
    });

    const icons = {
      'Dimanche':          'fa-sun',
      'Samedi':            'fa-moon',
      'Lundi - Vendredi':  'fa-calendar-week',
      'Mercredi':          'fa-pray',
      'Adoration':         'fa-pray'
    };

    container.innerHTML = ordre.map(jour => {
      const items = grouped[jour];
      const icon = icons[jour] || 'fa-clock';

      // Plusieurs créneaux → liste compacte
      const timesHtml = items.length > 1
        ? `<div class="messe-times-list">${items.map(m => `
            <div class="messe-time">
              <span>${m.type}${m.intention ? ` — ${m.intention}` : ''}</span>
              <strong>${m.heure}</strong>
            </div>`).join('')}
          </div>`
        // Un seul créneau → badge heure mis en avant
        : `<div class="messe-time">
            <span>${items[0].type}${items[0].intention ? ` — ${items[0].intention}` : ''}</span>
          </div>`;

      const badgeHtml = items.length === 1
        ? `<span class="messe-heure-badge">${items[0].heure}</span>`
        : '';

      return `
        <div class="messe-card">
          <div class="card-icon"><i class="fas ${icon}"></i></div>
          <div>
            <h3>${jour}</h3>
            ${timesHtml}
          </div>
          ${badgeHtml}
        </div>`;
    }).join('');

  } catch (err) {
    console.warn('Impossible de charger les messes depuis l\'API :', err.message);
    container.closest('section') && (container.style.display = 'none');
  }
}

// ---- Actualités (section accueil — 3 dernières) ----
async function loadActualitesAccueil() {
  const container = document.getElementById('actualites-dynamic');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/actualites`);
    if (!res.ok) throw new Error('API indisponible');
    const articles = await res.json();

    if (articles.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--gray)">Aucune actualité disponible.</p>';
      return;
    }

    const LABELS = {
      'vie-paroissiale': 'Vie paroissiale',
      'projets': 'Projets',
      'jeunes': 'Jeunes',
      'chorale': 'Chorales'
    };

    container.innerHTML = articles.slice(0, 3).map(a => `
      <div class="news-card">
        <img src="img/${a.image || 'og-image.jpg'}" alt="${a.titre}" width="400" height="220" loading="lazy"
             onerror="this.src='img/og-image.jpg'">
        <div class="news-content">
          <span class="news-category">${LABELS[a.categorie] || a.categorie}</span>
          <h3>${a.titre}</h3>
          <p>${a.chapeau || ''}</p>
          <a href="actualites.html" class="read-more">Lire la suite →</a>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.warn('Impossible de charger les actualités depuis l\'API :', err.message);
    container.style.display = 'none';
  }
}

// ---- Événements (section accueil) ----
async function loadEvenementsAccueil() {
  const container = document.getElementById('evenements-dynamic');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/evenements`);
    if (!res.ok) throw new Error('API indisponible');
    const events = await res.json();

    if (events.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--gray)">Aucun événement à venir.</p>';
      return;
    }

    container.innerHTML = events.slice(0, 3).map(ev => {
      // Extraire jour/mois pour l'affichage de la date
      const parts = (ev.date_debut || '').split(' ');
      const day = parts[0] || '—';
      const month = parts.slice(1).join(' ').toUpperCase() || '';
      return `
        <div class="event-card">
          <div class="event-date">
            <span class="day">${day}</span>
            <span class="month">${month}</span>
          </div>
          <div class="event-content">
            <h3>${ev.titre}</h3>
            ${ev.lieu ? `<p><i class="fas fa-map-marker-alt"></i> ${ev.lieu}</p>` : ''}
            ${ev.description ? `<p>${ev.description}</p>` : ''}
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.warn('Impossible de charger les événements depuis l\'API :', err.message);
    container.style.display = 'none';
  }
}

// ---- Actualités (page actualites.html — liste complète) ----
async function loadActualitesPage() {
  const container = document.getElementById('actualites-list-dynamic');
  const loader = document.getElementById('actualites-loading');
  const fallback = document.getElementById('actualites-fallback');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/actualites`);
    if (!res.ok) throw new Error('API indisponible');
    const articles = await res.json();

    if (loader) loader.style.display = 'none';

    if (articles.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--gray)">Aucune actualité disponible.</p>';
      container.style.display = 'block';
      return;
    }

    const LABELS = {
      'vie-paroissiale': 'Vie paroissiale',
      'projets': 'Projets',
      'jeunes': 'Jeunes',
      'chorale': 'Chorales'
    };

    container.innerHTML = articles.map(a => `
      <div class="news-card" data-category="${a.categorie}">
        <img src="img/${a.image || 'og-image.jpg'}" alt="${a.titre}" width="400" height="220" loading="lazy"
             onerror="this.src='img/og-image.jpg'">
        <div class="news-content">
          <span class="news-category">${LABELS[a.categorie] || a.categorie}</span>
          <p class="news-date"><i class="far fa-calendar-alt" aria-hidden="true"></i> ${a.date_publication || ''}</p>
          <h3>${a.titre}</h3>
          <p>${a.chapeau || a.contenu || ''}</p>
          <a href="#" class="read-more" onclick="return false;">Lire la suite →</a>
        </div>
      </div>
    `).join('');

    container.style.display = 'grid';

    // Réappliquer les filtres après chargement
    initFiltresActualites();

  } catch (err) {
    console.warn('Impossible de charger les actualités depuis l\'API :', err.message);
    // Afficher le contenu de secours statique
    if (loader) loader.style.display = 'none';
    if (fallback) { fallback.style.display = 'grid'; initFiltresActualites(); }
  }
}

// ---- Filtres (réinitialisés après chargement dynamique) ----
function initFiltresActualites() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterBtns.forEach(btn => {
    btn.replaceWith(btn.cloneNode(true)); // retirer anciens listeners
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      const filter = this.getAttribute('data-filter');
      document.querySelectorAll('.news-card').forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = show ? 'block' : 'none';
      });
    });
  });
}

// ---- Lancement automatique selon la page ----
document.addEventListener('DOMContentLoaded', function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    loadMesses();
    loadActualitesAccueil();
    loadEvenementsAccueil();
  }

  if (page === 'actualites.html') {
    loadActualitesPage();
  }
});

// ==============================
// INFOS PAROISSE — cache global chargé une seule fois
// ==============================
let _infosCache = null;
async function getInfos() {
  if (_infosCache) return _infosCache;
  try {
    const res = await fetch(`${API_BASE}/api/infos`);
    if (res.ok) _infosCache = await res.json();
  } catch (e) { console.warn('Infos paroisse indisponibles'); }
  return _infosCache || {};
}

// ==============================
// FOOTER DYNAMIQUE — coordonnées + réseaux sociaux
// ==============================
async function loadFooter() {
  const infos = await getInfos();
  if (!infos || !Object.keys(infos).length) return;

  // Adresse, téléphone, email dans tous les footers
  document.querySelectorAll('.footer-adresse').forEach(el => {
    if (infos.adresse) el.textContent = infos.adresse;
  });
  document.querySelectorAll('.footer-telephone').forEach(el => {
    if (infos.telephone) el.textContent = infos.telephone;
  });
  document.querySelectorAll('.footer-email').forEach(el => {
    if (infos.email) el.textContent = infos.email;
  });
  document.querySelectorAll('.footer-description').forEach(el => {
    if (infos.footer_description) el.textContent = infos.footer_description;
  });
  document.querySelectorAll('.footer-copyright').forEach(el => {
    if (infos.copyright) el.textContent = `© ${infos.copyright}`;
  });

  // Réseaux sociaux
  const fb = document.querySelector('.social-facebook');
  if (fb && infos.facebook) fb.href = infos.facebook;
  const ig = document.querySelector('.social-instagram');
  if (ig && infos.instagram) ig.href = infos.instagram;
  const yt = document.querySelector('.social-youtube');
  if (yt && infos.youtube) yt.href = infos.youtube;
}

// ==============================
// HERO — citation et sous-titre
// ==============================
async function loadHero() {
  const container = document.getElementById('hero-dynamic');
  if (!container) return;
  const infos = await getInfos();
  if (!infos) return;
  const citation = container.querySelector('.hero-citation');
  const soustitre = container.querySelector('.hero-soustitre');
  if (citation && infos.hero_citation) citation.textContent = infos.hero_citation;
  if (soustitre && infos.hero_soustitre) soustitre.textContent = infos.hero_soustitre;
}

// ==============================
// SERVICES — page accueil
// ==============================
async function loadServices() {
  const container = document.getElementById('services-dynamic');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/services`);
    if (!res.ok) throw new Error();
    const services = await res.json();
    if (!services.length) return;
    container.innerHTML = services.map(s => `
      <div class="card">
        <i class="fas ${s.icone || 'fa-church'} card-icon"></i>
        <h3>${s.titre}</h3>
        <p>${s.description || ''}</p>
      </div>`).join('');
  } catch (e) { console.warn('Services indisponibles'); }
}

// ==============================
// ÉQUIPE PASTORALE
// ==============================
async function loadEquipe() {
  const container = document.getElementById('equipe-dynamic');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/equipe`);
    if (!res.ok) throw new Error();
    const equipe = await res.json();
    if (!equipe.length) { container.innerHTML = '<p style="text-align:center;color:var(--gray)">Aucun membre enregistré.</p>'; return; }
    container.innerHTML = equipe.map(m => `
      <div class="team-member">
        <div class="member-photo">
          <img src="img/${m.photo || 'og-image.jpg'}" alt="Photo de ${m.nom}"
               width="280" height="280" loading="lazy"
               onerror="this.src='img/og-image.jpg'">
        </div>
        <div class="member-info">
          <h3>${m.nom}</h3>
          <p class="member-role">${m.role}</p>
          <p>${m.bio || ''}</p>
          ${m.email ? `<p class="team-email">${m.email}</p>` : ''}
        </div>
      </div>`).join('');
  } catch (e) {
    console.warn('Équipe indisponible');
    container.style.display = 'none';
  }
}

// ==============================
// HISTOIRE — section À propos
// ==============================
async function loadHistoire() {
  const infos = await getInfos();
  if (!infos) return;
  const lead = document.getElementById('histoire-lead');
  const texte = document.getElementById('histoire-texte');
  const img = document.getElementById('histoire-image');
  if (lead && infos.histoire_lead) lead.textContent = infos.histoire_lead;
  if (texte && infos.histoire_texte) texte.textContent = infos.histoire_texte;
  if (img && infos.histoire_image) { img.src = `img/${infos.histoire_image}`; img.onerror = () => {}; }
}

// ==============================
// MOUVEMENTS — page mouvements.html
// ==============================
async function loadMouvements() {
  const sections = {
    jeunes:   document.getElementById('mouvements-jeunes-dynamic'),
    adultes:  document.getElementById('mouvements-adultes-dynamic'),
    chorales: document.getElementById('mouvements-chorales-dynamic'),
    services: document.getElementById('mouvements-services-dynamic')
  };
  if (!Object.values(sections).some(Boolean)) return;

  try {
    const res = await fetch(`${API_BASE}/api/mouvements`);
    if (!res.ok) throw new Error();
    const mvts = await res.json();
    if (!mvts.length) return;

    const grouped = { jeunes: [], adultes: [], chorales: [], services: [] };
    mvts.forEach(m => { if (grouped[m.categorie]) grouped[m.categorie].push(m); });

    Object.entries(grouped).forEach(([cat, list]) => {
      const container = sections[cat];
      if (!container || !list.length) return;
      container.innerHTML = list.map(m => `
        <div class="movement-card">
          <div class="movement-header">
            <div class="movement-icon"><i class="fas ${m.icone || 'fa-users'}"></i></div>
            <div class="movement-title-wrap">
              <h3>${m.nom}</h3>
              ${m.tranche_age ? `<p class="movement-age">${m.tranche_age}</p>` : ''}
            </div>
          </div>
          <div class="movement-content">
            <p>${m.description || ''}</p>
            ${(m.horaire || m.lieu || m.responsable) ? `
            <div class="movement-details">
              ${m.horaire ? `<p><i class="fas fa-calendar"></i> ${m.horaire}</p>` : ''}
              ${m.lieu ? `<p><i class="fas fa-map-marker-alt"></i> ${m.lieu}</p>` : ''}
              ${m.responsable ? `<p><i class="fas fa-user"></i> ${m.responsable}</p>` : ''}
            </div>` : ''}
            <a href="contact.html" class="movement-link">Nous contacter →</a>
          </div>
        </div>`).join('');
    });
  } catch (e) {
    console.warn('Mouvements indisponibles');
    Object.values(sections).forEach(s => s && (s.style.display = 'none'));
  }
}

// ==============================
// TÉMOIGNAGES — page mouvements.html
// ==============================
async function loadTemoignages() {
  const container = document.getElementById('temoignages-dynamic');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/temoignages`);
    if (!res.ok) throw new Error();
    const temos = await res.json();
    if (!temos.length) { container.innerHTML = ''; return; }
    container.innerHTML = temos.map(t => `
      <div class="testimonial">
        <blockquote>"${t.texte}"</blockquote>
        <cite>— ${t.auteur}${t.mouvement ? `, ${t.mouvement}` : ''}</cite>
      </div>`).join('');
  } catch (e) {
    console.warn('Témoignages indisponibles');
    container.style.display = 'none';
  }
}

// ==============================
// CONTACT — coordonnées dynamiques
// ==============================
async function loadContact() {
  const infos = await getInfos();
  if (!infos) return;

  const map = {
    'contact-adresse':          infos.adresse,
    'contact-telephone':        [infos.telephone, infos.telephone2].filter(Boolean).join(' / '),
    'contact-email':            infos.email,
    'contact-horaires':         infos.horaires_secretariat,
    'contact-email-mouvements': infos.email_mouvements
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  });

  // Carte — mettre à jour l'iframe si les coordonnées changent
  const iframe = document.getElementById('carte-iframe');
  if (iframe && infos.carte_lat && infos.carte_lng) {
    const lat = infos.carte_lat, lng = infos.carte_lng;
    const bbox = `${parseFloat(lng)-0.03}%2C${parseFloat(lat)-0.03}%2C${parseFloat(lng)+0.03}%2C${parseFloat(lat)+0.03}`;
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }

  // Équipe sur la page contact
  const equipeContainer = document.getElementById('equipe-contact-dynamic');
  if (equipeContainer) {
    try {
      const res = await fetch(`${API_BASE}/api/equipe`);
      if (res.ok) {
        const equipe = await res.json();
        if (equipe.length) {
          equipeContainer.innerHTML = equipe.map(m => `
            <div class="team-member">
              <div class="member-photo">
                <img src="img/${m.photo || 'og-image.jpg'}" alt="Photo de ${m.nom}"
                     width="280" height="280" loading="lazy" onerror="this.src='img/og-image.jpg'">
              </div>
              <div class="member-info">
                <h3>${m.nom}</h3>
                <p class="member-role">${m.role}</p>
                ${m.email ? `<p class="team-email">${m.email}</p>` : ''}
              </div>
            </div>`).join('');
        }
      }
    } catch (e) { equipeContainer.style.display = 'none'; }
  }
}

// ==============================
// LANCEMENT PAR PAGE
// ==============================
document.addEventListener('DOMContentLoaded', function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Footer sur toutes les pages
  loadFooter();

  if (page === 'index.html' || page === '') {
    loadMesses();
    loadActualitesAccueil();
    loadEvenementsAccueil();
    loadHero();
    loadServices();
  }
  if (page === 'actualites.html') {
    loadActualitesPage();
  }
  if (page === 'apropos.html') {
    loadEquipe();
    loadHistoire();
  }
  if (page === 'mouvements.html') {
    loadMouvements();
    loadTemoignages();
  }
  if (page === 'contact.html') {
    loadContact();
  }
});
