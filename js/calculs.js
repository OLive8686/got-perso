// === Calculs des stats dérivées et des coûts ===
//
// Sources : Chapitres 3, 4, 5 et 9 du livre Green Ronin VF.
//
// Ce fichier contient uniquement des FONCTIONS PURES qui prennent un
// objet `state` (l'état du personnage) et retournent une valeur calculée.
// AUCUN accès au DOM, AUCUN effet de bord. Toute la couche d'affichage
// vivra dans js/ui.js (à venir).
//
// FORMAT ATTENDU DE state :
//   {
//     age:           'adulte',                 // clé d'AGES (data/ages.js)
//     skills:        { agilite: 3, ... },      // clé SKILLS -> rang (défaut 2)
//     specialties:   {                         // 2 formats supportés :
//       agilite: new Set(['Esquive']),         //   (a) Set : présent = 1B (héritage HTML)
//       corps:   { 'Lames longues': 2 }        //   (b) Object : nom -> rang en B
//     },
//     armure:        'cotte_de_mailles' | null, // id ARMURES
//     bouclier:      'bouclier' | null,         // id BOUCLIERS
//     armesEnMain:   ['epee_longue', ...],      // ids ARMES — armes tenues
//     armesAttaque:  ['epee_longue']            // ids ARMES servant à attaquer
//                                                //  (pour la règle Défensive)
//   }
//
// DÉPENDANCES (à charger AVANT ce fichier) :
//   data/qualites.js, data/armes.js, data/armures.js, data/boucliers.js,
//   data/deplacement.js, data/lesions.js, data/competences.js, data/ages.js

// =============================================================
// HELPERS — accès robuste à l'état
// =============================================================

/**
 * Retourne le rang d'une compétence.
 * @param {object} state - état du personnage
 * @param {string} key   - clé SKILLS (ex. 'agilite')
 * @returns {number} rang (par défaut 2)
 */
function getRangCompetence(state, key) {
  if (!state || !state.skills) return 2;
  const r = state.skills[key];
  return (typeof r === 'number') ? r : 2;
}

/**
 * Retourne le rang (en dés bonus, B) d'une spécialité donnée.
 * Supporte les deux formats de state.specialties :
 *   - Set : présent => 1B
 *   - Object : nom -> rang
 * @returns {number} rang en B (0 si absente)
 */
function getRangSpecialite(state, skillKey, specName) {
  if (!state || !state.specialties) return 0;
  const specs = state.specialties[skillKey];
  if (!specs) return 0;
  if (specs instanceof Set) return specs.has(specName) ? 1 : 0;
  if (typeof specs === 'object') {
    const r = specs[specName];
    return (typeof r === 'number') ? r : 0;
  }
  return 0;
}

/**
 * Lookup d'une arme par id dans le catalogue ARMES.
 * @returns {object|null}
 */
function trouverArme(id) {
  return (typeof ARMES !== 'undefined') ? (ARMES.find(a => a.id === id) || null) : null;
}

function trouverArmure(id) {
  return (typeof ARMURES !== 'undefined') ? (ARMURES.find(a => a.id === id) || null) : null;
}

function trouverBouclier(id) {
  return (typeof BOUCLIERS !== 'undefined') ? (BOUCLIERS.find(b => b.id === id) || null) : null;
}

// =============================================================
// STATS DÉRIVÉES
// =============================================================

/**
 * Défense de Combat = Agilité + Athlétisme + Vigilance
 *                   + Bonus Défensif (boucliers + armes Défensives non-attaquantes)
 *                   + Malus d'Armure (stocké comme entier négatif)
 *
 * Règle "Défensive" (qualites.js) : une arme Défensive ne donne son
 * bonus que si elle N'EST PAS utilisée pour attaquer ce tour.
 * On considère ici qu'une arme dans `armesEnMain` mais PAS dans
 * `armesAttaque` contribue au bonus défensif. Si `armesAttaque`
 * n'est pas fourni, on suppose qu'aucune arme n'attaque
 * (cas d'affichage sur la fiche).
 */
