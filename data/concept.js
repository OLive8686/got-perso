// --- Tables de concept de personnage (Tables 3-3 à 3-7) ---
//
// Source : Chapitre 3 du livre Green Ronin VF, pages 44-45.
//
// Chaque table est indexée par le résultat d'un jet de 2d6 (de 2 à 12).
// L'application les utilise pour :
//   - alimenter une <datalist> d'autocomplétion sur le champ correspondant
//   - permettre un tirage aléatoire pondéré (bouton 🎲)
//
// Les libellés sont des résumés fonctionnels en français, fidèles à
// l'esprit du livre, à utiliser comme valeurs par défaut. Le joueur
// reste libre d'écrire autre chose dans le champ texte.

// Table 3-3 : Événements personnels
const EVENEMENTS_PERSONNELS = {
  2:  "A servi une autre maison (page ou épée lige)",
  3:  "A vécu une histoire d'amour torride",
  4:  "A combattu ou été impliqué lors d'une bataille",
  5:  "A été enlevé — évasion, rançon ou secours",
  6:  "A voyagé sur le Détroit pendant un temps",
  7:  "A accompli un exploit important (sauvé son seigneur, tué un monstre…)",
  8:  "A côtoyé un personnage célèbre",
  9:  "Assistait à un tournoi important (spectateur ou participant)",
  10: "Impliqué dans un scandale crapuleux",
  11: "Faussement accusé d'un méfait",
  12: "Retenu en otage par une autre maison (pupille ou prisonnier)",
};

// Table 3-4 : Objectifs
const OBJECTIFS = {
  2:  "L'illumination",
  3:  "La compétence (maîtrise d'un domaine particulier)",
  4:  "La célébrité",
  5:  "Le savoir",
  6:  "L'amour",
  7:  "Le pouvoir",
  8:  "La sécurité",
  9:  "La vengeance",
  10: "La richesse",
  11: "La justice",
  12: "Le bien",
};

// Table 3-5 : Motivations
const MOTIVATIONS = {
  2:  "La charité",
  3:  "Le devoir",
  4:  "La peur",
  5:  "L'avidité",
  6:  "L'amour",
  7:  "La haine",
  8:  "La luxure",
  9:  "La paix",
  10: "La stabilité",
  11: "L'excellence",
  12: "La folie",
};

// Table 3-6 : Vertus
const VERTUS = {
  2:  "Charitable",
  3:  "Chaste",
  4:  "Courageux",
  5:  "Dévoué",
  6:  "Honnête",
  7:  "Humble",
  8:  "Juste",
  9:  "Magnanime",
  10: "Miséricordieux",
  11: "Pieux",
  12: "Sage",
};

// Table 3-7 : Vices
const VICES = {
  2:  "Ambitieux / cupide",
  3:  "Arrogant",
  4:  "Avare",
  5:  "Lâche",
  6:  "Cruel",
  7:  "Bête",
  8:  "Licencieux",
  9:  "Mesquin",
  10: "Partial",
  11: "Intrigant",
  12: "Colérique",
};

// Index unifié, pratique pour le tirage : nom du champ → table 2d6
const TABLES_CONCEPT = {
  histoire:   EVENEMENTS_PERSONNELS,
  objectif:   OBJECTIFS,
  motivation: MOTIVATIONS,
  vertu:      VERTUS,
  vice:       VICES,
};

// Tirage 2d6 : retourne un entier entre 2 et 12 inclus.
// Distribution : courbe en cloche (7 le plus fréquent).
function rollerDeuxD6() {
  return 1 + Math.floor(Math.random() * 6)
       + 1 + Math.floor(Math.random() * 6);
}

// Tire une entrée d'une table de concept.
// Si la table existe pas, retourne null.
function tirerConcept(nomChamp) {
  const table = TABLES_CONCEPT[nomChamp];
  if (!table) return null;
  const score = rollerDeuxD6();
  return table[score] || null;
}

// Vérification au chargement.
(function verifierIntegriteConcept() {
  Object.entries(TABLES_CONCEPT).forEach(([cle, t]) => {
    for (let i = 2; i <= 12; i++) {
      if (!t[i]) console.warn(`[concept.js] Table "${cle}" : entrée ${i} manquante.`);
    }
  });
  console.log(`[concept.js] ${Object.keys(TABLES_CONCEPT).length} tables de concept chargées (5 × 11 entrées).`);
})();
