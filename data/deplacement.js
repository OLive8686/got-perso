// --- Règles de Déplacement (Table 9-1 + règles associées) ---
//
// Source : Chapitre 9, pages 150-151 du livre Green Ronin VF.
//
// CE FICHIER NE CONTIENT QUE DES DONNÉES.
// Les calculs (déplacement effectif d'un personnage donné) sont dans
// js/calculs.js, qui consomme ces constantes.
//
// FORMULE DE CALCUL DU DÉPLACEMENT (à implémenter dans calculs.js) :
//
//   1. Partir du Déplacement de base : 4 mètres.
//   2. Effet de la spécialité Course (Athlétisme) :
//      → ajouter le bonus de la TABLE 9-1 selon le nombre de dés bonus
//        de Course que possède le personnage (0–7 dés bonus).
//   3. Pénalité d'Athlétisme insuffisant :
//      → si rang d'Athlétisme = 1, réduire le déplacement de 3 mètres
//        (ce malus est annulé par tout bonus en Course).
//   4. Effet de l'Encombrement :
//      → calculer l'Encombrement total = somme des encombrements
//        de l'armure, des armes Encombrantes, du grand bouclier, etc.
//      → pour chaque tranche entamée de 2 points d'Encombrement,
//        retirer 1 mètre au déplacement.
//   5. Plancher : le déplacement ne peut tomber sous 1 mètre.
//
// SPRINT (action majeure) :
//   - distance = déplacement modifié × 4, moins encombrement total
//   - jamais en dessous de 4 mètres

const DEPLACEMENT = {

  // Déplacement par défaut (mètres) sans armure et sans bonus de Course
  base: 4,

  // Pénalité si Athlétisme rang 1 (annulée par tout bonus en Course)
  malus_athletisme_faible: -3,
  rang_athletisme_seuil: 1,

  // Plancher absolu du déplacement
  deplacement_min: 1,

  // Sprint : multiplicateur et plancher
  sprint_multiplicateur: 4,
  sprint_min: 4,

  // Encombrement
  encombrement_par_tranche: 2,        // 2 points d'Enc → 1 mètre en moins
  malus_par_tranche_encombrement: -1, // (en mètres)

  // TABLE 9-1 : bonus de déplacement selon les dés bonus en Course
  // "des_bonus_min/max" = nombre de dés bonus dans la spécialité Course
  // "bonus_metres" = ajouté au déplacement de base
  // "deplacement_total" = base (4m) + bonus, fourni pour confort d'affichage
  table_9_1: [
    { des_bonus_min: 0, des_bonus_max: 1, bonus_metres: 0, deplacement_total: 4 },
    { des_bonus_min: 2, des_bonus_max: 3, bonus_metres: 1, deplacement_total: 5 },
    { des_bonus_min: 4, des_bonus_max: 5, bonus_metres: 2, deplacement_total: 6 },
    { des_bonus_min: 6, des_bonus_max: 7, bonus_metres: 3, deplacement_total: 7 },
  ],

};

// Vérification au chargement.
(function verifierIntegriteDeplacement() {
  if (typeof DEPLACEMENT.base !== 'number' || DEPLACEMENT.base !== 4) {
    console.warn("[deplacement.js] base devrait être 4 mètres.");
  }
  console.log(`[deplacement.js] Table 9-1 chargée (${DEPLACEMENT.table_9_1.length} tranches).`);
})();
