# 🏛️ Paroisse Saint-Benoît - Site Web

Un site web simple et moderne pour la Paroisse Saint-Benoît, créé avec HTML, CSS et JavaScript vanilla.

## 🚀 Structure du Projet

```
📁 Projet/
├── 📄 index.html          # Page d'accueil
├── 📄 actualites.html     # Page des actualités
├── 📄 apropos.html        # Page à propos
├── 📄 contact.html        # Page de contact
├── 📁 css/
│   └── 📄 style.css       # Styles CSS principaux
├── 📁 js/
│   └── 📄 script.js       # JavaScript interactif
└── 📄 README.md           # Documentation
```

## ✨ Fonctionnalités

### 🎨 Design
- **Design moderne et responsive** - Fonctionne sur tous les appareils
- **Navigation intuitive** - Menu mobile avec hamburger
- **Animations fluides** - Effets au scroll et transitions
- **Couleurs harmonieuses** - Palette adaptée à l'identité paroissiale

### 📱 Pages
- **Accueil** - Présentation, horaires des messes, services
- **Actualités** - News avec système de filtrage par catégorie
- **À propos** - Histoire, mission, valeurs et équipe
- **Contact** - Coordonnées, formulaire et informations pratiques

### 🔧 Interactivité
- **Menu mobile responsive**
- **Filtrage des actualités** par catégorie
- **Formulaires fonctionnels** avec validation
- **Newsletter** avec inscription
- **Animations au scroll**
- **Notifications** pour les actions utilisateur

## 🎯 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec variables CSS
- **JavaScript ES6** - Interactivité sans framework
- **Font Awesome** - Icônes vectorielles
- **Images Unsplash** - Photos de qualité

## 🚀 Installation et Utilisation

1. **Télécharger** ou cloner le projet
2. **Ouvrir** `index.html` dans un navigateur web
3. **C'est tout !** Le site fonctionne directement

📖 **Guide détaillé** : Consultez [INSTALLATION.md](INSTALLATION.md) pour les instructions complètes

### Pour un serveur local (optionnel) :
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000
```

## 🎨 Personnalisation

### Couleurs
Modifiez les variables CSS dans `css/style.css` :
```css
:root {
  --primary: #2c5530;    /* Vert principal */
  --secondary: #d4af37;  /* Or liturgique */
  --light: #f8f9fa;      /* Arrière-plan clair */
  --dark: #2c3e50;       /* Texte sombre */
}
```

### Contenu
- **Textes** : Modifiez directement dans les fichiers HTML
- **Images** : Remplacez les URLs Unsplash par vos propres images
- **Coordonnées** : Mettez à jour les informations de contact

### Actualités
Ajoutez de nouvelles actualités dans `actualites.html` :
```html
<div class="news-card" data-category="votre-categorie">
  <img src="votre-image.jpg" alt="Description">
  <div class="news-content">
    <span class="news-category">Catégorie</span>
    <h3>Titre de l'actualité</h3>
    <p class="news-date"><i class="far fa-calendar"></i> Date</p>
    <p>Description de l'actualité...</p>
    <a href="#" class="read-more">Lire la suite →</a>
  </div>
</div>
```

## 📱 Responsive Design

Le site s'adapte automatiquement à tous les écrans :
- **Desktop** (1200px+) - Mise en page complète
- **Tablette** (768px - 1199px) - Adaptation des grilles
- **Mobile** (320px - 767px) - Menu hamburger et colonnes uniques

## 🔧 Fonctionnalités JavaScript

### Menu Mobile
```javascript
// Activation automatique du menu hamburger
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
```

### Filtrage Actualités
```javascript
// Filtrage dynamique par catégorie
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');
```

### Formulaires
```javascript
// Validation et soumission des formulaires
const contactForm = document.getElementById('contactForm');
```

## 🎯 Optimisations SEO

- **Métadonnées** complètes sur chaque page
- **Structure HTML sémantique** (header, nav, main, section, footer)
- **Attributs alt** pour toutes les images
- **Liens internes** optimisés
- **Temps de chargement** rapide

## 🌟 Points Forts

✅ **Simple à utiliser** - Aucune installation complexe  
✅ **Léger et rapide** - Pas de framework lourd  
✅ **Moderne** - Design actuel et professionnel  
✅ **Accessible** - Navigation claire et intuitive  
✅ **Responsive** - Fonctionne partout  
✅ **Personnalisable** - Facile à modifier  

## 📞 Support

Pour toute question ou personnalisation, n'hésitez pas à demander de l'aide !

---

*Développé avec ❤️ pour la Paroisse Saint-Benoît*