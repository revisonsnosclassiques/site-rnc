// Gabarits HTML du site Révisons Nos Classiques.
// Chaque fonction renvoie du HTML sous forme de texte.

const { esc, surligne, brut, markdown, dateFr, dateCourte, tempsLecture } = require("./outils");

const RUBRIQUES = {
  "Billet d'humeur": { id: "billets", chemin: "/billets/", titre: "Billets d'humeur" },
  Portrait: { id: "portraits", chemin: "/portraits/", titre: "Portraits" },
  Anecdote: { id: "anecdotes", chemin: "/anecdotes/", titre: "Anecdotes" },
  Critique: { id: "critiques", chemin: "/critiques/", titre: "Critiques" },
};

// Rubriques regroupées dans le menu déroulant « Magazine », dans cet ordre.
const MAGAZINE = ["anecdotes", "portraits", "critiques"];

const urlArticle = (a) => `/articles/${a.slug}/`;
const rubrique = (a) => RUBRIQUES[a.type] || RUBRIQUES.Anecdote;

// ---------- Morceaux communs ----------

function icone(nom) {
  const icones = {
    lecture: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="7 4 20 12 7 20"></polygon></svg>',
    coche: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6"></polyline></svg>',
    fermer: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',
    micro: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 10a7 7 0 0 0 14 0"></path><line x1="12" y1="17" x2="12" y2="22"></line></svg>',
  };
  return icones[nom] || "";
}

function navigation(ctx, courant) {
  const r = ctx.reglages;
  const lien = (href, libelle, id, externe) =>
    `<a href="${esc(href)}"${id === courant ? ' aria-current="page"' : ""}${externe ? ' target="_blank" rel="noopener"' : ""}>${libelle}</a>`;
  const magazineActif = MAGAZINE.includes(courant) || courant === "magazine";
  const items = [
    `<li>${lien("/", "À la une", "une")}</li>`,
    `<li>${lien("/billets/", "Billets", "billets")}</li>`,
    `<li><button type="button" class="nav__bouton${magazineActif ? " est-actif" : ""}" aria-expanded="false" aria-controls="menu-magazine">Magazine ${icone("chevron")}</button></li>`,
    `<li>${lien("/#videos", "Vidéos", "videos")}</li>`,
    `<li>${lien(r.podcast.lien || "/#podcast", "Podcast", "podcast", !!r.podcast.lien)}</li>`,
  ];
  if (r.reseaux.spotify) items.push(`<li>${lien(r.reseaux.spotify, "Playlists", "playlists", true)}</li>`);
  items.push(`<li>${lien("/#livre", "Le livre", "livre")}</li>`);
  if (r.opus.lien) items.push(`<li>${lien(r.opus.lien, "Opus", "opus", true)}</li>`);
  items.push(`<li class="nav__droite">${lien("/partenariats/", "Partenariats", "partenariats")}</li>`);
  const sousMenu = MAGAZINE.map((id) => Object.values(RUBRIQUES).find((x) => x.id === id))
    .map((x) => `<li>${lien(x.chemin, x.titre, x.id)}</li>`)
    .join("");
  return `<nav class="nav" aria-label="Rubriques">
  <div class="conteneur nav__cadre">
    <ul class="nav__liste">${items.join("")}</ul>
    <div class="nav__panneau" id="menu-magazine" hidden>
      <ul>${sousMenu}<li>${lien("/magazine/", "Tout le magazine", "magazine")}</li></ul>
    </div>
  </div>
</nav>`;
}

function entete(ctx, courant) {
  const r = ctx.reglages;
  const annonce = r.annonce ? `<p class="annonce">${esc(r.annonce)}</p>` : "";
  return `${annonce}
<header class="entete">
  <div class="conteneur entete__ligne">
    <a class="marque" href="/">
      <img src="/images/logo-rnc.png" alt="" width="56" height="56">
      <span>révisons nos classiques</span>
    </a>
    <a class="btn btn--noir entete__cta" href="/#newsletter">Recevoir la newsletter</a>
  </div>
</header>
${navigation(ctx, courant)}`;
}

