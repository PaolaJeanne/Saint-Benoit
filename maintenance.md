# Guide de Maintenance - Paroisse Saint-Benoît

## 📅 Tâches de Maintenance Régulière

### Quotidienne (5 minutes)
- [ ] **Vérifier le fonctionnement** - Site accessible et rapide
- [ ] **Contrôler les formulaires** - Test rapide du formulaire de contact
- [ ] **Surveiller les erreurs** - Logs serveur si disponibles

### Hebdomadaire (15 minutes)
- [ ] **Actualités** - Ajouter du nouveau contenu
- [ ] **Photos** - Mettre à jour les images d'événements
- [ ] **Réseaux sociaux** - Partager les actualités
- [ ] **Sauvegarde** - Vérifier que les sauvegardes fonctionnent

### Mensuelle (30 minutes)
- [ ] **Horaires** - Vérifier et mettre à jour si nécessaire
- [ ] **Coordonnées** - Contrôler téléphone, email, adresse
- [ ] **Performance** - Tester la vitesse avec Google PageSpeed
- [ ] **Sécurité** - Vérifier les certificats SSL
- [ ] **Analytics** - Analyser les statistiques de visite

### Trimestrielle (1 heure)
- [ ] **Contenu complet** - Révision de toutes les pages
- [ ] **Photos équipe** - Mettre à jour si changements
- [ ] **Optimisation** - Compresser nouvelles images
- [ ] **SEO** - Vérifier le référencement Google
- [ ] **Fonctionnalités** - Tester tous les formulaires et liens

## 📝 Gestion du Contenu

### Ajouter une Actualité

1. **Ouvrir** `actualites.html`
2. **Copier** une actualité existante
3. **Modifier** le contenu :
   ```html
   <div class="news-card" data-category="CATEGORIE">
     <img src="img/VOTRE-IMAGE.jpg" alt="Description">
     <div class="news-content">
       <span class="news-category">Catégorie</span>
       <h3>Titre de l'actualité</h3>
       <p>Description...</p>
       <a href="#" class="read-more">Lire la suite →</a>
     </div>
   </div>
   ```
4. **Ajouter l'image** dans le dossier `img/`
5. **Tester** le filtrage par catégorie

### Catégories Disponibles
- `vie-paroissiale` - Vie paroissiale
- `solidarite` - Solidarité
- `jeunes` - Jeunes
- `catechese` - Catéchèse
- `chorale` - Chorale

### Modifier les Horaires de Messe

Dans `index.html`, section `#messes` :
```html
<div class="messe-time">
    <span>Jour/Période</span>
    <strong>Heure</strong>
</div>
```

### Changer les Coordonnées

Fichiers à modifier :
- `index.html` (footer)
- `contact.html` (section contact)
- `apropos.html` (footer)
- `actualites.html` (footer)
- `404.html` (footer)

## 🖼️ Gestion des Images

### Optimisation des Images
**Outils recommandés :**
- **TinyPNG** - https://tinypng.com/ (en ligne)
- **ImageOptim** - https://imageoptim.com/ (Mac)
- **GIMP** - Gratuit, multiplateforme

**Formats recommandés :**
- **Photos** - JPG (qualité 80-90%)
- **Logos/Icônes** - PNG ou SVG
- **Moderne** - WebP (si supporté)

**Tailles recommandées :**
- **Actualités** - 400x200px
- **Équipe** - 300x300px (carré)
- **Hero/Bannières** - 1200x600px

### Ajouter une Photo d'Équipe

1. **Préparer l'image** - Format carré, 300x300px minimum
2. **Placer** dans le dossier `img/`
3. **Modifier** `apropos.html` et `contact.html` :
   ```html
   <div class="team-member">
     <div class="member-photo">
       <img src="img/NOUVELLE-PHOTO.jpg" alt="Nom de la personne">
     </div>
     <div class="member-info">
       <h3>Nom</h3>
       <p class="member-role">Fonction</p>
       <p>Description...</p>
     </div>
   </div>
   ```

