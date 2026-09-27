// Révisons Nos Classiques — petits comportements du site.
(function () {
  "use strict";

  var stockage = {
    lire: function (cle) { try { return window.localStorage.getItem(cle); } catch (e) { return null; } },
    ecrire: function (cle, valeur) { try { window.localStorage.setItem(cle, valeur); } catch (e) {} },
  };

  // Boutons « Copier le lien ».
  document.querySelectorAll("[data-copier]").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      var texte = bouton.getAttribute("data-copier");
      var libelle = bouton.textContent;
      var fini = function () {
        bouton.textContent = "Lien copié";
        setTimeout(function () { bouton.textContent = libelle; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(texte).then(fini, fini);
      else fini();
    });
  });

  // Menu déroulant « Magazine ».
  var boutonMenu = document.querySelector(".nav__bouton");
  var panneau = document.getElementById("menu-magazine");
  if (boutonMenu && panneau) {
    var cadre = panneau.parentElement;
    var placer = function () {
      if (window.matchMedia("(min-width: 900px)").matches) {
        panneau.style.left = boutonMenu.getBoundingClientRect().left - cadre.getBoundingClientRect().left - 18 + "px";
      } else {
        panneau.style.left = "";
      }
    };
    var basculer = function (ouvert) {
      boutonMenu.setAttribute("aria-expanded", ouvert ? "true" : "false");
      panneau.hidden = !ouvert;
      if (ouvert) placer();
    };
    boutonMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      basculer(panneau.hidden);
    });
    document.addEventListener("click", function (e) {
      if (!panneau.hidden && !panneau.contains(e.target)) basculer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panneau.hidden) {
        basculer(false);
        boutonMenu.focus();
      }
    });
    window.addEventListener("resize", function () { if (!panneau.hidden) placer(); });
  }

  // On retient qu'une personne s'est inscrite pour ne plus la solliciter.
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function () { stockage.ecrire("rnc-inscrit", "1"); });
  });

  var popup = document.getElementById("popup");
  var barre = document.getElementById("barre-collante");
  if (!popup) return;

  var dejaInscrit = stockage.lire("rnc-inscrit") === "1";
  var dernierAffichage = parseInt(stockage.lire("rnc-popup") || "0", 10);
  var trenteJours = 30 * 24 * 60 * 60 * 1000;
  var peutAfficher = !dejaInscrit && Date.now() - dernierAffichage > trenteJours;
  var dejaAffiche = false;
  var elementAvant = null;

  function ouvrir() {
    if (dejaAffiche || !peutAfficher) return;
    dejaAffiche = true;
    stockage.ecrire("rnc-popup", String(Date.now()));
    elementAvant = document.activeElement;
    popup.hidden = false;
    if (barre) barre.hidden = true;
    var champ = popup.querySelector("input[type=email]");
    if (champ) champ.focus();
  }

  function fermer() {
    popup.hidden = true;
    if (elementAvant && elementAvant.focus) elementAvant.focus();
  }

  popup.querySelectorAll("[data-fermer]").forEach(function (el) { el.addEventListener("click", fermer); });
  popup.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });

  // La fenêtre s'ouvre quand le lecteur a lu environ 60 % de l'article, jamais à l'arrivée.
  function progression() {
    var h = document.documentElement;
    var lu = (h.scrollTop + window.innerHeight) / h.scrollHeight;
    if (lu > 0.6) ouvrir();
    if (barre && !dejaInscrit) barre.hidden = !popup.hidden || h.scrollTop < 500;
  }
  window.addEventListener("scroll", progression, { passive: true });
})();