function pied(ctx) {
  const r = ctx.reglages;
  const suivre = [
    r.reseaux.instagram && `<a href="${esc(r.reseaux.instagram)}" target="_blank" rel="noopener">Instagram</a>`,
    r.reseaux.facebook && `<a href="${esc(r.reseaux.facebook)}" target="_blank" rel="noopener">Facebook</a>`,
    r.reseaux.spotify && `<a href="${esc(r.reseaux.spotify)}" target="_blank" rel="noopener">Playlists Spotify</a>`,
    (r.playlists || {}).lien && `<a href="${esc(r.playlists.lien)}" target="_blank" rel="noopener">Playlists Spotify</a>`,
  ]
    .filter(Boolean)
    .join("");
  return `<footer class="pied">
  <div class="conteneur pied__grille">
    <div class="pied__marque">
      <a class="pied__nom" href="/">révisons nos classiques</a>
      <p>${esc(r.site.slogan)}</p>
    </div>
    <div class="pied__colonnes">
      <div><p class="pied__titre">Explorer</p><a href="/breves/">Brèves</a><a href="/billets/">Billets</a><a href="/portraits/">Portraits</a><a href="/anecdotes/">Anecdotes</a><a href="/critiques/">Critiques</a><a href="/#livre">Le livre</a></div>
      ${suivre ? `<div><p class="pied__titre">Suivre</p>${suivre}</div>` : ""}
      <div><p class="pied__titre">Infos</p><a href="/partenariats/">Partenariats</a><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a></div>
    </div>
    <p class="pied__copie">© ${new Date().getFullYear()} Révisons Nos Classiques</p>
  </div>
</footer>`;
}

function formNewsletter(ctx, { id, variante = "clair", bouton = "Je m'inscris", note = true, colonne = false }) {
  const action = ctx.reglages.newsletter.action;
  const nom = action ? ' name="EMAIL"' : "";
  return `<form class="form-nl form-nl--${variante}${colonne ? " form-nl--colonne" : ""}" method="${action ? "POST" : "GET"}" action="${action ? esc(action) : "/merci/"}" data-newsletter>
  <label for="${id}">Votre adresse email</label>
  <div class="form-nl__ligne">
    <input id="${id}" type="email"${nom} autocomplete="email" required placeholder="prenom@exemple.fr">
    <button type="submit" class="btn ${variante === "clair" ? "btn--noir" : variante === "jaune" ? "btn--noir" : "btn--jaune"}">${bouton}</button>
  </div>
  ${action ? '<input type="text" name="email_address_check" value="" class="piege" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="locale" value="fr">' : ""}
  ${note ? '<p class="form-nl__note">Gratuit. Désinscription en un clic.</p>' : ""}
</form>`;
}

function visuel(a, classe = "") {
  if (a.image) {
    return `<img class="${classe}" src="${esc(a.image)}" alt="" loading="lazy">`;
  }
  return `<div class="${classe} visuel-vide" aria-hidden="true"><img src="/images/logo-rnc.png" alt=""></div>`;
}

function carteArticle(a) {
  return `<article class="carte">
  <a class="carte__lien" href="${urlArticle(a)}">
    ${visuel(a, "carte__image")}
    <span class="tag">${esc(a.type)}</span>
    <h3 class="carte__titre">${surligne(a.title)}</h3>
  </a>
  ${a.chapo ? `<p class="carte__chapo">${esc(a.chapo)}</p>` : ""}
</article>`;
}

function listeBreves(breves) {
  return `<ol class="breves">${breves
    .map(
      (b) => `<li class="breves__item">
  <span class="breves__date">${dateCourte(b.date)}</span>
  <div>${b.lien ? `<a class="breves__titre" href="${esc(b.lien)}">${esc(b.title)}</a>` : `<p class="breves__titre">${esc(b.title)}</p>`}</div>
</li>`
    )
    .join("")}</ol>`;
}

function encartSombre(ctx, id, titre = "Ne ratez plus aucune brève.", texte = "L'actu du milieu classique, résumée dans votre boîte mail.") {
  return `<div class="encart-sombre">
  <p class="encart-sombre__titre">${titre}</p>
  <p class="encart-sombre__texte">${texte}</p>
  ${formNewsletter(ctx, { id, variante: "sombre", note: false, colonne: true })}
</div>`;
}

function blocCadeau(ctx) {
  return `<div class="cadeau">
  <div class="cadeau__couv" aria-hidden="true"><img src="/images/logo-rnc.png" alt=""><span>10 scandales</span></div>
  <div><p class="cadeau__label">En cadeau à l'inscription</p><p class="cadeau__titre">Le guide « ${esc(ctx.reglages.newsletter.cadeau)} »</p></div>
</div>`;
}

