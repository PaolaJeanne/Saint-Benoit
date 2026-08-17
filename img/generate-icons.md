# Génération des Icônes - Paroisse Saint-Benoît

## Icônes Requises

Pour que le site fonctionne parfaitement, vous devez générer les icônes suivantes à partir du fichier `icon.svg` :

### Icônes PWA
- `icon-192.png` - 192x192px (icône PWA standard)
- `icon-512.png` - 512x512px (icône PWA haute résolution)
- `favicon.ico` - 32x32px (favicon du navigateur)

### Images Réseaux Sociaux
- `og-image.jpg` - 1200x630px (Open Graph pour Facebook, Twitter)

## Outils de Génération

### Option 1 : Outils en Ligne (Recommandé)
1. **RealFaviconGenerator** - https://realfavicongenerator.net/
   - Uploadez `icon.svg`
   - Téléchargez le pack complet d'icônes
   - Remplacez les fichiers dans le dossier `img/`

2. **PWA Builder** - https://www.pwabuilder.com/imageGenerator
   - Spécialement conçu pour les PWA
   - Génère toutes les tailles nécessaires

### Option 2 : Logiciels
1. **GIMP** (Gratuit)
   - Ouvrir `icon.svg`
   - Exporter en PNG aux tailles requises
   - Créer favicon.ico avec plugin

2. **Photoshop**
   - Importer le SVG
   - Redimensionner et exporter

### Option 3 : Ligne de Commande
```bash
# Avec ImageMagick (si installé)
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
convert icon.svg -resize 32x32 favicon.ico
```

## Instructions Détaillées

### 1. Favicon.ico
- Taille : 32x32px ou 16x16px
- Format : ICO (ou PNG accepté par navigateurs modernes)
- Placez dans le dossier `img/`

### 2. Icônes PWA
- `icon-192.png` : Icône standard pour écran d'accueil mobile
- `icon-512.png` : Icône haute résolution pour splash screen

### 3. Image Open Graph
- Taille : 1200x630px (ratio 1.91:1)
- Format : JPG ou PNG
- Contenu : Logo + nom de la paroisse + photo de l'église
- Texte lisible même en petit format

## Vérification

Après génération, vérifiez que :
- [ ] Les icônes s'affichent correctement dans l'onglet du navigateur
- [ ] L'icône PWA apparaît lors de l'installation
- [ ] L'image Open Graph s'affiche lors du partage sur réseaux sociaux

## Exemple de Contenu pour og-image.jpg

L'image devrait contenir :
- Logo ou croix de la paroisse
- Texte "Paroisse Saint-Benoît"
- Sous-titre "Dallas-Nsape, Cameroun"
- Photo de l'église en arrière-plan (optionnel)
- Couleurs : vert (#2c5530) et or (#d4af37)

## Test des Icônes

### Navigateur
- Ouvrez le site dans différents navigateurs
- Vérifiez l'icône dans l'onglet
- Testez l'ajout aux favoris

### PWA
- Ouvrez le site sur mobile
- Utilisez "Ajouter à l'écran d'accueil"
- Vérifiez l'icône sur l'écran d'accueil

### Réseaux Sociaux
- Partagez l'URL sur Facebook/Twitter
- Vérifiez que l'image og-image.jpg s'affiche
- Utilisez l'outil de débogage Facebook si nécessaire