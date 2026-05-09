// --- Âges du personnage (Tables 3-8 et 3-10) ---
//
// Source : Chapitre 3 du livre Green Ronin VF, pages 47-49.
//
// CHAQUE ÂGE DÉFINIT :
//   - nom               : libellé affiché en français
//   - age_libelle       : tranche d'âge en clair (pour l'UI)
//   - age_min, age_max  : âge en années (null si "jusqu'à X" ou "X+")
//   - xp                : Points d'Expérience pour les COMPÉTENCES
//                         (Table 3-8)
//   - xp_specialites    : Points d'Expérience pour les SPÉCIALITÉS
//                         (Table 3-9, budget séparé du précédent)
//   - pd                : Points de Destinée de départ (Table 3-10)
//   - nb_max_avantages  : limite d'avantages que l'on peut acquérir
//                         à la création (Table 3-10)
//   - maxRank           : rang maximum atteignable dans une compétence
//                         (Statut excepté — voir règles Statut/Maison)
//
// CORRECTIONS vs. HTML d'origine (validées contre Tables 3-8 et 3-10) :
//   - PD recalibrés : enfant 3→7, adolescent 4→6, jeune adulte 4→5,
//     vieux 3→2, très vieux 2→1, vénérable 2→0.
//     Le HTML d'origine avait des valeurs visiblement inventées.
//   - Ajout de xp_specialites (Table 3-9) et nb_max_avantages (Table 3-10).
//
// IMPORTANT : les noms de champs (xp, pd, maxRank) sont conservés en
// anglais pour rester compatibles avec le code JS du HTML d'origine.
// Les nouveaux champs (xp_specialites, nb_max_avantages) sont en français.

const AGES = {
  enfant: {
    nom: 'Enfant',
    age_libelle: "Jusqu'à 9 ans",
    age_min: null, age_max: 9,
    xp: 120,
    xp_specialites: 40,
    pd: 7,
    nb_max_avantages: 3,
    maxRank: 4,
  },
  adolescent: {
    nom: 'Adolescent',
    age_libelle: '10–13 ans',
    age_min: 10, age_max: 13,
    xp: 150,
    xp_specialites: 40,
    pd: 6,
    nb_max_avantages: 3,
    maxRank: 4,
  },
  jeune_adulte: {
    nom: 'Jeune adulte',
    age_libelle: '14–18 ans',
    age_min: 14, age_max: 18,
    xp: 180,
    xp_specialites: 60,
    pd: 5,
    nb_max_avantages: 3,
    maxRank: 5,
  },
  adulte: {
    nom: 'Adulte',
    age_libelle: '18–30 ans',
    age_min: 18, age_max: 30,
    xp: 210,
    xp_specialites: 80,
    pd: 4,
    nb_max_avantages: 3,
    maxRank: 7,
  },
  age_mur: {
    nom: 'Âge mûr',
    age_libelle: '30–50 ans',
    age_min: 30, age_max: 50,
    xp: 240,
    xp_specialites: 100,
    pd: 3,
    nb_max_avantages: 3,
    maxRank: 6,
  },
  vieux: {
    nom: 'Vieux',
    age_libelle: '50–70 ans',
    age_min: 50, age_max: 70,
    xp: 270,
    xp_specialites: 160,
    pd: 2,
    nb_max_avantages: 3,
    maxRank: 5,
  },
  tres_vieux: {
    nom: 'Très vieux',
    age_libelle: '70–80 ans',
    age_min: 70, age_max: 80,
    xp: 330,
    xp_specialites: 200,
    pd: 1,
    nb_max_avantages: 1,
    maxRank: 5,
  },
  venerable: {
    nom: 'Vénérable',
    age_libelle: '80 ans et +',
    age_min: 80, age_max: null,
    xp: 360,
    xp_specialites: 240,
    pd: 0,
    nb_max_avantages: 0,
    maxRank: 5,
  },
};

// Coûts d'XP cumulés pour atteindre un rang de COMPÉTENCE
// donné depuis le rang 2 (rang de base).
// Source : Table 3-8 du livre.
// Le rang 1 "rapporte" 50 XP (faiblesse délibérée libérant du budget).
const XP_COST = {
  1: -50,
  2: 0,
  3: 10,
  4: 40,
  5: 70,
  6: 100,
  7: 130,
};

// Coût d'amélioration d'une spécialité : +1B = 10 XP, à toute étape.
// Source : règle "Acquérir ou améliorer une spécialité" (page 50).
const COUT_PAR_DE_SPECIALITE = 10;

// Table 3-11 : Faiblesses obligatoires selon l'âge.
// Une "faiblesse" impose -1D à une compétence donnée.
// Liste des compétences éligibles par tranche d'âge.
const FAIBLESSES_PAR_AGE = {
  // Avant l'adulte : aucun défaut ni faiblesse imposés
  enfant:       { nb_defauts_obligatoires: 0, nb_faiblesses_obligatoires: 0, competences_eligibles: [] },
  adolescent:   { nb_defauts_obligatoires: 0, nb_faiblesses_obligatoires: 0, competences_eligibles: [] },
  jeune_adulte: { nb_defauts_obligatoires: 0, nb_faiblesses_obligatoires: 0, competences_eligibles: [] },
  // Adulte : 1 défaut au choix (sans faiblesse imposée)
  adulte:       { nb_defauts_obligatoires: 1, nb_faiblesses_obligatoires: 0, competences_eligibles: [] },
  // Âge mûr : 1 défaut + 1 faiblesse parmi 3 compétences physiques
  age_mur:      {
    nb_defauts_obligatoires: 1,
    nb_faiblesses_obligatoires: 1,
    competences_eligibles: ['agilite', 'athletisme', 'endurance']
  },
  // Vieux : 1 défaut + 2 faiblesses parmi un panel élargi
  vieux:        {
    nb_defauts_obligatoires: 1,
    nb_faiblesses_obligatoires: 2,
    competences_eligibles: ['agilite', 'athletisme', 'corps', 'endurance', 'ingeniosite', 'tir', 'vigilance']
  },
  tres_vieux:   {
    nb_defauts_obligatoires: 1,
    nb_faiblesses_obligatoires: 3,
    competences_eligibles: ['agilite', 'athletisme', 'corps', 'endurance', 'ingeniosite', 'tir', 'vigilance']
  },
  venerable:    {
    nb_defauts_obligatoires: 1,
    nb_faiblesses_obligatoires: 4,
    competences_eligibles: ['agilite', 'athletisme', 'corps', 'endurance', 'ingeniosite', 'tir', 'vigilance']
  },
};

// Vérification au chargement.
(function verifierIntegriteAges() {
  const champsRequis = ['nom', 'age_libelle', 'xp', 'xp_specialites', 'pd', 'nb_max_avantages', 'maxRank'];
  Object.entries(AGES).forEach(([cle, a]) => {
    champsRequis.forEach(c => {
      if (!(c in a)) console.warn(`[ages.js] Âge "${cle}" : champ "${c}" manquant.`);
    });
    if (!(cle in FAIBLESSES_PAR_AGE)) {
      console.warn(`[ages.js] Âge "${cle}" : pas d'entrée dans FAIBLESSES_PAR_AGE.`);
    }
  });
  console.log(`[ages.js] ${Object.keys(AGES).length} âges chargés (XP_COST + Table 3-11 inclus).`);
})();