function blocLivre(ctx) {
  const l = ctx.reglages.livre;
  return `<section class="livre" id="livre">
  <div class="conteneur livre__grille">
    <img class="livre__couv" src="/images/couverture-livre.webp" alt="Couverture du livre 49 petites histoires de la musique classique" width="290" height="406" loading="lazy">
    <div>
      <span class="tag">Le livre</span>
      <h2 class="titre-section">49 petites histoires de la musique classique</h2>
      <p class="livre__texte">Pourquoi Carmen fut d'abord un échec. Comment Liszt devint la première rockstar de l'histoire. Et quel rapport entre une fistule de Louis XIV et l'hymne britannique. 49 histoires, et 49 morceaux commentés à écouter dans une playlist exclusive Warner Classics.</p>
      <p class="livre__infos">Éditions De Boeck Supérieur, 192 pages${l.prix ? `, ${esc(l.prix)}` : ""}</p>
      <div class="boutons">
        ${l.lien ? `<a class="btn btn--noir" href="${esc(l.lien)}" target="_blank" rel="noopener sponsored">Commander le livre</a>` : ""}
        ${l.libraire ? `<a class="btn btn--contour" href="${esc(l.libraire)}" target="_blank" rel="noopener">Trouver chez un libraire</a>` : ""}
      </div>
      ${l.lien ? '<p class="livre__mention">Lien affilié : une petite commission nous est reversée, sans surcoût pour vous.</p>' : ""}
    </div>
  </div>
</section>`;
}

// ---------- Mise en page générale ----------

function page(ctx, { titre, description, image, chemin, contenu, courant, classe = "", type = "website", jsonld = "", identite = false }) {
  const r = ctx.reglages;
  const titreComplet = titre ? `${brut(titre)} | ${r.site.nom}` : `${r.site.nom} : ${r.site.slogan}`;
  const desc = description || r.site.description;
  const urlPage = ctx.url + chemin;
  const img = ctx.url + (image || "/images/og-defaut.jpg");
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titreComplet)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${urlPage}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(r.site.nom)}">
<meta property="og:title" content="${esc(titre ? brut(titre) : titreComplet)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${urlPage}">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/images/favicon.png">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Oswald:wght@600;700&family=Poppins:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css?v=${ctx.version}">
${identite ? '<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>' : ""}
${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : ""}
</head>
<body class="${classe}">
<a class="evitement" href="#contenu">Aller au contenu</a>
${entete(ctx, courant)}
<main id="contenu">
${contenu}
</main>
${pied(ctx)}
<script src="/js/site.js?v=${ctx.version}" defer></script>
${
  identite
    ? `<script>if(window.netlifyIdentity){window.netlifyIdentity.on("init",function(u){if(!u){window.netlifyIdentity.on("login",function(){document.location.href="/admin/";});}});}</script>`
    : ""
}
</body>
</html>`;
}

// ---------- Accueil ----------

function pageAccueil(ctx, { articles, breves, videos }) {
  const r = ctx.reglages;
  const une = articles.find((a) => a.une) || articles[0];
  const autres = articles.filter((a) => a !== une).slice(0, 2);

  const blocUne = une
    ? `<section class="une">
  <div class="conteneur une__grille">
    <article class="une__article">
      <a href="${urlArticle(une)}" class="une__image-lien">${visuel(une, "une__image")}</a>
      <span class="tag">${esc(une.type)}</span>
      <h1 class="une__titre"><a href="${urlArticle(une)}">${surligne(une.title)}</a></h1>
      ${une.chapo ? `<p class="une__chapo">${esc(une.chapo)}</p>` : ""}
      <a class="btn btn--contour" href="${urlArticle(une)}">Lire l'article</a>
    </article>
    <aside class="une__breves" aria-labelledby="titre-breves">
      <div class="filet-titre">
        <h2 id="titre-breves" class="titre-petit">Les brèves</h2>
        <a href="/breves/">Toutes les brèves</a>
      </div>
      ${breves.length ? listeBreves(breves.slice(0, 5)) : '<p class="vide">Les premières brèves arrivent très vite.</p>'}
      ${encartSombre(ctx, "email-breves")}
    </aside>
  </div>
</section>`
    : "";

  const bandeNewsletter = `<section class="bande-nl dechire" id="newsletter">
  <div class="conteneur bande-nl__grille">
    <div>
      <h2 class="titre-geant">L'actu du classique, sans le vernis, dans votre boîte mail.</h2>
      <ul class="atouts">
        <li>${icone("coche")}<span>Les coulisses des maisons d'opéra et des orchestres, décryptées.</span></li>
        <li>${icone("coche")}<span>Des anecdotes à ressortir au prochain dîner.</span></li>
        <li>${icone("coche")}<span>Zéro jargon : pas besoin d'avoir fait le conservatoire.</span></li>
      </ul>
      <p class="preuve">Déjà <strong>${esc(r.stats.abonnes)} abonnés</strong> nous suivent sur Instagram.</p>
    </div>
    <div class="carte-form">
      ${blocCadeau(ctx)}
      ${formNewsletter(ctx, { id: "email-bande", variante: "clair", bouton: "Recevoir la newsletter", colonne: true })}
    </div>
  </div>