function calcDefenseCombat(state) {
  const agi = getRangCompetence(state, 'agilite');
  const ath = getRangCompetence(state, 'athletisme');
  const vig = getRangCompetence(state, 'vigilance');

  // Malus d'armure (stocké négatif → on l'additionne)
  const armure = trouverArmure(state.armure);
  const malusArmure = armure ? armure.malus_armure : 0;

  // Bonus défensif : bouclier (toujours actif s'il est tenu)
  const bouclier = trouverBouclier(state.bouclier);
  let bonusDefensif = bouclier ? bouclier.bonus_defensif : 0;

  // Bonus défensif : armes ayant la qualité Defensive et NON utilisées pour attaquer
  const armesEnMain = state.armesEnMain || [];
  const armesAttaque = new Set(state.armesAttaque || []);
  armesEnMain.forEach(id => {
    if (armesAttaque.has(id)) return; // on attaque avec — on perd Défensive
    const arme = trouverArme(id);
    if (!arme) return;
    const def = arme.qualites.find(q => q.id === 'defensive');
    if (def && typeof def.valeur === 'number') {
      bonusDefensif += def.valeur;
    }
  });

  return agi + ath + vig + bonusDefensif + malusArmure;
}

/** Défense d'Intrigue = Vigilance + Ingéniosité + Statut */
function calcDefenseIntrigue(state) {
  return getRangCompetence(state, 'vigilance')
       + getRangCompetence(state, 'ingeniosite')
       + getRangCompetence(state, 'statut');
}

/** Sang-Froid = 3 × Volonté */
function calcSangFroid(state) {
  return 3 * getRangCompetence(state, 'volonte');
}

/** Santé = 3 × Endurance */
function calcSante(state) {
  return 3 * getRangCompetence(state, 'endurance');
}

/** Lésions et Blessures sont plafonnées au rang d'Endurance. */
function calcMaxLesions(state)   { return getRangCompetence(state, 'endurance'); }
function calcMaxBlessures(state) { return getRangCompetence(state, 'endurance'); }

/** Valeur d'Armure (lookup dans ARMURES) */
function calcVA(state) {
  const armure = trouverArmure(state.armure);
  return armure ? armure.va : 0;
}

/**
 * Encombrement total = armure + bouclier + armes Encombrantes en main.
 * Utilisé par calcDeplacement.
 */
function calcEncombrement(state) {
  let total = 0;

  const armure = trouverArmure(state.armure);
  if (armure) total += armure.encombrement;

  const bouclier = trouverBouclier(state.bouclier);
  if (bouclier) {
    const enc = bouclier.qualites.find(q => q.id === 'encombrante');
    if (enc) total += enc.valeur;
  }

  (state.armesEnMain || []).forEach(id => {
    const arme = trouverArme(id);
    if (!arme) return;
    const enc = arme.qualites.find(q => q.id === 'encombrante');
    if (enc) total += enc.valeur;
  });

  return total;
}

/**
 * Déplacement (mètres par tour). Algorithme :
 *   1. Base : 4 m
 *   2. Bonus de la spécialité Course : +1 m par tranche de 2 dés bonus
 *      (Table 9-1)
 *   3. Si Athlétisme = 1 ET aucun bonus en Course : -3 m
 *   4. Effet d'Encombrement : -1 m par tranche entamée de 2 points
 *   5. Plancher : 1 m
 */
function calcDeplacement(state) {
  const ath = getRangCompetence(state, 'athletisme');
  const courseBonus = getRangSpecialite(state, 'athletisme', 'Course');
  const D = (typeof DEPLACEMENT !== 'undefined') ? DEPLACEMENT : null;
  if (!D) return 4;

  let dep = D.base;

  // 2. Bonus Course (Table 9-1)
  const tranche = D.table_9_1.find(t =>
    courseBonus >= t.des_bonus_min && courseBonus <= t.des_bonus_max
  );
  if (tranche) {
    dep += tranche.bonus_metres;
  } else if (courseBonus > 7) {
    // Au-delà du tableau : extrapolation prudente, +1 m par tranche de 2 supplémentaire
    dep += 3 + Math.floor((courseBonus - 7) / 2);
  }

  // 3. Pénalité Athlétisme rang 1, annulée par tout bonus de Course
  if (ath <= D.rang_athletisme_seuil && courseBonus === 0) {
    dep += D.malus_athletisme_faible;
  }

  // 4. Effet Encombrement
  const enc = calcEncombrement(state);
  const malusEnc = Math.floor(enc / D.encombrement_par_tranche);
  dep -= malusEnc;

  // 5. Plancher
  return Math.max(D.deplacement_min, dep);
}

/** Sprint = Déplacement × 4 - Encombrement total. Plancher 4 m. */
function calcSprint(state) {
  const D = (typeof DEPLACEMENT !== 'undefined') ? DEPLACEMENT : null;
  if (!D) return 16;
  const dep = calcDeplacement(state);
  const enc = calcEncombrement(state);
  return Math.max(D.sprint_min, dep * D.sprint_multiplicateur - enc);
}

// =============================================================
// COÛTS XP / PD ET BUDGETS
// =============================================================

