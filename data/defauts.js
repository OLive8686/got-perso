// --- Défauts (Table 5-2) et Faiblesses ---
//
// Source : Chapitre 5 du livre Green Ronin VF, pages 88-91.
//
// FORMAT D'UN DÉFAUT :
//   - id          : identifiant interne snake_case
//   - nom         : libellé affiché
//   - conditions  : tableau de prérequis (souvent vide)
//                   types possibles :
//                     { type: 'sexe',    valeur: 'masculin'|'feminin' }
//                     { type: 'age',     ages: ['tres_vieux', 'venerable'] }
//                     { type: 'narrateur', note: <string> }
//   - description : résumé fonctionnel court en français
//   - rapporte_pd : combien de PD le défaut rapporte (généralement 1,
//                   sauf cas spéciaux gérés par le narrateur)
//
// MÉCANIQUE GLOBALE (page 88) :
//   - Chaque défaut volontaire rapporte 1 Point de Destinée.
//   - On ne peut pas avoir plus de défauts que d'avantages.
//   - Les défauts subis en cours de partie (combats, intrigues) ne
//     rapportent PAS de PD.
//   - On peut brûler 1 PD pour retirer définitivement un défaut.
//   - Certains âges imposent des défauts/faiblesses obligatoires
//     (cf. data/ages.js, FAIBLESSES_PAR_AGE).