</section>`;

  const podcast = r.podcast.lien
    ? `<article class="carte-podcast" id="podcast">${icone("micro")}<p class="carte-podcast__titre">Le podcast est là.</p><p>Le même regard impertinent sur la musique classique, cette fois à écouter.</p><a class="btn btn--jaune" href="${esc(r.podcast.lien)}" target="_blank" rel="noopener">Écouter le podcast</a></article>`
    : `<article class="carte-podcast" id="podcast">${icone("micro")}<p class="carte-podcast__titre">Le podcast arrive.</p><p>Le même regard impertinent sur la musique classique, cette fois à écouter.</p><a class="btn btn--jaune" href="#newsletter">Être prévenu à la sortie</a></article>`;

  const aLire = `<section class="section">
  <div class="conteneur">
    <div class="filet-titre"><h2 class="titre-section">À lire aussi</h2><a href="/magazine/">Tout le magazine</a></div>
    <div class="grille-3">
      ${autres.map(carteArticle).join("")}
      ${podcast}
    </div>
  </div>
</section>`;

  const blocVideos = `<section class="videos" id="videos">
  <div class="conteneur">
    <div class="videos__tete">
      <div>
        <h2 class="titre-section">Les vidéos</h2>
        <p>Nos reels sur les questions de société qui traversent la musique classique.</p>
      </div>
      ${r.reseaux.instagram ? `<a href="${esc(r.reseaux.instagram)}reels/" target="_blank" rel="noopener">Toutes les vidéos</a>` : ""}
    </div>
    ${
      videos.length
        ? `<div class="videos__grille">${videos
            .slice(0, 8)
            .map(
              (v) => `<a class="video" href="${esc(v.lien)}" target="_blank" rel="noopener">
  ${v.miniature ? `<img src="${esc(v.miniature)}" alt="" loading="lazy">` : ""}
  <span class="video__lecture">${icone("lecture")}</span>
  <span class="video__texte"><span class="video__titre">${esc(v.titre)}</span>${v.duree ? `<span class="video__duree">${esc(v.duree)}</span>` : ""}</span>
</a>`
            )
            .join("")}</div>`
        : `<p class="videos__vide">Nos vidéos arrivent ici très bientôt. En attendant, elles sont toutes sur <a href="${esc(r.reseaux.instagram)}" target="_blank" rel="noopener">Instagram</a>.</p>`
    }
  </div>
</section>`;

  const opus = `<section class="section opus">
  <div class="conteneur opus__grille">
    <div>
      <h2 class="titre-section">Opus, le jeu</h2>
      <p class="opus__texte">Instrumentiste, chanteur, compositeur ou chef d'orchestre : choisissez votre voie et faites carrière dans la musique classique.</p>
      ${r.opus.lien ? `<a class="btn btn--noir" href="${esc(r.opus.lien)}" target="_blank" rel="noopener">Jouer à Opus</a>` : ""}
    </div>
    <div class="opus__visuel" aria-hidden="true"><span>Opus</span></div>
  </div>
</section>`;

  const partenaires = `<section class="bande-partenaires">
  <div class="conteneur bande-partenaires__grille">
    <h2 class="titre-section">Festival, orchestre, label, salle de concert ?</h2>
    <div>
      <p>Révisons Nos Classiques s'adresse chaque jour à ${esc(r.stats.abonnes)} abonnés sur Instagram, curieux et passionnés de musique classique. C'est aussi un livre, « 49 petites histoires de la musique classique », publié chez De Boeck Supérieur. Parlons de votre saison, de vos artistes et de vos projets.</p>
      <a class="btn btn--noir-blanc" href="/partenariats/">Découvrir les partenariats</a>
    </div>
  </div>
</section>`;

  const final = `<section class="final">
  <div class="conteneur final__contenu">
    <img class="final__logo" src="/images/logo-rnc.png" alt="" width="150" height="150" loading="lazy">
    <h2 class="titre-geant">Révisez vos classiques <span class="jaune">depuis votre boîte mail.</span></h2>
    <p>Inscription en dix secondes, désinscription en un clic.</p>
    ${formNewsletter(ctx, { id: "email-final", variante: "sombre", note: false })}
  </div>