/** Coût XP cumulé pour atteindre un rang de COMPÉTENCE depuis le rang 2. */
function coutCompetence(rang) {
  if (typeof XP_COST === 'undefined') return 0;
  return XP_COST[rang] ?? 0;
}

/**
 * Coût XP cumulé pour atteindre un rang de SPÉCIALITÉ (en B) depuis 0.
 * Chaque +1B coûte 10 XP. Cf. règle page 50.
 */
function coutSpecialite(rangB) {
  if (typeof COUT_PAR_DE_SPECIALITE === 'undefined') return rangB * 10;
  return rangB * COUT_PAR_DE_SPECIALITE;
}

/** Total XP investi dans toutes les compétences du personnage. */
function totalXPCompetences(state) {
  let total = 0;
  Object.values(state.skills || {}).forEach(rang => {
    total += coutCompetence(rang);
  });
  return total;
}

/** Total XP investi dans toutes les spécialités du personnage. */
function totalXPSpecialites(state) {
  let total = 0;
  Object.values(state.specialties || {}).forEach(specs => {
    if (specs instanceof Set) {
      // Format hérité : chaque spécialité présente = 1B = 10 XP
      total += specs.size * coutSpecialite(1);
    } else if (typeof specs === 'object') {
      Object.values(specs).forEach(rang => {
        total += coutSpecialite(rang);
      });
    }
  });
  return total;
}

/** Budget XP pour les compétences, fonction de l'âge. */
function budgetXP(state) {
  if (typeof AGES === 'undefined') return 0;
  const a = AGES[state.age];
  return a ? a.xp : 0;
}

/** Budget XP séparé pour les spécialités, fonction de l'âge. */
function budgetXPSpecialites(state) {
  if (typeof AGES === 'undefined') return 0;
  const a = AGES[state.age];
  return a ? a.xp_specialites : 0;
}

function xpRestant(state)            { return budgetXP(state) - totalXPCompetences(state); }
function xpRestantSpecialites(state) { return budgetXPSpecialites(state) - totalXPSpecialites(state); }

/** Points de Destinée de départ (Table 3-10). */
function budgetPD(state) {
  if (typeof AGES === 'undefined') return 0;
  const a = AGES[state.age];
  return a ? a.pd : 0;
}

/** Nombre maximal d'avantages que le personnage peut acquérir (Table 3-10). */
function nbMaxAvantages(state) {
  if (typeof AGES === 'undefined') return 3;
  const a = AGES[state.age];
  return a ? a.nb_max_avantages : 3;
}

// =============================================================
// COMBAT — DÉGÂTS D'UNE ARME
// =============================================================

/**
 * Dégâts de base d'une arme. Ce sont des points de dégâts FLAT
 * (pas un jet de dés — voir page 159 du livre, ex. "5 × 3 = 15 dégâts").
 *
 * Formule : rang(attribut_degats) + mod_degats
 * Modificateurs optionnels via `options` :
 *   - aDeuxMains      : si vrai, applique le bonus de Polyvalente (+1)
 *   - desForceInvestis: pour les armes Puissantes, ajoute +1 par dé de
 *                       Force investi dans le test
 *
 * Renvoie un nombre ≥ 1.
 */
function calcDegatsArme(state, arme, options = {}) {
  if (!arme) return 0;
  const rang = getRangCompetence(state, arme.attribut_degats);
  let degats = rang + arme.mod_degats;

  const { aDeuxMains = false, desForceInvestis = 0 } = options;

  if (aDeuxMains) {
    const polyvalente = arme.qualites.find(q => q.id === 'polyvalente');
    if (polyvalente) degats += 1;
  }

  if (desForceInvestis > 0) {
    const puissante = arme.qualites.find(q => q.id === 'puissante');
    if (puissante) degats += desForceInvestis;
  }

  return Math.max(1, degats);
}

/**
 * Règle Formation (page 151) :
 *   "Vous perdez le nombre de dés de bonus précisé aux tests avec l'arme.
 *    Si le malus fait tomber vos dés bonus à moins de 0, vous subissez
 *    1 dé de malus pour chaque -1 supplémentaire."
 *
 * Calcul : effectif = rangSpécialité - formationRequise.
 *   - effectif ≥ 0 : pas de malus, on garde `effectif` dés bonus.
 *   - effectif < 0 : 0 dés bonus, et |effectif| dés de malus (-XD).
 *
 * @returns {{ bonus_disponibles: number, malus_des: number }}
 *   - bonus_disponibles : dés de bonus utilisables avec cette arme
 *   - malus_des         : nombre de dés de malus (à appliquer comme -XD au test)
 */
