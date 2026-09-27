// Outils partagés par le générateur du site Révisons Nos Classiques.
// Aucune dépendance : uniquement Node.js.

const fs = require("fs");
const path = require("path");

// Échappe le texte pour l'insérer dans du HTML.
function esc(texte = "") {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Titres : ==texte== devient un passage surligné en jaune.
function surligne(texte = "") {
  return esc(texte).replace(/==(.+?)==/g, '<mark class="surligne">$1</mark>');
}

// Version brute d'un titre (balises title, partage, meta).
function brut(texte = "") {
  return String(texte).replace(/==/g, "");
}

// Mise en forme dans une ligne : gras, italique, liens.
// Gère aussi les caractères échappés par l'interface d'administration (\\*, \\_…).
function enLigne(texte) {
  const echappes = [];
  let source = String(texte)
    .replace(/\\\s*$/, "")
    .replace(/\\([\\`*_{}\[\]()#+\-.!>=~|])/g, (m, c) => {
      echappes.push(c);
      return `\u0000${echappes.length - 1}\u0000`;
    });
  let html = esc(source);
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (m, libelle, url) => {
    const externe = /^https?:\/\//.test(url);
    return `<a href="${url}"${externe ? ' target="_blank" rel="noopener"' : ""}>${libelle}</a>`;
  });
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>");
  html = html.replace(/(^|[\s(«])_(?!\s)(.+?)_(?=[\s.,;:!?)»]|$)/g, "$1<em>$2</em>");
  return html.replace(/\u0000(\d+)\u0000/g, (m, i) => esc(echappes[Number(i)]));
}

// Markdown simplifié : titres, paragraphes, listes, citations, images.
function markdown(source = "") {
  const blocs = String(source).replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocs
    .map((bloc) => {
      const b = bloc.trim();
      if (!b) return "";
      const titre = b.match(/^(#{2,4})\s+(.*)$/);
      if (titre) {
        const niveau = titre[1].length;
        return `<h${niveau}>${enLigne(titre[2])}</h${niveau}>`;
      }
      const image = b.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
      if (image) {
        return `<figure><img src="${image[2]}" alt="${esc(image[1])}" loading="lazy"></figure>`;
      }
      const lignes = b.split("\n");
      if (lignes.every((l) => /^[-*]\s+/.test(l))) {
        return `<ul>${lignes.map((l) => `<li>${enLigne(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (lignes.every((l) => /^\d+\.\s+/.test(l))) {
        return `<ol>${lignes.map((l) => `<li>${enLigne(l.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
      }
      if (lignes.every((l) => /^>\s?/.test(l))) {
        return `<blockquote><p>${lignes.map((l) => enLigne(l.replace(/^>\s?/, ""))).join("<br>")}</p></blockquote>`;
      }
      return `<p>${lignes.map(enLigne).join("<br>")}</p>`;
    })
    .join("\n");
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function dateFr(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

function dateCourte(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return `${d.getDate()} ${MOIS[d.getMonth()]}`;
}

function tempsLecture(texte = "") {
  const mots = String(texte).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 220));
}

function slug(texte = "") {
  return brut(texte)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function lireJSON(fichier, defaut = null) {
  if (!fs.existsSync(fichier)) return defaut;
  return JSON.parse(fs.readFileSync(fichier, "utf8"));
}

function lireDossier(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: f.replace(/\.json$/, ""), ...lireJSON(path.join(dossier, f)) }));
}

function ecrire(fichier, contenu) {
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  fs.writeFileSync(fichier, contenu);
}

function copier(source, cible) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(cible, { recursive: true });
  for (const entree of fs.readdirSync(source, { withFileTypes: true })) {
    const s = path.join(source, entree.name);
    const c = path.join(cible, entree.name);
    if (entree.isDirectory()) copier(s, c);
    else fs.copyFileSync(s, c);
  }
}

module.exports = { esc, surligne, brut, enLigne, markdown, dateFr, dateCourte, tempsLecture, slug, lireJSON, lireDossier, ecrire, copier };
