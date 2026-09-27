// Construit le site Révisons Nos Classiques dans le dossier dist/.
// Lancé automatiquement par Netlify à chaque modification (commande : node build.js).

const fs = require("fs");
const path = require("path");
const { lireJSON, lireDossier, ecrire, copier } = require("./src/outils");
const g = require("./src/gabarits");

const RACINE = __dirname;
const SORTIE = path.join(RACINE, "dist");
const CONTENU = path.join(RACINE, "content");

const reglages = lireJSON(path.join(CONTENU, "reglages.json"));
// Sur Netlify, la variable URL contient l'adresse du site ; sinon on prend celle des réglages.
const url = (process.env.URL || reglages.site.url || "").replace(/\/$/, "");
const ctx = { reglages, url, version: Date.now().toString(36) };

const parDate = (a, b) => new Date(b.date) - new Date(a.date);
const articles = lireDossier(path.join(CONTENU, "articles")).filter((a) => !a.brouillon).sort(parDate);
const breves = lireDossier(path.join(CONTENU, "breves")).sort(parDate);
const videos = (lireJSON(path.join(CONTENU, "videos.json"), { videos: [] }).videos || []).filter((v) => v && v.lien);

fs.rmSync(SORTIE, { recursive: true, force: true });
copier(path.join(RACINE, "static"), SORTIE);

const pages = [];
function publier(chemin, html) {
  const fichier = chemin.endsWith(".html") ? chemin : path.join(chemin, "index.html");
  ecrire(path.join(SORTIE, fichier), html);
  if (!chemin.endsWith(".html") && !chemin.includes("merci")) pages.push(chemin);
}

publier("/", g.pageAccueil(ctx, { articles, breves, videos }));

for (const a of articles) {
  publier(g.urlArticle(a), g.pageArticle(ctx, a, { articles }));
}

for (const [type, r] of Object.entries(g.RUBRIQUES)) {
  const intro = {
    billets: "Ce qui cloche dans les institutions culturelles, dit sans détour.",
    portraits: "Des vies de musiciens hors du commun, racontées en quelques minutes.",
    anecdotes: "L'histoire improbable qui se cache derrière un nom ou une œuvre.",
    critiques: "Concerts, disques et mises en scène passés au crible.",
  }[r.id];
  publier(r.chemin, g.pageRubrique(ctx, { id: r.id, titre: r.titre, intro, chemin: r.chemin, articles: articles.filter((a) => a.type === type) }));
}

const typesMagazine = Object.entries(g.RUBRIQUES).filter(([, r]) => g.MAGAZINE.includes(r.id)).map(([type]) => type);
publier(
  "/magazine/",
  g.pageRubrique(ctx, {
    id: "magazine",
    titre: "Le magazine",
    intro: "Anecdotes, portraits et critiques : la musique classique racontée autrement.",
    chemin: "/magazine/",
    articles: articles.filter((a) => typesMagazine.includes(a.type)),
  })
);

publier("/breves/", g.pageBreves(ctx, breves));
publier("/partenariats/", g.pagePartenariats(ctx));
publier("/partenariats/merci/", g.pagePartenariatMerci(ctx));
publier("/merci/", g.pageMerci(ctx));

for (const nom of ["mentions-legales", "confidentialite"]) {
  const p = lireJSON(path.join(CONTENU, "pages", `${nom}.json`));
  if (p) publier(`/${nom}/`, g.pageTexte(ctx, p, `/${nom}/`));
}

publier("/404.html", g.page404(ctx));

// Plan du site et consignes pour les moteurs de recherche.
ecrire(
  path.join(SORTIE, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${url}${p}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
ecrire(path.join(SORTIE, "robots.txt"), `User-agent: *\nDisallow: /admin/\nSitemap: ${url}/sitemap.xml\n`);

const n = (x, mot) => `${x} ${mot}${x > 1 ? "s" : ""}`;
console.log(`Site construit : ${n(pages.length, "page")}, ${n(articles.length, "article")}, ${n(breves.length, "brève")}, ${n(videos.length, "vidéo")}.`);
if (!reglages.newsletter.action) {
  console.log("À faire : renseigner l'adresse du formulaire Brevo dans Réglages > Newsletter.");
}
