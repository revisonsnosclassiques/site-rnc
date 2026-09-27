# Révisons Nos Classiques — le site

Site statique généré par un petit script Node.js, sans aucune dépendance à installer.
Netlify le reconstruit automatiquement à chaque modification.

## Au quotidien : publier sans toucher au code

Tout se fait depuis **votre-site.fr/admin** :

- **Articles** : billets d'humeur, portraits, anecdotes. Cochez « À la une » pour afficher un article en grand sur l'accueil. Entourez un passage du titre de `==` pour le surligner en jaune.
- **Brèves** : les cinq plus récentes apparaissent sur l'accueil.
- **Vidéos** : titre, lien vers le reel et miniature verticale.
- **Réglages** : chiffres, lien du livre, lien du podcast, lien d'Opus, adresse du formulaire Brevo, email de contact.
- **Pages légales** : mentions légales et politique de confidentialité.

Chaque enregistrement met le site à jour en une à deux minutes.

## Organisation des fichiers

- `content/` : tous les contenus (fichiers JSON modifiés par l'interface d'administration).
- `static/` : feuille de style, script, images, interface d'administration (`static/admin/`).
- `src/gabarits.js` : le HTML de chaque page.
- `src/outils.js` : Markdown, dates, lecture des fichiers.
- `build.js` : construit le site dans `dist/`.
- `netlify.toml` : réglages de construction pour Netlify.

## Tester sur son ordinateur

Avec Node.js installé : `node build.js`, puis ouvrir le dossier `dist/` avec un petit serveur local
(par exemple `python3 -m http.server -d dist`).
