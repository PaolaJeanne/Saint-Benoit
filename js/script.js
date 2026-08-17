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
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
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
    // FORMULAIRE DE CONTACT
    // ==============================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validation avancée
            if (!validateContactForm(name, email, subject, message)) {
                return;
            }
            
            // Simulation d'envoi avec loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification(`Merci ${name} ! Votre message a été envoyé avec succès.`, 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
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

// Validation avancée du formulaire de contact
function validateContactForm(name, email, subject, message) {
    if (!name || name.length < 2) {
        showNotification('Le nom doit contenir au moins 2 caractères.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide.', 'error');
        return false;
    }
    
    if (!subject) {
        showNotification('Veuillez sélectionner un sujet.', 'error');
        return false;
    }
    
    if (!message || message.length < 10) {
        showNotification('Le message doit contenir au moins 10 caractères.', 'error');
        return false;
    }
    
    return true;
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

// Valider un email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}