</section>`;

  const jsonld = JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: r.site.nom, url: ctx.url + "/" });

  return page(ctx, {
    chemin: "/",
    courant: "une",
    identite: true,
    jsonld,
    contenu: [blocUne, bandeNewsletter, aLire, blocLivre(ctx), blocVideos, opus, partenaires, final].join("\n"),
  });
}

// ---------- Article ----------

function blocEcouter(lien) {
  if (!lien) return "";
  const yt = lien.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) {
    return `<div class="ecouter ecouter--video"><p class="ecouter__titre">À écouter</p><div class="ratio-16-9"><iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="Vidéo YouTube" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div></div>`;
  }
  const sp = lien.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([\w]+)/);
  if (sp) {
    return `<div class="ecouter ecouter--video"><p class="ecouter__titre">À écouter</p><iframe class="ecouter__spotify" src="https://open.spotify.com/embed/${sp[1]}/${sp[2]}" title="Lecteur Spotify" loading="lazy" allow="encrypted-media"></iframe></div>`;
  }
  return `<a class="ecouter" href="${esc(lien)}" target="_blank" rel="noopener"><span class="ecouter__icone">${icone("lecture")}</span><span><span class="ecouter__titre">À écouter</span><span class="ecouter__texte">Ouvrir l'extrait</span></span></a>`;
}

function partage(ctx, a, classe = "") {
  const url = encodeURIComponent(ctx.url + urlArticle(a));
  const texte = encodeURIComponent(brut(a.title) + " ");
  return `<div class="partage ${classe}">
  <button type="button" class="btn-petit" data-copier="${ctx.url + urlArticle(a)}">Copier le lien</button>
  <a class="btn-petit" href="https://wa.me/?text=${texte}${url}" target="_blank" rel="noopener">WhatsApp</a>
  <a class="btn-petit" href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener">Facebook</a>
</div>`;
}

function popup(ctx) {
  return `<div class="popup" id="popup" role="dialog" aria-modal="true" aria-labelledby="popup-titre" hidden>
  <div class="popup__fond" data-fermer></div>
  <div class="popup__boite">
    <button type="button" class="popup__fermer" aria-label="Fermer" data-fermer>${icone("fermer")}</button>
    <h2 id="popup-titre" class="popup__titre">Vous avez aimé cette histoire ?</h2>
    <p>Recevez les prochaines par email : les coulisses, les polémiques et les anecdotes que personne ne vous raconte.</p>
    <p class="popup__cadeau"><strong>En cadeau :</strong> le guide « ${esc(ctx.reglages.newsletter.cadeau)} »</p>
    ${formNewsletter(ctx, { id: "email-popup", variante: "jaune", bouton: "Recevoir la newsletter", note: false, colonne: true })}
    <button type="button" class="popup__non" data-fermer>Non merci</button>
  </div>
</div>
<div class="barre-collante" id="barre-collante" hidden>
  <p>L'actu du classique, sans le vernis, par email.</p>
  <a class="btn btn--jaune" href="#encadre-newsletter">Je m'inscris</a>
</div>`;
}

