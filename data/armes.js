// --- Catalogue d'armes du Trône de Fer JdR (Table 9-3) ---
//
// Ce fichier contient les ~50 armes du livre de règles, dans le format
// utilisé par l'application. Il dépend de QUALITES (data/qualites.js)
// — qualites.js DOIT être chargé AVANT ce fichier.
//
// FORMAT D'UNE ARME :
//   - id              : identifiant interne snake_case sans accent
//   - nom             : libellé affiché (avec accents)
//   - categorie       : groupe pour le tri du <select> (ex. "Lames longues")
//   - competence_test : clé SKILLS dont le rang est testé pour TOUCHER
//                       (corps | tir | dressage)
//   - specialite_test : nom de la spécialité dans laquelle un rang
//                       donne des dés bonus (doit matcher SKILLS.specs)
//   - formation       : rang minimum requis dans la spécialité ;
//                       null = aucune ; 1 ou 2 = pénalité -XD si rang inférieur
//   - attribut_degats : clé SKILLS dont le rang fournit le nombre de dés
//                       de dégâts de base (agilite | athletisme | dressage)
//   - mod_degats      : entier ajouté/soustrait au nombre de dés
//                       (dégâts finaux = state.skills[attribut_degats] + mod_degats)
//   - qualites        : tableau de { id, valeur? } référençant QUALITES
//                       valeur uniquement si la qualité est paramétrée
//
// CORRECTIONS APPLIQUÉES (vs. HTML monolithique d'origine), validées
// contre la Table 9-3 du livre Green Ronin VF :
//   1. "Lanx" renommé en "Lance" (typo de la source).
//   2. Couteau (rixe) : qualité "Secondaire +1" ajoutée (manquait).
//   3. Armes de Jet (Javeline, Hachette jet, Fronde) : competence_test
//      corrigé en 'tir' (la source HTML avait 'corps', incohérent avec
//      la règle "Faites un test de Tir lorsque vous vous servez d'une
//      arme à distance" — livre p. 149).
//   4. Toutes les armes de Jet ont specialite_test='Jet' pour matcher
//      la colonne Spécialité du tableau.
//   5. Armes ajoutées (présentes dans Table 9-3, absentes du HTML d'origine) :
//      Filet, Foëne (jet), Trident (jet), Lance (jet).
//
// POINTS QUI NÉCESSITERONT UNE MAJ DE SKILLS DANS L'APP :
//   - "Jet" doit être ajouté à SKILLS.tir.specs (n'y est pas actuellement).
//   - "Dressage combat" doit être ajouté à SKILLS.dressage.specs (idem).
//   - "Armes d'hast" (catégorie) vs "Armes à hast" (spécialité) reste un
//     mismatch d'orthographe à harmoniser dans SKILLS si tu veux.