function calcFormation(state, arme) {
  if (!arme.formation) {
    // Pas de Formation requise : tous les dés bonus de spécialité s'appliquent.
    const rangSpec = getRangSpecialite(state, arme.competence_test, arme.specialite_test);
    return { bonus_disponibles: rangSpec, malus_des: 0 };
  }

  const rangSpec = getRangSpecialite(state, arme.competence_test, arme.specialite_test);
  const effectif = rangSpec - arme.formation;

  if (effectif >= 0) {
    return { bonus_disponibles: effectif, malus_des: 0 };
  } else {
    return { bonus_disponibles: 0, malus_des: -effectif };
  }
}

// =============================================================
// VALIDATIONS DE CARACTÉRISATION
// =============================================================

/**
 * Vérifie qu'aucune compétence ne dépasse le rang max permis par l'âge
 * (Statut excepté — cf. règles Statut/Maison du chapitre 3).
 * @returns {string[]} liste des messages d'erreur (vide si tout va bien)
 */
function validerRangsMax(state) {
  const erreurs = [];
  if (typeof AGES === 'undefined') return erreurs;
  const ageData = AGES[state.age];
  if (!ageData) return erreurs;
  const max = ageData.maxRank;

  Object.entries(state.skills || {}).forEach(([key, rang]) => {
    if (key === 'statut') return; // exception
    if (rang > max) {
      erreurs.push(`Compétence "${key}" : rang ${rang} > maximum ${max} pour l'âge "${state.age}".`);
    }
  });
  return erreurs;
}

/**
 * Vérifie que le rang d'une spécialité ne dépasse pas le rang de sa compétence.
 * Règle page 48 : "Aucune spécialité ne peut avoir plus de dés bonus que
 * votre rang dans la compétence."
 */
function validerRangsSpecialites(state) {
  const erreurs = [];
  Object.entries(state.specialties || {}).forEach(([skillKey, specs]) => {
    const rangComp = getRangCompetence(state, skillKey);
    const checkRang = (rangSpec, name) => {
      if (rangSpec > rangComp) {
        erreurs.push(`Spécialité "${name}" (${skillKey}) : ${rangSpec}B > rang compétence ${rangComp}.`);
      }
    };
    if (specs instanceof Set) {
      specs.forEach(name => checkRang(1, name));
    } else if (typeof specs === 'object') {
      Object.entries(specs).forEach(([name, rang]) => checkRang(rang, name));
    }
  });
  return erreurs;
}

// =============================================================
// AUTO-TEST AU CHARGEMENT
// =============================================================
// Quelques cas de référence pour vérifier que les formules tiennent.
// Tirés de l'exemple "Tom" pages 47-49 du livre.
(function autoTestCalculs() {
  // Skip silencieusement si on n'est pas dans un environnement avec les data files
  if (typeof AGES === 'undefined' || typeof DEPLACEMENT === 'undefined') return;

  const tom = {
    age: 'adulte',
    skills: {
      agilite: 3, connaissance: 4, corps: 3, endurance: 3,
      ingeniosite: 3, langue: 3, larcin: 3, persuasion: 5,
      statut: 3, survie: 3, vigilance: 3, volonte: 3,
      // toutes les autres restent à 2 (athletisme inclus)
      athletisme: 2,
    },
    specialties: {},
    armure: null, bouclier: null, armesEnMain: []
  };

  const tests = [
    ['Défense Intrigue (Tom)',     calcDefenseIntrigue(tom),  9],   // page 50 : 9
    ['Sang-Froid (Tom)',           calcSangFroid(tom),         9],   // 3×3 = 9
    ['Défense Combat (Tom, nu)',   calcDefenseCombat(tom),     8],   // 3+2+3 = 8
    ['Santé (Tom)',                calcSante(tom),             9],   // 3×3 = 9
    ['Budget XP (adulte)',         budgetXP(tom),              210],
    ['Budget PD (adulte)',         budgetPD(tom),              4],
    ['Déplacement (sans armure)',  calcDeplacement(tom),       4],   // base
  ];

  let echecs = 0;
  tests.forEach(([nom, valeur, attendu]) => {
    if (valeur !== attendu) {
      console.warn(`[calculs.js] Échec auto-test "${nom}" : attendu ${attendu}, obtenu ${valeur}.`);
      echecs++;
    }
  });
  if (echecs === 0) {
    console.log(`[calculs.js] ${tests.length} auto-tests OK (exemple Tom du livre, pages 47-50).`);
  }
})();