function pageArticle(ctx, a, { articles }) {
  const r = rubrique(a);
  const corps = markdown(a.body || "").split("\n");
  const debut = corps.slice(0, 2).join("\n");
  const suite = corps.slice(2).join("\n");
  const autres = articles.filter((x) => x !== a).slice(0, 3);

  const encadre = `<div class="encadre-nl" id="encadre-newsletter">
  <p class="encadre-nl__titre">Vous aimez cette histoire ?</p>
  <p>Recevez les prochaines par email, avec en cadeau le guide « ${esc(ctx.reglages.newsletter.cadeau)} ».</p>
  ${formNewsletter(ctx, { id: "email-article", variante: "jaune", note: false })}
</div>`;

  const rappelLivre = ctx.reglages.livre.lien
    ? `<div class="rappel-livre">
  <img src="/images/couverture-livre.webp" alt="Couverture du livre 49 petites histoires de la musique classique" width="120" height="168" loading="lazy">
  <div><p class="rappel-livre__titre">Des histoires comme celle-ci, il y en a 49 dans le livre.</p><a class="btn btn--jaune" href="${esc(ctx.reglages.livre.lien)}" target="_blank" rel="noopener sponsored">Commander le livre</a></div>
</div>`
    : "";

  const contenu = `<article class="article">
  <header class="conteneur article__tete">
    <a class="tag" href="${r.chemin}">${esc(a.type)}</a>
    <h1 class="article__titre">${surligne(a.title)}</h1>
    ${a.chapo ? `<p class="article__chapo">${esc(a.chapo)}</p>` : ""}
    <div class="article__meta">
      <p><strong>Révisons Nos Classiques</strong> <span>${dateFr(a.date)}</span> <span>${tempsLecture(a.body)} min de lecture</span></p>
      ${partage(ctx, a)}
    </div>
  </header>
  <div class="conteneur article__grille">
    <div class="article__principal">
      ${a.image ? `<figure class="article__image"><img src="${esc(a.image)}" alt=""></figure>${a.credit ? `<p class="article__credit">${esc(a.credit)}</p>` : ""}` : ""}
      <div class="prose">${debut}</div>
      ${encadre}
      ${suite ? `<div class="prose">${suite}</div>` : ""}
      ${blocEcouter(a.ecouter)}
      ${rappelLivre}
      <div class="article__partage-fin"><p>Partagez cette histoire</p>${partage(ctx, a)}</div>
    </div>
    <aside class="article__cote">
      ${encartSombre(ctx, "email-cote", "L'actu du classique, sans le vernis.", "Dans votre boîte mail, avec un guide offert à l'inscription.")}
      ${
        autres.length
          ? `<div><div class="filet-titre"><h2 class="titre-petit">À lire ensuite</h2></div><ol class="plus-lus">${autres
              .map((x, i) => `<li><span>${i + 1}</span><a href="${urlArticle(x)}">${esc(brut(x.title))}</a></li>`)
              .join("")}</ol></div>`
          : ""
      }
    </aside>
  </div>
</article>
${
  autres.length
    ? `<section class="section section--papier"><div class="conteneur"><div class="filet-titre"><h2 class="titre-section">À lire aussi</h2></div><div class="grille-3">${autres
        .map(carteArticle)
        .join("")}</div></div></section>`
    : ""
}
${popup(ctx)}`;

  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: brut(a.title),
    description: a.chapo || "",
    datePublished: a.date,
    image: ctx.url + (a.image || "/images/og-defaut.jpg"),
    author: { "@type": "Organization", name: "Révisons Nos Classiques" },
    publisher: { "@type": "Organization", name: "Révisons Nos Classiques" },
  });

  return page(ctx, {
    titre: a.title,
    description: a.chapo,
    image: a.image,
    chemin: urlArticle(a),
    courant: r.id,
    type: "article",
    classe: "page-article",
    jsonld,
    contenu,
  });
}

// ---------- Listes ----------

function pageRubrique(ctx, { id, titre, intro, chemin, articles }) {
  const contenu = `<section class="section">
  <div class="conteneur">
    <h1 class="titre-page">${esc(titre)}</h1>
    ${intro ? `<p class="intro">${esc(intro)}</p>` : ""}
    ${articles.length ? `<div class="grille-3">${articles.map(carteArticle).join("")}</div>` : '<p class="vide">Les premiers articles de cette rubrique arrivent très vite.</p>'}
  </div>
</section>
${bandeNewsletterCompacte(ctx)}`;
  return page(ctx, { titre, description: intro, chemin, courant: id, contenu });
}

function bandeNewsletterCompacte(ctx) {
  return `<section class="bande-nl dechire">
  <div class="conteneur bande-nl__grille">
    <div><h2 class="titre-section">L'actu du classique, sans le vernis, dans votre boîte mail.</h2>${blocCadeau(ctx)}</div>
    <div class="carte-form">${formNewsletter(ctx, { id: "email-compact", variante: "clair", bouton: "Recevoir la newsletter", colonne: true })}</div>
  </div>
</section>`;
}

function pageBreves(ctx, breves) {
  const contenu = `<section class="section">
  <div class="conteneur conteneur--etroit">
    <h1 class="titre-page">Les brèves</h1>
    <p class="intro">L'actualité du milieu classique, résumée et commentée.</p>
    ${
      breves.length
        ? `<ol class="breves breves--page">${breves
            .map(
              (b) => `<li class="breves__item">
  <span class="breves__date">${dateFr(b.date)}</span>
  <div>
    <h2 class="breves__titre">${b.lien ? `<a href="${esc(b.lien)}">${esc(b.title)}</a>` : esc(b.title)}</h2>
    ${b.texte ? `<p class="breves__texte">${esc(b.texte)}</p>` : ""}
  </div>
</li>`
            )
            .join("")}</ol>`
        : '<p class="vide">Les premières brèves arrivent très vite.</p>'
    }
  </div>
</section>
${bandeNewsletterCompacte(ctx)}`;
  return page(ctx, { titre: "Les brèves", description: "L'actualité du milieu classique, résumée et commentée.", chemin: "/breves/", courant: "breves", contenu });
}

// ---------- Partenariats ----------

