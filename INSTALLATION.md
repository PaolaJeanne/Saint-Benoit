# Guide d'Installation - Paroisse Saint-Benoît

## 🚀 Installation Rapide

### Option 1 : Hébergement Web Simple
1. **Téléchargez** tous les fichiers du projet
2. **Uploadez** le contenu sur votre serveur web
3. **Configurez** le domaine pour pointer vers le dossier
4. **C'est prêt !** Le site fonctionne immédiatement

### Option 2 : Serveur Local pour Tests

#### Avec Python (recommandé)
```bash
# Naviguez vers le dossier du projet
cd paroisse-saint-benoit

# Lancez le serveur local
python -m http.server 8000

# Ouvrez http://localhost:8000 dans votre navigateur
```

#### Avec Node.js
```bash
# Installez serve globalement
npm install -g serve

# Lancez le serveur
serve .

# Ouvrez l'URL affichée dans votre navigateur
```

#### Avec PHP
```bash
# Lancez le serveur PHP intégré
php -S localhost:8000

# Ouvrez http://localhost:8000 dans votre navigateur
```

## ⚙️ Configuration

### 1. Personnalisation du Contenu

#### Informations de Contact
Modifiez dans tous les fichiers HTML :
- **Adresse** : PK15 - PK16, Dallas-Nsape
- **Téléphone** : +237 6 99 99 99 99
- **Email** : contact@saint-benoit.cm

#### Horaires des Messes
Dans `index.html`, section `#messes` :
```html
<div class="messe-time">
    <span>Dimanche matin</span>
    <strong>06h30</strong>
</div>
```

### 2. Images et Photos

#### Remplacer les Photos de l'Équipe
- Placez vos photos dans le dossier `img/`
- Modifiez les chemins dans `apropos.html` et `contact.html`
- Format recommandé : JPG, 400x400px minimum

#### Ajouter de Nouvelles Images
- Optimisez vos images (WebP recommandé)
- Utilisez des noms descriptifs
- Ajoutez l'attribut `alt` pour l'accessibilité

### 3. Couleurs et Style

#### Modifier la Palette de Couleurs
Dans `css/style.css`, section `:root` :
```css
:root {
  --primary: #2c5530;    /* Vert principal */
  --secondary: #d4af37;  /* Or liturgique */
  --light: #f8f9fa;      /* Arrière-plan clair */
  --dark: #2c3e50;       /* Texte sombre */
}
```

### 4. Actualités

#### Ajouter une Nouvelle Actualité
Dans `actualites.html` :
```html
<div class="news-card" data-category="votre-categorie">
  <img src="img/votre-image.jpg" alt="Description">
  <div class="news-content">
    <span class="news-category">Catégorie</span>
    <h3>Titre de l'actualité</h3>
    <p>Description...</p>
    <a href="#" class="read-more">Lire la suite →</a>
  </div>
</div>
```

## 🌐 Mise en Production

### 1. Hébergement Web

#### Hébergeurs Recommandés
- **OVH** - Hébergement français fiable
- **Hostinger** - Économique et performant
- **SiteGround** - Excellent support
- **GitHub Pages** - Gratuit pour sites statiques

#### Configuration Serveur
- **PHP** : Version 7.4+ recommandée
- **Apache** : Avec mod_rewrite activé
- **HTTPS** : Certificat SSL obligatoire
- **Compression** : GZIP activée

### 2. Nom de Domaine

#### Suggestions
- `saint-benoit.cm` (Cameroun)
- `paroisse-saint-benoit.org`
- `saintbenoit-dallas.cm`

### 3. Configuration DNS
```
Type    Nom     Valeur
A       @       [IP du serveur]
CNAME   www     [nom-du-domaine]
```

## 📧 Configuration Email

### 1. Formulaire de Contact
Le formulaire utilise JavaScript côté client. Pour un vrai envoi d'emails :

#### Option A : Service Tiers (Recommandé)
- **Formspree** : https://formspree.io
- **Netlify Forms** : Si hébergé sur Netlify
- **EmailJS** : Service JavaScript

#### Option B : Script PHP
Créez `contact-handler.php` :
```php
<?php
if ($_POST['name'] && $_POST['email'] && $_POST['message']) {
    $to = 'contact@saint-benoit.cm';
    $subject = 'Nouveau message du site web';
    $message = $_POST['message'];
    $headers = 'From: ' . $_POST['email'];
    
    mail($to, $subject, $message, $headers);
    echo 'Message envoyé avec succès';
}
?>
```

### 2. Newsletter
Intégrez un service comme :
- **Mailchimp**
- **Sendinblue**
- **ConvertKit**

## 🔧 Maintenance

### 1. Mises à Jour Régulières
- **Actualités** : Ajoutez du contenu frais
- **Photos** : Mettez à jour les images d'événements
- **Horaires** : Vérifiez les horaires de messes
- **Sécurité** : Maintenez les dépendances à jour

### 2. Sauvegarde
- **Fichiers** : Sauvegarde hebdomadaire
- **Base de données** : Si applicable
- **Images** : Stockage externe recommandé

### 3. Monitoring
- **Google Analytics** : Suivi des visiteurs
- **Google Search Console** : SEO et indexation
- **Uptime monitoring** : Surveillance de disponibilité

## 🆘 Support

### Problèmes Courants

#### Le site ne s'affiche pas
1. Vérifiez les permissions des fichiers (755 pour dossiers, 644 pour fichiers)
2. Contrôlez la configuration du serveur web
3. Vérifiez les logs d'erreur du serveur

#### Images qui ne s'affichent pas
1. Vérifiez les chemins des images
2. Contrôlez les permissions des fichiers
3. Optimisez la taille des images

#### Menu mobile ne fonctionne pas
1. Vérifiez que JavaScript est activé
2. Contrôlez la console du navigateur pour erreurs
3. Testez sur différents navigateurs

### Contacts Support
- **Documentation** : Consultez le README.md
- **Issues** : Créez un ticket si problème technique
- **Email** : contact@saint-benoit.cm pour questions spécifiques

---

*Installation réalisée avec succès ? N'hésitez pas à personnaliser le site selon vos besoins !*