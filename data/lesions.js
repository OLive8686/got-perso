// --- Lésions, Blessures, Santé (règles & seuils) ---
//
// Source : Chapitre 9, pages 161-162 du livre Green Ronin VF.
//
// MÉCANIQUE GLOBALE :
//   Quand un personnage encaisse des dégâts, il les soustrait à sa Santé.
//   Si Santé tombe à 0, il est vaincu.
//   Pour éviter d'être vaincu, il peut accepter une LÉSION ou une BLESSURE.
//
//   - LÉSION : annule un nombre de points de dégâts égal au rang
//     d'Endurance. Impose ensuite -1 à tous les tests par lésion.
//     Maximum de lésions = rang d'Endurance.
//
//   - BLESSURE : annule l'intégralité d'une attaque. Impose -1D
//     à tous les tests par blessure. Maximum de blessures = rang
//     d'Endurance ; si on dépasse, le personnage MEURT.
//
// CALCULS DÉRIVÉS (à implémenter dans js/calculs.js) :
//   - Santé          = rang d'Endurance × 3
//   - Max lésions    = rang d'Endurance
//   - Max blessures  = rang d'Endurance
//
// CE FICHIER NE CONTIENT QUE DES DONNÉES.

const LESIONS = {

  // Coefficient pour le calcul de Santé : Santé = Endurance × 3
  multiplicateur_sante: 3,

  // Pénalités cumulables
  malus_par_lesion: -1,        // au RÉSULTAT d'un test
  malus_par_blessure: '-1D',   // un dé de moins (à interpréter dans calculs.js)

  // -----------------------------------------------------------
  // RÉCUPÉRATION DES LÉSIONS — test d'Endurance après 1 jour
  // -----------------------------------------------------------
  // Difficulté selon le niveau d'activité du personnage pendant
  // la journée de repos.
  // 1 degré de réussite = 1 lésion en moins.
  // Échec critique = 1 lésion supplémentaire.
  recuperation_lesions: {
    delai: '1 jour',
    grain: '1 lésion par degré de réussite',
    echec_critique: '+1 lésion',
    activites: [
      { niveau: 'legere',    nom: 'Légère ou nulle', exemple: 'Repos, ni combat ni chevauchée',         difficulte: 6,  libelle: 'Simple' },
      { niveau: 'moyenne',   nom: 'Moyenne',         exemple: 'Voyage, activité physique normale',     difficulte: 9,  libelle: 'Délicate' },
      { niveau: 'epuisante', nom: 'Épuisante',       exemple: 'Combat, chevauchée, effort intense',     difficulte: 12, libelle: 'Corsée' },
    ]
  },

  // -----------------------------------------------------------
  // RÉCUPÉRATION DES BLESSURES — test d'Endurance après 1 semaine
  // -----------------------------------------------------------
  // 2 degrés de réussite = 1 blessure en moins.
  // Les soins (compétence Soins) peuvent remplacer ce test
  // dans certaines conditions.
  recuperation_blessures: {
    delai: '1 semaine',
    grain: '1 blessure par tranche de 2 degrés de réussite',
    echec_critique: '+1 blessure',
    activites: [
      { niveau: 'legere',    nom: 'Légère ou nulle', exemple: 'Repos complet',                          difficulte: 9,  libelle: 'Délicate' },
      { niveau: 'moyenne',   nom: 'Moyenne',         exemple: 'Voyage, activité physique normale',     difficulte: 15, libelle: 'Difficile' },
      { niveau: 'epuisante', nom: 'Épuisante',       exemple: 'Combat, chevauchée, effort intense',     difficulte: 21, libelle: 'Héroïque' },
    ]
  },

};

// Échelle de difficultés du système (référence pour cohérence des libellés)
const DIFFICULTES = [
  { libelle: 'Élémentaire', valeur: 0 },
  { libelle: 'Simple',      valeur: 6 },
  { libelle: 'Délicate',    valeur: 9 },
  { libelle: 'Corsée',      valeur: 12 },
  { libelle: 'Difficile',   valeur: 15 },
  { libelle: 'Très difficile', valeur: 18 },
  { libelle: 'Héroïque',    valeur: 21 },
  { libelle: 'Légendaire',  valeur: 24 },
];

// Vérification au chargement.
(function verifierIntegriteLesions() {
  const att = ['recuperation_lesions', 'recuperation_blessures', 'multiplicateur_sante'];
  att.forEach(k => {
    if (!(k in LESIONS)) console.warn(`[lesions.js] champ "${k}" manquant.`);
  });
  console.log(`[lesions.js] Tables de récupération chargées (lésions + blessures).`);
})();
