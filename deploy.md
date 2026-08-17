# Guide de Déploiement - Paroisse Saint-Benoît

## 🚀 Checklist Avant Déploiement

### 1. Contenu à Personnaliser
- [ ] **Photos de l'équipe** - Remplacer les images dans `img/`
- [ ] **Coordonnées** - Mettre à jour téléphone, email, adresse
- [ ] **Horaires des messes** - Vérifier et ajuster dans `index.html`
- [ ] **Actualités** - Ajouter du contenu récent
- [ ] **Informations paroissiales** - Adapter le texte à votre paroisse

### 2. Icônes et Images
- [ ] **Générer les icônes** - Suivre `img/generate-icons.md`
- [ ] **Favicon** - Créer `favicon.ico` 32x32px
- [ ] **Icônes PWA** - `icon-192.png` et `icon-512.png`
- [ ] **Image Open Graph** - `og-image.jpg` 1200x630px
- [ ] **Optimiser les photos** - Compresser les images existantes

### 3. Configuration
- [ ] **Domaine** - Mettre à jour les URLs dans `manifest.json`
- [ ] **Sitemap** - Modifier `sitemap.xml` avec votre domaine
- [ ] **Robots.txt** - Ajuster si nécessaire
- [ ] **Analytics** - Ajouter Google Analytics (optionnel)

## 🌐 Options d'Hébergement

### Option 1 : Hébergement Partagé (Recommandé)
**Avantages :** Simple, économique, support technique
**Hébergeurs suggérés :**
- **OVH** - Français, fiable, support en français
- **Hostinger** - Économique, performant
- **SiteGround** - Excellent support client

**Étapes :**
1. Acheter un hébergement web + domaine
2. Uploader tous les fichiers via FTP
3. Configurer le domaine
4. Tester le site

### Option 2 : GitHub Pages (Gratuit)
**Avantages :** Gratuit, simple, intégration Git
**Limitations :** Pas de PHP, domaine github.io

**Étapes :**
1. Créer un compte GitHub
2. Créer un repository public
3. Uploader les fichiers
4. Activer GitHub Pages dans les paramètres
5. Site accessible sur `username.github.io/repository`

### Option 3 : Netlify (Gratuit/Payant)
**Avantages :** Déploiement automatique, CDN, HTTPS gratuit
**Étapes :**
1. Créer un compte Netlify
2. Connecter votre repository Git
3. Déploiement automatique à chaque commit

## 📧 Configuration Email

### Formulaire de Contact
Le formulaire actuel utilise JavaScript côté client. Pour un vrai envoi :

#### Solution 1 : Formspree (Recommandé)
```html
<!-- Remplacer dans contact.html -->
<form action="https://formspree.io/f/VOTRE_ID" method="POST">
```

#### Solution 2 : EmailJS
```javascript
// Ajouter dans script.js
emailjs.send("service_id", "template_id", {
    name: name,
    email: email,
    message: message
});
```

#### Solution 3 : Script PHP (si hébergement PHP)
Créer `contact-handler.php` :
```php
<?php
if ($_POST) {
    $to = 'contact@saint-benoit.cm';
    $subject = 'Contact depuis le site web';
    $message = $_POST['message'];
    $headers = 'From: ' . $_POST['email'];
    
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
```

## 🔧 Optimisations Post-Déploiement

### 1. Performance
- **Compression GZIP** - Activée via `.htaccess`
- **Cache navigateur** - Configuré pour 1 mois
- **Images optimisées** - Utiliser WebP si possible
- **Minification** - CSS/JS (optionnel pour ce projet)

### 2. SEO
- **Google Search Console** - Soumettre le sitemap
- **Google My Business** - Créer une fiche paroisse
- **Réseaux sociaux** - Créer les pages officielles
- **Contenu régulier** - Mettre à jour les actualités

### 3. Sécurité
- **HTTPS** - Certificat SSL obligatoire
- **Headers sécurisés** - Configurés dans `.htaccess`
- **Sauvegardes** - Automatiques recommandées
- **Mises à jour** - Surveiller les dépendances

## 📊 Monitoring et Analytics

### Google Analytics 4
Ajouter avant `</head>` dans tous les fichiers HTML :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Métriques à Surveiller
- **Visiteurs uniques** - Croissance de l'audience
- **Pages populaires** - Contenu le plus consulté
- **Temps sur site** - Engagement des visiteurs
- **Appareils** - Mobile vs Desktop
- **Sources de trafic** - Réseaux sociaux, recherche, direct

## 🆘 Résolution de Problèmes

### Site ne s'affiche pas
1. Vérifier les permissions fichiers (755/644)
2. Contrôler les logs d'erreur serveur
3. Tester avec différents navigateurs
4. Vérifier la configuration DNS

### Images manquantes
1. Vérifier les chemins relatifs
2. Contrôler les permissions
3. Optimiser la taille des images
4. Utiliser des formats web (WebP, AVIF)

### Formulaires ne fonctionnent pas
1. Configurer un service d'envoi d'emails
2. Tester la validation JavaScript
3. Vérifier les paramètres serveur
4. Contrôler les logs d'erreur

### PWA ne s'installe pas
1. Vérifier le manifest.json
2. Générer les icônes manquantes
3. Tester sur HTTPS uniquement
4. Contrôler le service worker

## 📞 Support Technique

### Ressources Utiles
- **Documentation officielle** - README.md et INSTALLATION.md
- **Outils de test** - Google PageSpeed, GTmetrix
- **Validation** - W3C Validator, PWA Builder
- **Communauté** - Forums d'hébergeurs, Stack Overflow

### Contacts d'Urgence
- **Hébergeur** - Support technique 24/7
- **Développeur** - Pour modifications importantes
- **Webmaster** - Maintenance courante

---

## ✅ Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] Site accessible sur le domaine principal
- [ ] HTTPS activé et fonctionnel
- [ ] Toutes les pages se chargent correctement
- [ ] Formulaires testés et fonctionnels
- [ ] PWA installable sur mobile
- [ ] Images optimisées et affichées
- [ ] SEO configuré (sitemap, meta tags)
- [ ] Analytics en place
- [ ] Sauvegardes configurées
- [ ] Équipe formée à la maintenance

**Félicitations ! Votre site paroissial est maintenant en ligne ! 🎉**