const ARMES = [

  // =========================================================
  // ARBALÈTES
  // =========================================================
  {
    id: 'arbalete',
    nom: 'Arbalète',
    categorie: 'Arbalètes',
    competence_test: 'tir',
    specialite_test: 'Arbalètes',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: +1,
    qualites: [
      { id: 'portee_longue' },
      { id: 'perforante', valeur: 1 },
      { id: 'rechargement', valeur: 'mineure' },
      { id: 'lente' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'arbalete_legere',
    nom: 'Arbalète légère',
    categorie: 'Arbalètes',
    competence_test: 'tir',
    specialite_test: 'Arbalètes',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: +1,
    qualites: [
      { id: 'portee_longue' },
      { id: 'rechargement', valeur: 'mineure' },
      { id: 'lente' },
    ]
  },
  {
    id: 'arbalete_lourde',
    nom: 'Arbalète lourde',
    categorie: 'Arbalètes',
    competence_test: 'tir',
    specialite_test: 'Arbalètes',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: +2,
    qualites: [
      { id: 'portee_longue' },
      { id: 'perforante', valeur: 1 },
      { id: 'rechargement', valeur: 'majeure' },
      { id: 'lente' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'arbalete_myrienne',
    nom: 'Arbalète myrienne',
    categorie: 'Arbalètes',
    competence_test: 'tir',
    specialite_test: 'Arbalètes',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: +1,
    qualites: [
      { id: 'portee_longue' },
      { id: 'perforante', valeur: 1 },
      { id: 'deux_mains' },
      { id: 'rapide' },
    ]
  },

  // =========================================================
  // ARCS
  // =========================================================
  {
    id: 'arc_courbe',
    nom: 'Arc courbe',
    categorie: 'Arcs',
    competence_test: 'tir',
    specialite_test: 'Arcs',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: +1,
    qualites: [
      { id: 'portee_longue' },
      { id: 'puissante' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'arc_de_chasse',
    nom: 'Arc de chasse',
    categorie: 'Arcs',
    competence_test: 'tir',
    specialite_test: 'Arcs',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: 0,
    qualites: [
      { id: 'portee_longue' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'arc_long',
    nom: 'Arc long',
    categorie: 'Arcs',
    competence_test: 'tir',
    specialite_test: 'Arcs',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: +2,
    qualites: [
      { id: 'portee_longue' },
      { id: 'perforante', valeur: 1 },
      { id: 'deux_mains' },
      { id: 'incommode' },
    ]
  },

  // =========================================================
  // ARMES D'HAST
  // (catégorie "Armes d'hast", spécialité SKILLS = "Armes à hast")
  // =========================================================
  {
    id: 'hache_d_armes',
    nom: "Hache d'armes",
    categorie: "Armes d'hast",
    competence_test: 'corps',
    specialite_test: 'Armes à hast',
    formation: 1,
    attribut_degats: 'athletisme',
    mod_degats: +3,
    qualites: [
      { id: 'encombrante', valeur: 1 },
      { id: 'puissante' },
      { id: 'allonge' },
      { id: 'deux_mains' },
      { id: 'incommode' },
    ]
  },
  {
    id: 'hallebarde',
    nom: 'Hallebarde',
    categorie: "Armes d'hast",
    competence_test: 'corps',
    specialite_test: 'Armes à hast',
    formation: 1,
    attribut_degats: 'athletisme',
    mod_degats: +3,
    qualites: [
      { id: 'encombrante', valeur: 1 },
      { id: 'puissante' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'outil_de_paysan',
    nom: 'Outil de paysan',
    categorie: "Armes d'hast",
    competence_test: 'corps',
    specialite_test: 'Armes à hast',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +2,
    qualites: [
      { id: 'deux_mains' },
      { id: 'incommode' },
      { id: 'fragile' },
    ]
  },

  // =========================================================
  // CASSE-TÊTE
  // =========================================================
  {
    id: 'baton',
    nom: 'Bâton',
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'rapide' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'fleau',
    nom: 'Fléau',
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: 1,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'puissante' },
      { id: 'fracassante', valeur: 1 },
    ]
  },
  {
    id: 'fleau_d_armes',
    nom: "Fléau d'armes",
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: 2,
    attribut_degats: 'athletisme',
    mod_degats: +3,
    qualites: [
      { id: 'puissante' },
      { id: 'fracassante', valeur: 1 },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'trique_gourdin',
    nom: 'Trique / Gourdin',
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -1,
    qualites: [
      { id: 'secondaire', valeur: 1 },
    ]
  },
  {
    id: 'masse_d_armes',
    nom: "Masse d'armes",
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: []
  },
  {
    id: 'maillet',
    nom: 'Maillet',
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +1,
    qualites: [
      { id: 'encombrante', valeur: 1 },
      { id: 'fracassante', valeur: 1 },
      { id: 'lente' },
      { id: 'assommante' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'marteau_de_guerre',
    nom: 'Marteau de guerre',
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'encombrante', valeur: 1 },
      { id: 'puissante' },
      { id: 'fracassante', valeur: 2 },
      { id: 'lente' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'morgenstern',
    nom: 'Morgenstern',
    categorie: 'Casse-tête',
    competence_test: 'corps',
    specialite_test: 'Casse-tête',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'fracassante', valeur: 1 },
      { id: 'hargneuse' },
    ]
  },

  // =========================================================
  // ESCRIME
  // =========================================================
  {
    id: 'epee_braavosi',
    nom: 'Épée bräavosi',
    categorie: 'Escrime',
    competence_test: 'corps',
    specialite_test: 'Escrime',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: 0,
    qualites: [
      { id: 'defensive', valeur: 1 },
      { id: 'rapide' },
    ]
  },
  {
    id: 'epee_courte',
    nom: 'Épée courte',
    categorie: 'Escrime',
    competence_test: 'corps',
    specialite_test: 'Escrime',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: -1,
    qualites: [
      { id: 'rapide' },
    ]
  },
  {
    id: 'main_gauche',
    nom: 'Main gauche',
    categorie: 'Escrime',
    competence_test: 'corps',
    specialite_test: 'Escrime',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: -1,
    qualites: [
      { id: 'defensive', valeur: 2 },
      { id: 'secondaire', valeur: 1 },
    ]
  },

  // =========================================================
  // HACHES
  // =========================================================
  {
    id: 'bec_de_corbin',
    nom: 'Bec-de-corbin',
    categorie: 'Haches',
    competence_test: 'corps',
    specialite_test: 'Haches',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -1,
    qualites: [
      { id: 'fracassante', valeur: 1 },
    ]
  },
  {
    id: 'cognee',
    nom: 'Cognée',
    categorie: 'Haches',
    competence_test: 'corps',
    specialite_test: 'Haches',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +1,
    qualites: [
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'hache_de_bataille',
    nom: 'Hache de bataille',
    categorie: 'Haches',
    competence_test: 'corps',
    specialite_test: 'Haches',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'polyvalente' },
    ]
  },
  {
    id: 'hachette_hache',
    nom: 'Hachette',
    categorie: 'Haches',
    competence_test: 'corps',
    specialite_test: 'Haches',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -1,
    qualites: [
      { id: 'defensive', valeur: 1 },
      { id: 'secondaire', valeur: 1 },
    ]
  },
  {
    id: 'hache_longue',
    nom: 'Hache longue',
    categorie: 'Haches',
    competence_test: 'corps',
    specialite_test: 'Haches',
    formation: 1,
    attribut_degats: 'athletisme',
    mod_degats: +3,
    qualites: [
      { id: 'encombrante', valeur: 1 },
      { id: 'puissante' },
      { id: 'allonge' },
      { id: 'deux_mains' },
      { id: 'hargneuse' },
    ]
  },
  {
    id: 'pioche',
    nom: 'Pioche',
    categorie: 'Haches',
    competence_test: 'corps',
    specialite_test: 'Haches',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +1,
    qualites: [
      { id: 'puissante' },
      { id: 'lente' },
      { id: 'deux_mains' },
    ]
  },

  // =========================================================
  // LAMES COURTES
  // =========================================================
  {
    id: 'dague',
    nom: 'Dague',
    categorie: 'Lames courtes',
    competence_test: 'corps',
    specialite_test: 'Lames courtes',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: -2,
    qualites: [
      { id: 'defensive', valeur: 1 },
      { id: 'secondaire', valeur: 1 },
    ]
  },
  {
    id: 'poignard',
    nom: 'Poignard',
    categorie: 'Lames courtes',
    competence_test: 'corps',
    specialite_test: 'Lames courtes',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: -2,
    qualites: [
      { id: 'secondaire', valeur: 2 },
    ]
  },
  {
    id: 'stylet',
    nom: 'Stylet',
    categorie: 'Lames courtes',
    competence_test: 'corps',
    specialite_test: 'Lames courtes',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: 0,
    qualites: [
      { id: 'perforante', valeur: 2 },
    ]
  },

  // =========================================================
  // LAMES LONGUES
  // =========================================================
  {
    id: 'arakh',
    nom: 'Arakh',
    categorie: 'Lames longues',
    competence_test: 'corps',
    specialite_test: 'Lames longues',
    formation: 1,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'polyvalente' },
      { id: 'rapide' },
    ]
  },
  {
    id: 'epee_batarde',
    nom: 'Épée bâtarde',
    categorie: 'Lames longues',
    competence_test: 'corps',
    specialite_test: 'Lames longues',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +1,
    qualites: [
      { id: 'polyvalente' },
    ]
  },
  {
    id: 'epee_longue',
    nom: 'Épée longue',
    categorie: 'Lames longues',
    competence_test: 'corps',
    specialite_test: 'Lames longues',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +1,
    qualites: []
  },
  {
    id: 'espadon',
    nom: 'Espadon',
    categorie: 'Lames longues',
    competence_test: 'corps',
    specialite_test: 'Lames longues',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +3,
    qualites: [
      { id: 'puissante' },
      { id: 'lente' },
      { id: 'deux_mains' },
      { id: 'incommode' },
      { id: 'hargneuse' },
    ]
  },

  // =========================================================
  // LANCES
  // =========================================================
  {
    id: 'epieu',
    nom: 'Épieu',
    categorie: 'Lances',
    competence_test: 'corps',
    specialite_test: 'Lances',
    formation: 1,
    attribut_degats: 'athletisme',
    mod_degats: +1,
    qualites: [
      { id: 'empalement' },
      { id: 'puissante' },
      { id: 'deux_mains' },
    ]
  },
  {
    id: 'foene',
    nom: 'Foëne',
    categorie: 'Lances',
    competence_test: 'corps',
    specialite_test: 'Lances',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: +1,
    qualites: [
      { id: 'polyvalente' },
    ]
  },
  {
    id: 'lance',
    nom: 'Lance',
    categorie: 'Lances',
    competence_test: 'corps',
    specialite_test: 'Lances',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'rapide' },
    ]
  },
  {
    id: 'lance_de_joute',
    nom: 'Lance de joute',
    categorie: 'Lances',
    competence_test: 'dressage',
    specialite_test: 'Dressage combat',
    formation: 1,
    attribut_degats: 'dressage',
    mod_degats: +3,
    qualites: [
      { id: 'encombrante', valeur: 1 },
      { id: 'montee' },
      { id: 'puissante' },
      { id: 'allonge' },
      { id: 'lente' },
      { id: 'fragile' },
    ]
  },
  {
    id: 'pique',
    nom: 'Pique',
    categorie: 'Lances',
    competence_test: 'corps',
    specialite_test: 'Lances',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: +2,
    qualites: [
      { id: 'empalement' },
      { id: 'reception_charge' },
      { id: 'lente' },
      { id: 'deux_mains' },
      { id: 'incommode' },
    ]
  },
  {
    id: 'lance_de_guerre',
    nom: 'Lance de guerre',
    categorie: 'Lances',
    competence_test: 'dressage',
    specialite_test: 'Dressage combat',
    formation: 1,
    attribut_degats: 'dressage',
    mod_degats: +4,
    qualites: [
      { id: 'encombrante', valeur: 2 },
      { id: 'empalement' },
      { id: 'montee' },
      { id: 'puissante' },
      { id: 'lente' },
      { id: 'hargneuse' },
    ]
  },
  {
    id: 'trident',
    nom: 'Trident',
    categorie: 'Lances',
    competence_test: 'corps',
    specialite_test: 'Lances',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'polyvalente' },
      { id: 'lente' },
    ]
  },

  // =========================================================
  // RIXE (combat à mains nues / armes improvisées)
  // =========================================================
  {
    id: 'couteau_rixe',
    nom: 'Couteau (rixe)',
    categorie: 'Rixe',
    competence_test: 'corps',
    specialite_test: 'Rixe',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -2,
    qualites: [
      { id: 'rapide' },
      { id: 'secondaire', valeur: 1 },
    ]
  },
  {
    id: 'fouet',
    nom: 'Fouet',
    categorie: 'Rixe',
    competence_test: 'corps',
    specialite_test: 'Rixe',
    formation: 2,
    attribut_degats: 'agilite',
    mod_degats: -1,
    qualites: []
  },
  {
    id: 'improvise',
    nom: 'Arme improvisée',
    categorie: 'Rixe',
    competence_test: 'corps',
    specialite_test: 'Rixe',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -1,
    qualites: [
      { id: 'lente' },
    ]
  },
  {
    id: 'gantelet',
    nom: 'Gantelet',
    categorie: 'Rixe',
    competence_test: 'corps',
    specialite_test: 'Rixe',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -2,
    qualites: [
      { id: 'empoigne' },
      { id: 'secondaire', valeur: 1 },
    ]
  },
  {
    id: 'poing',
    nom: 'Poing (mains nues)',
    categorie: 'Rixe',
    competence_test: 'corps',
    specialite_test: 'Rixe',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -3,
    qualites: [
      { id: 'empoigne' },
      { id: 'secondaire', valeur: 1 },
    ]
  },

  // =========================================================
  // JET (armes lancées)
  // Toutes ces armes utilisent : competence_test='tir', specialite_test='Jet'.
  // À noter : "Jet" doit être ajouté à SKILLS.tir.specs côté app.
  // =========================================================
  {
    id: 'couteau_jet',
    nom: 'Couteau (jet)',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: null,
    attribut_degats: 'agilite',
    mod_degats: -1,
    qualites: [
      { id: 'portee_courte' },
      { id: 'rapide' },
    ]
  },
  {
    id: 'filet',
    nom: 'Filet',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: 1,
    // Le filet n'inflige pas de dégâts : son but est d'empêtrer la cible.
    // attribut_degats laissé à 'athletisme' par défaut, mais mod_degats
    // ramène le total à 0 ou négatif — l'app n'utilisera pas les dégâts.
    attribut_degats: 'athletisme',
    mod_degats: -99,
    qualites: [
      { id: 'portee_courte' },
      { id: 'empetrement' },
    ]
  },
  {
    id: 'foene_jet',
    nom: 'Foëne (jet)',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: 1,
    attribut_degats: 'agilite',
    mod_degats: +1,
    qualites: [
      { id: 'portee_courte' },
    ]
  },
  {
    id: 'fronde',
    nom: 'Fronde',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: -1,
    qualites: [
      { id: 'portee_longue' },
    ]
  },
  {
    id: 'hachette_jet',
    nom: 'Hachette (jet)',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'portee_courte' },
    ]
  },
  {
    id: 'javeline',
    nom: 'Javeline',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'portee_courte' },
    ]
  },
  {
    id: 'lance_jet',
    nom: 'Lance (jet)',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'portee_courte' },
    ]
  },
  {
    id: 'trident_jet',
    nom: 'Trident (jet)',
    categorie: 'Jet',
    competence_test: 'tir',
    specialite_test: 'Jet',
    formation: null,
    attribut_degats: 'athletisme',
    mod_degats: 0,
    qualites: [
      { id: 'portee_courte' },
    ]
  },

];