const DEFAUTS = [

  { id: 'arrogant', nom: 'Arrogant',
    conditions: [],
    description: "Malus de dés à tous les tests de Vigilance égal à votre rang de Statut (vous ne voyez pas les dangers qui vous entourent).",
    rapporte_pd: 1 },

  { id: 'banni', nom: 'Banni',
    conditions: [],
    description: "Statut réduit de 2 de manière permanente.",
    rapporte_pd: 1 },

  { id: 'batard', nom: 'Bâtard',
    conditions: [],
    description: "Pas de nom de famille (vous portez le surnom régional). -1D aux tests de Persuasion contre les personnages de Statut supérieur au vôtre.",
    rapporte_pd: 1 },

  { id: 'demence_cruelle', nom: 'Démence cruelle',
    conditions: [],
    description: "-2D aux tests de Vigilance liés à l'Empathie ; en intrigue, l'humeur de votre adversaire empire d'un cran s'il vous reconnaît.",
    rapporte_pd: 1 },

  { id: 'dette', nom: 'Dette',
    conditions: [],
    description: "Tous vos achats coûtent le double du prix indiqué (ressources limitées par les remboursements).",
    rapporte_pd: 1 },

  { id: 'distrait', nom: 'Distrait',
    conditions: [],
    description: "Sur les tests d'Ingéniosité : relancez les 6 et conservez le second résultat.",
    rapporte_pd: 1 },

  { id: 'ennemi_jure', nom: 'Ennemi juré',
    conditions: [],
    description: "Vous avez un ennemi redoutable qui finira par venir vous chercher (le narrateur définit qui).",
    rapporte_pd: 1 },

  { id: 'esclave_bouteille', nom: 'Esclave de la bouteille',
    conditions: [],
    description: "Addiction à l'alcool : sous stress, test de Volonté Formidable (12) pour ne pas boire. Ivre = -2D à tous les tests jusqu'à dégrisement (test d'Endurance Difficile par heure).",
    rapporte_pd: 1 },

  { id: 'estropie', nom: 'Estropié',
    conditions: [],
    description: "Déplacement réduit de 2 mètres (minimum 1 m).",
    rapporte_pd: 1 },

  { id: 'eunuque', nom: 'Eunuque',
    conditions: [{ type: 'sexe', valeur: 'masculin' }],
    description: "-1D aux tests de Persuasion ; les ennemis ne peuvent pas utiliser Séduire pour vous influencer ; pas d'enfant, pas d'héritier.",
    rapporte_pd: 1 },

  { id: 'faiblesse', nom: 'Faiblesse',
    conditions: [],
    description: "Choisissez une compétence : -1D à tous ses tests. Voir FAIBLESSES_NOM pour le surnom de chaque compétence affligée. Cumulable jusqu'à (rang compétence - 1) fois par compétence.",
    rapporte_pd: 1 },

  { id: 'habitude_genante', nom: 'Habitude gênante',
    conditions: [],
    description: "+1D aux tests de Persuasion (Intimider) quand vous êtes reconnu, mais -1D à tous les autres usages de Persuasion.",
    rapporte_pd: 1 },

  { id: 'handicap_sensoriel', nom: 'Handicap sensoriel',
    conditions: [],
    description: "Cécité ou surdité (au choix) : tests de Vigilance liés au sens manquant ratés automatiquement ; Déplacement -1 m.",
    rapporte_pd: 1 },

  { id: 'hautain', nom: 'Hautain',
    conditions: [],
    description: "-1D aux tests de Vigilance (Empathie). Quand vous parlez à quelqu'un de rang inférieur ou en comportement indécent, votre humeur de départ doit être Antipathique ou pire.",
    rapporte_pd: 1 },

  { id: 'honni', nom: 'Honni',
    conditions: [],
    description: "En intrigue, l'humeur de votre adversaire empire d'un cran. -1D à tous les tests de Statut.",
    rapporte_pd: 1 },

  { id: 'honorable', nom: 'Honorable',
    conditions: [],
    description: "Sur les tests de Duperie : relancez les 6 et conservez le second résultat.",
    rapporte_pd: 1 },

  { id: 'irascible', nom: 'Irascible',
    conditions: [],
    description: "Premier jet de Persuasion en intrigue obligatoirement Intimider ; -2D aux tests de Persuasion (Charmer ou Séduire).",
    rapporte_pd: 1 },

  { id: 'lache', nom: 'Lâche',
    conditions: [],
    description: "En combat ou intrigue : -1D à tous les tests. Action franche par round : test de Volonté Formidable (12) pour annuler le malus du round et gagner +1B.",
    rapporte_pd: 1 },

  { id: 'lourdaud', nom: 'Lourdaud',
    conditions: [],
    description: "Sur les tests d'Agilité : relancez les 6 et conservez le second résultat.",
    rapporte_pd: 1 },

  { id: 'lubrique', nom: 'Lubrique',
    conditions: [],
    description: "Premier test de Persuasion en intrigue obligatoirement Séduire ; -2D aux tentatives de Charmer.",
    rapporte_pd: 1 },

  { id: 'maladie_infantile', nom: 'Maladie infantile',
    conditions: [],
    description: "Santé réduite de 2 de manière permanente.",
    rapporte_pd: 1 },

  { id: 'maladie', nom: 'Maladie',
    conditions: [],
    description: "-2D aux tests d'Endurance pour résister aux périls naturels et aux maladies.",
    rapporte_pd: 1 },

  { id: 'marque', nom: 'Marqué',
    conditions: [],
    description: "Balafre hideuse ou difformité visible : sur les tests de Persuasion, relancez les 6 et conservez le second résultat.",
    rapporte_pd: 1 },

  { id: 'maudit', nom: 'Maudit',
    conditions: [],
    description: "Quand vous dépensez un PD, lancez 1d6 ; sur un 1, le PD est perdu sans effet.",
    rapporte_pd: 1 },

  { id: 'mauvaise_sante', nom: 'Mauvaise santé',
    conditions: [],
    description: "Tests d'Endurance pour faire disparaître lésions et blessures : résultat affligé d'un -3.",
    rapporte_pd: 1 },

  { id: 'menacant', nom: 'Menaçant',
    conditions: [],
    description: "En intrigue, vous devez utiliser Intimider en premier. Vos adversaires subissent ce malus quand ils tentent de déterminer votre humeur.",
    rapporte_pd: 1 },

  { id: 'muet', nom: 'Muet',
    conditions: [],
    description: "Incapable de parler : -2D à tous les tests effectués durant les intrigues. Vos adversaires subissent le même malus pour déterminer votre humeur.",
    rapporte_pd: 1 },

  { id: 'mutile', nom: 'Mutilé',
    conditions: [],
    description: "Identique à Marqué, plus perte d'un membre. Si jambe : Déplacement -50% et -1D aux tests d'Athlétisme. Si bras : pas d'armes à 2 mains, -2D à tous les tests nécessitant les deux mains.",
    rapporte_pd: 1 },

  { id: 'naif', nom: 'Naïf',
    conditions: [],
    description: "Vos adversaires en intrigue peuvent ajouter leur rang d'Ingéniosité au résultat des tests de Duperie destinés à vous influencer.",
    rapporte_pd: 1 },

  { id: 'nain', nom: 'Nain',
    conditions: [],
    description: "Déplacement de base -1 m ; -1D aux tests de Persuasion (Charmer ou Séduire).",
    rapporte_pd: 1 },

  { id: 'perclus', nom: 'Perclus',
    conditions: [{ type: 'age', ages: ['tres_vieux', 'venerable'] }],
    description: "Aucun test d'Agilité, d'Athlétisme, de Corps à corps ou de Tir possible ; +1D aux tests de Vigilance et de Connaissance. Remplace jusqu'à 3 faiblesses pour les vénérables.",
    rapporte_pd: 1 },

  { id: 'phobie', nom: 'Phobie',
    conditions: [{ type: 'narrateur', note: "L'objet de la phobie est validé par le narrateur." }],
    description: "En présence de l'objet de la phobie : -1D à tous les tests. Chaque round : 1d6 ; sur 6, vous surmontez la peur pour la durée de la rencontre.",
    rapporte_pd: 1 },

  { id: 'tourmente', nom: 'Tourmenté',
    conditions: [],
    description: "-1D aux tests de Vigilance ; au premier round de combat, ajoutez vos dés bonus de Mémoire au résultat des tests de Corps à corps.",
    rapporte_pd: 1 },

  { id: 'vil', nom: 'Vil',
    conditions: [],
    description: "-1D aux tests de Persuasion et de Statut.",
    rapporte_pd: 1 },

];