function pagePartenariats(ctx) {
  const r = ctx.reglages;
  const s = r.stats;
  const formats = [
    ["Reel dédié", "Une vidéo sur votre œuvre, votre artiste ou votre saison, racontée à notre façon."],
    ["Carrousel", "Une histoire en plusieurs images, idéale pour présenter un programme, un compositeur ou un anniversaire."],
    ["Brève et stories", "Une annonce rapide pour un concert, une sortie de disque ou l'ouverture d'une billetterie."],
    ["Couverture d'événement", "On vient à votre festival ou à votre concert, et on le raconte en direct à nos abonnés."],
    ["Newsletter", "Un encart dans la newsletter, lue par des abonnés qui ont choisi de nous suivre."],
    ["Podcast", "Un épisode ou une mention dans le podcast Révisons Nos Classiques, dès sa sortie."],
  ];
  const contenu = `<section class="hero-sombre">
  <div class="conteneur hero-sombre__grille">
    <div>
      <span class="tag tag--jaune">Partenariats</span>
      <h1 class="titre-geant">Faites découvrir votre saison <span class="jaune">à ceux qui n'écoutent pas encore de classique.</span></h1>
      <p class="hero-sombre__texte">Révisons Nos Classiques raconte la musique classique avec impertinence, chaque jour, à ${esc(s.abonnes)} abonnés sur Instagram. Festivals, orchestres, labels, salles de concert : inventons ensemble la façon d'en parler.</p>
      <div class="boutons">
        <a class="btn btn--jaune" href="#contact">Demander le kit média</a>
        ${r.site.email ? `<a class="btn btn--contour-blanc" href="mailto:${esc(r.site.email)}">Écrire directement</a>` : ""}
      </div>
    </div>
    <div class="collage" aria-hidden="true">
      <img class="collage__a" src="/images/breve-limoges.webp" alt="">
      <img class="collage__b" src="/images/anecdote-philidor.webp" alt="">
    </div>
  </div>
</section>
<section class="section section--serre">
  <div class="conteneur">
    <dl class="chiffres">
      <div><dt>abonnés sur Instagram</dt><dd>${esc(s.abonnes)}</dd></div>
      <div><dt>vues sur le dernier mois</dt><dd>${esc(s.vues)}</dd></div>
      <div><dt>d'abonnés de moins de 35 ans</dt><dd>${esc(s.jeunes)}</dd></div>
      <div><dt>publié chez De Boeck Supérieur</dt><dd>1 livre</dd></div>
    </dl>
    <p class="note">Chiffres Instagram de ${esc(s.date)}.</p>
  </div>
</section>
<section class="section">
  <div class="conteneur pourquoi">
    <img class="pourquoi__couv" src="/images/couverture-livre.webp" alt="Couverture du livre 49 petites histoires de la musique classique" width="300" height="420" loading="lazy">
    <div>
      <h2 class="titre-section">Pourquoi Révisons Nos Classiques</h2>
      <div class="pourquoi__points">
        <div><h3>Un classique qui parle aux curieux</h3><p>On raconte la musique classique par ses histoires, ses coulisses et ses débats, sans jargon. Nos contenus s'adressent autant aux curieux qu'aux mélomanes.</p></div>
        <div><h3>Un ton qui fait réagir</h3><p>Billets d'humeur, portraits, anecdotes, brèves : chaque format est pensé pour être lu jusqu'au bout, commenté et partagé.</p></div>
        <div><h3>Une signature reconnue</h3><p>Révisons Nos Classiques, c'est aussi un livre : « 49 petites histoires de la musique classique », publié chez De Boeck Supérieur en 2024, avec une playlist exclusive Warner Classics.</p></div>
      </div>
    </div>
  </div>
</section>
<section class="section section--papier">
  <div class="conteneur">
    <h2 class="titre-section">Ce qu'on peut faire ensemble</h2>
    <p class="intro">Chaque partenariat est construit sur mesure. Voici les formats les plus demandés.</p>
    <div class="formats">${formats.map(([t, d]) => `<div><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
    <p class="note">Tous nos partenariats sont clairement signalés à nos abonnés, conformément à la loi.</p>
  </div>
</section>
<section class="bande-nl dechire" id="contact">
  <div class="conteneur bande-nl__grille">
    <div>
      <h2 class="titre-geant">Parlons de votre projet.</h2>
      <p class="bande-nl__texte">Recevez notre kit média : statistiques détaillées de l'audience, exemples de contenus et tarifs.</p>
      ${r.site.email ? `<p class="bande-nl__texte">Vous préférez écrire directement ?<br><a href="mailto:${esc(r.site.email)}"><strong>${esc(r.site.email)}</strong></a></p>` : ""}
    </div>
    <form class="carte-form form-contact" name="partenariat" method="POST" action="/partenariats/merci/" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="partenariat">
      <p class="piege"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="form-contact__deux">
        <p><label for="p-nom">Nom</label><input id="p-nom" name="nom" type="text" autocomplete="name" required></p>
        <p><label for="p-structure">Structure</label><input id="p-structure" name="structure" type="text" autocomplete="organization" placeholder="Festival, orchestre, label…"></p>
      </div>
      <p><label for="p-email">Email professionnel</label><input id="p-email" name="email" type="email" autocomplete="email" required placeholder="prenom@structure.fr"></p>
      <p><label for="p-type">Type de projet</label><select id="p-type" name="type"><option>Promouvoir une saison ou un festival</option><option>Lancer un disque ou un artiste</option><option>Couvrir un événement</option><option>Autre projet</option></select></p>
      <p><label for="p-message">Votre message</label><textarea id="p-message" name="message" rows="5"></textarea></p>
      <button type="submit" class="btn btn--noir">Recevoir le kit média</button>
    </form>
  </div>
</section>`;
  return page(ctx, {
    titre: "Partenariats",
    description: `Festivals, orchestres, labels : faites découvrir votre saison aux ${s.abonnes} abonnés de Révisons Nos Classiques.`,
    chemin: "/partenariats/",
    courant: "partenariats",
    contenu,
  });
}

// ---------- Pages simples ----------

function pageTexte(ctx, p, chemin) {
  const contenu = `<section class="section">
  <div class="conteneur conteneur--etroit">
    <h1 class="titre-page">${esc(p.title)}</h1>
    ${p.maj ? `<p class="note">Dernière mise à jour : ${esc(p.maj)}</p>` : ""}
    <div class="prose prose--sans">${markdown(p.body)}</div>
  </div>
</section>`;
  return page(ctx, { titre: p.title, chemin, contenu });
}

function pageMerci(ctx) {
  const r = ctx.reglages;
  const contenu = `<section class="section">
  <div class="conteneur conteneur--etroit">
    <h1 class="titre-page">Plus qu'une étape : <mark class="surligne">confirmez votre adresse.</mark></h1>
    <p class="intro">Nous venons de vous envoyer un email. Votre inscription n'est validée qu'une fois le lien cliqué.</p>
    <ol class="etapes">
      <li><span>1</span>Ouvrez l'email de Révisons Nos Classiques.</li>
      <li><span>2</span>Cliquez sur « Confirmer mon inscription ».</li>
      <li><span>3</span>Recevez aussitôt votre guide « ${esc(r.newsletter.cadeau)} ».</li>
    </ol>
    <p class="astuce">Rien reçu d'ici quelques minutes ? Regardez dans vos spams ou dans l'onglet Promotions, puis ajoutez notre adresse à vos contacts.</p>
  </div>
</section>
<section class="final final--compact">
  <div class="conteneur final__contenu">
    <h2 class="titre-section">En attendant</h2>
    <p>Vous connaissez quelqu'un qui aime le classique, ou qui croit ne pas l'aimer ? Envoyez-lui la newsletter.</p>
    <div class="boutons boutons--centre">
      <button type="button" class="btn btn--jaune" data-copier="${ctx.url}/">Copier le lien du site</button>
      ${r.reseaux.instagram ? `<a class="btn btn--contour-blanc" href="${esc(r.reseaux.instagram)}" target="_blank" rel="noopener">Suivre sur Instagram</a>` : ""}
    </div>
  </div>
</section>`;
  return page(ctx, { titre: "Merci", chemin: "/merci/", contenu });
}

function pagePartenariatMerci(ctx) {
  const contenu = `<section class="section">
  <div class="conteneur conteneur--etroit">
    <h1 class="titre-page">Votre demande est bien arrivée.</h1>
    <p class="intro">Merci ! Nous vous répondons au plus vite avec notre kit média.</p>
    <a class="btn btn--noir" href="/">Retour à l'accueil</a>
  </div>
</section>`;
  return page(ctx, { titre: "Demande envoyée", chemin: "/partenariats/merci/", courant: "partenariats", contenu });
}

function page404(ctx) {
  const contenu = `<section class="section">
  <div class="conteneur conteneur--etroit">
    <h1 class="titre-page">Cette page s'est perdue en coulisses.</h1>
    <p class="intro">Elle a peut-être changé d'adresse, ou n'a jamais existé.</p>
    <a class="btn btn--noir" href="/">Retour à l'accueil</a>
  </div>
</section>
${bandeNewsletterCompacte(ctx)}`;
  return page(ctx, { titre: "Page introuvable", chemin: "/404.html", contenu });
}

module.exports = { pageAccueil, pageArticle, pageRubrique, pageBreves, pagePartenariats, pageTexte, pageMerci, pagePartenariatMerci, page404, RUBRIQUES, MAGAZINE, urlArticle };