// Vérification au chargement : toutes les qualités référencées existent-elles
// bien dans QUALITES ? Les compétences/attributs sont-ils valides ?
// (S'exécute uniquement si la console DevTools est ouverte.)
(function verifierIntegriteArmes() {
  if (typeof QUALITES === 'undefined') {
    console.error("[armes.js] QUALITES n'est pas défini. " +
      "data/qualites.js doit être chargé AVANT data/armes.js.");
    return;
  }
  const competencesValides = ['corps', 'tir', 'dressage'];
  const attributsValides = ['agilite', 'athletisme', 'dressage'];
  const idsVus = new Set();

  ARMES.forEach(a => {
    if (idsVus.has(a.id)) {
      console.warn(`[armes.js] id en doublon : "${a.id}".`);
    }
    idsVus.add(a.id);

    if (!competencesValides.includes(a.competence_test)) {
      console.warn(`[armes.js] "${a.nom}" : competence_test="${a.competence_test}" inconnue.`);
    }
    if (!attributsValides.includes(a.attribut_degats)) {
      console.warn(`[armes.js] "${a.nom}" : attribut_degats="${a.attribut_degats}" inconnu.`);
    }
    a.qualites.forEach(q => {
      if (!QUALITES[q.id]) {
        console.warn(`[armes.js] "${a.nom}" : qualité "${q.id}" inexistante dans QUALITES.`);
      } else {
        // Cohérence valeur / parametree
        const def = QUALITES[q.id];
        if (def.parametree && q.valeur === undefined) {
          console.warn(`[armes.js] "${a.nom}" : qualité "${q.id}" est paramétrée mais aucune valeur fournie.`);
        }
        if (!def.parametree && q.valeur !== undefined) {
          console.warn(`[armes.js] "${a.nom}" : qualité "${q.id}" n'est pas paramétrée mais une valeur a été fournie (${q.valeur}).`);
        }
      }
    });
  });

  console.log(`[armes.js] ${ARMES.length} armes chargées, ${idsVus.size} ids uniques.`);
})();