// =================================================================
// FAIBLESSES — surnoms par compétence
// =================================================================
// Le défaut "Faiblesse" inflige -1D à une compétence ; chaque compétence
// possède un surnom officiel pour ce trait de caractère (page 89).
// Cumulable jusqu'à (rang compétence - 1) fois par compétence.

const FAIBLESSES_NOM = {
  agilite:      'Maladroit',
  art_mil:      'Pleutre',
  athletisme:   'Pantouflard',
  connaissance: 'Inculte',
  corps:        'Incompétent',
  discretion:   'Voyant',
  dressage:     'Cruel',
  duperie:      'Transparent',
  endurance:    'Fragile',
  ingeniosite:  'Empoté',
  langue:       'Bègue',
  larcin:       'Balourd',
  persuasion:   'Timide',
  soins:        'Insensible',
  statut:       'Misérable',
  survie:       'Frivole',
  tir:          'Tremblant',
  vigilance:    'Obtus',
  volonte:      'Bravache',
};

// =================================================================
// SURNOMS DE BÂTARDS — par région d'origine (page 88)
// =================================================================
// Pour le défaut "Bâtard", le personnage prend le surnom correspondant
// à sa région de naissance plutôt que le nom de famille.

const SURNOMS_BATARDS = {
  dorne:                'Sand',
  peyredragon:          'Waters',
  iles_de_fer:          'Pyke',
  nord:                 'Snow',
  bief:                 'Flowers',
  conflans:             'Rivers',
  terres_de_l_orage:    'Storm',
  val:                  'Stone',
  terres_de_l_ouest:    'Hills',
};

// Vérification au chargement.
(function verifierIntegriteDefauts() {
  const idsVus = new Set();

  DEFAUTS.forEach(d => {
    if (idsVus.has(d.id)) console.warn(`[defauts.js] id en doublon : "${d.id}".`);
    idsVus.add(d.id);
    if (!Array.isArray(d.conditions)) {
      console.warn(`[defauts.js] "${d.nom}" : conditions doit être un tableau.`);
    }
    if (typeof d.rapporte_pd !== 'number') {
      console.warn(`[defauts.js] "${d.nom}" : rapporte_pd manquant ou invalide.`);
    }
  });

  // Crosscheck FAIBLESSES_NOM contre SKILLS (si chargé)
  if (typeof SKILLS !== 'undefined') {
    const skillKeys = new Set(SKILLS.map(s => s.key));
    Object.keys(FAIBLESSES_NOM).forEach(k => {
      if (!skillKeys.has(k)) {
        console.warn(`[defauts.js] FAIBLESSES_NOM["${k}"] n'a pas de compétence correspondante dans SKILLS.`);
      }
    });
    skillKeys.forEach(k => {
      if (!(k in FAIBLESSES_NOM)) {
        console.warn(`[defauts.js] La compétence "${k}" n'a pas de surnom de Faiblesse.`);
      }
    });
  }

  console.log(`[defauts.js] ${DEFAUTS.length} défauts chargés, ${Object.keys(FAIBLESSES_NOM).length} surnoms de faiblesse, ${Object.keys(SURNOMS_BATARDS).length} régions pour bâtards.`);
})();