## 🎨 Personnalisation du Design

### Changer les Couleurs

Dans `css/style.css`, modifier les variables :
```css
:root {
  --primary: #2c5530;    /* Vert principal */
  --secondary: #d4af37;  /* Or liturgique */
  --light: #f8f9fa;      /* Arrière-plan clair */
  --dark: #2c3e50;       /* Texte sombre */
}
```

### Modifier les Polices

Ajouter dans `<head>` :
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
```

Puis dans CSS :
```css
body {
  font-family: 'Roboto', sans-serif;
}
```

## 🔧 Résolution de Problèmes

### Site Lent
1. **Optimiser les images** - Compresser toutes les photos
2. **Vérifier l'hébergement** - Contacter le support si nécessaire
3. **Tester la connexion** - Utiliser Google PageSpeed Insights
4. **Cache navigateur** - Vider le cache et retester

### Formulaire ne Fonctionne Pas
1. **Vérifier JavaScript** - Ouvrir la console du navigateur
2. **Tester sur différents navigateurs** - Chrome, Firefox, Safari
3. **Configurer l'envoi d'emails** - Voir `deploy.md`
4. **Contacter l'hébergeur** - Si problème serveur

### Images ne s'Affichent Pas
1. **Vérifier les chemins** - Respecter la casse (majuscules/minuscules)
2. **Contrôler les permissions** - 644 pour les fichiers
3. **Tester les formats** - JPG, PNG, WebP supportés
4. **Optimiser la taille** - Maximum 2MB par image

### Menu Mobile Bloqué
1. **Recharger la page** - F5 ou Ctrl+R
2. **Vider le cache** - Ctrl+Shift+R
3. **Tester sur autre appareil** - Isoler le problème
4. **Vérifier JavaScript** - Console du navigateur

## 📊 Suivi des Performances

### Métriques Importantes
- **Temps de chargement** - < 3 secondes idéal
- **Taille des pages** - < 2MB recommandé
- **Score mobile** - > 90 sur PageSpeed Insights
- **Erreurs 404** - À corriger rapidement

### Outils de Monitoring
- **Google Analytics** - Statistiques de visite
- **Google Search Console** - Performance SEO
- **GTmetrix** - Analyse de performance
- **Pingdom** - Surveillance uptime

## 🔒 Sécurité et Sauvegardes

### Sauvegardes Recommandées
- **Fréquence** - Hebdomadaire minimum
- **Contenu** - Tous les fichiers + base de données
- **Stockage** - Local + cloud (Google Drive, Dropbox)
- **Test** - Vérifier la restauration mensuelle

### Sécurité de Base
- **Mots de passe forts** - 12+ caractères, complexes
- **HTTPS obligatoire** - Certificat SSL valide
- **Mises à jour** - Hébergement et dépendances
- **Monitoring** - Surveillance des tentatives d'intrusion

## 📞 Contacts Utiles

### Support Technique
- **Hébergeur** - Support 24/7 de votre hébergeur
- **Développeur** - Pour modifications importantes
- **Webmaster local** - Maintenance courante

### Ressources d'Aide
- **Documentation** - README.md et guides du projet
- **Communauté** - Forums WordPress, Stack Overflow
- **Tutoriels** - YouTube, OpenClassrooms
- **Outils** - W3C Validator, Can I Use

---

## ✅ Checklist Mensuelle Rapide

- [ ] Site accessible et rapide
- [ ] Actualités à jour (< 1 mois)
- [ ] Formulaires fonctionnels
- [ ] Images optimisées
- [ ] Horaires corrects
- [ ] Coordonnées exactes
- [ ] Sauvegarde récente
- [ ] Certificat SSL valide
- [ ] Analytics consultées
- [ ] Aucune erreur visible

**Temps estimé : 30 minutes par mois pour un site bien maintenu**