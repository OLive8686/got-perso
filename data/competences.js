// --- Compétences et spécialités (Chapitre 4) ---
//
// Source : Chapitre 4 du livre Green Ronin VF.
// Migration depuis la constante SKILLS du HTML d'origine, à recouper
// contre le livre quand le chapitre 4 sera disponible.
//
// CHAQUE COMPÉTENCE A :
//   - key   : identifiant interne snake_case (référence dans state.skills)
//   - name  : libellé affiché en français
//   - specs : liste des spécialités possibles (libellés affichés)
//
// MÉCANIQUE :
//   - Toutes les compétences débutent à rang 2 (rang de base).
//   - Le coût en XP pour monter d'un rang à l'autre est dans data/ages.js
//     (constante XP_COST), avec un rang max conditionné par l'âge.
//   - Une spécialité s'achète avec 1 Point de Destinée et octroie 1B
//     (un dé bonus) aux tests de cette spécialité.
//
// IMPORTANT : noms de champs (key, name, specs) conservés en anglais
// pour rester compatibles avec le code JS du HTML d'origine.
//
// MODIFICATION VS. SOURCE HTML :
//   - 'Jet' ajouté aux spécialités de Tir (référencé par 8 armes
//     dans data/armes.js, manquait dans la source HTML).
//
// À VÉRIFIER au chapitre 4 :
//   - Existence ou non d'une spécialité "Fronde" séparée de "Jet" en Tir.
//   - Orthographe "Armes à hast" vs "Armes d'hast" (utilisée pour la
//     catégorie de l'arme dans armes.js).

const SKILLS = [
  { key: 'agilite',      name: 'Agilité',       specs: ['Acrobaties', 'Esquive', 'Course', 'Vivacité'],
    description: "Dextérité, souplesse et réflexes. S'applique à la Défense de Combat et détermine les dégâts d'une partie des armes de Tir et de quelques armes de Corps à corps." },
  { key: 'art_mil',      name: 'Art militaire', specs: ['Commandement', 'Intendance', 'Stratégie', 'Tactique'],
    description: "Connaissance du champ de bataille : tactique, stratégie, commandement d'unités et logistique." },
  { key: 'athletisme',   name: 'Athlétisme',    specs: ['Course', 'Endurance (athl.)', 'Force', 'Natation', 'Saut'],
    description: "Forme physique, force, déplacement, escalade et natation. Détermine les dégâts de la plupart des armes de Corps à corps. S'ajoute à la Défense de Combat." },
  { key: 'connaissance', name: 'Connaissance',  specs: ['Éducation', 'Connaissance de la Rue', 'Recherches', 'Savoir'],
    description: "Compréhension du monde : histoire, agriculture, économie, politique. Spécialités précises via l'avantage Connaissances précises." },
  { key: 'corps',        name: 'Corps à corps', specs: ['Armes à hast', 'Boucliers', 'Casse-tête', 'Escrime', 'Haches', 'Lames courtes', 'Lames longues', 'Lances', 'Rixe'],
    description: "Maniement des armes au contact. Test rolled pour toucher avec une arme de mêlée." },
  { key: 'discretion',   name: 'Discrétion',    specs: ['Camouflage', 'Déplacement silencieux', 'Filature', 'Furtivité'],
    description: "Évoluer sans être vu ni entendu : se déplacer, se cacher, suivre quelqu'un sans se faire repérer." },
  { key: 'dressage',     name: 'Dressage',      specs: ['Animaux exotiques', 'Équitation', 'Fauconnerie', 'Dressage combat'],
    description: "Techniques pour soigner, dresser et faire travailler les animaux. Inclut l'équitation et le combat monté." },
  { key: 'duperie',      name: 'Duperie',       specs: ['Bluff', 'Déguisement', 'Jeux', 'Séduction', 'Vol à la tire'],
    description: "Mensonge, hypocrisie, déguisement. Cruciale dans les intrigues pour dissimuler ses intentions." },
  { key: 'endurance',    name: 'Endurance',     specs: ['Résistance à la douleur', 'Résistance aux maladies', 'Résilience', 'Robustesse'],
    description: "Bien-être physique, santé, robustesse. Détermine la Santé (×3), le maximum de Lésions et de Blessures, et la résistance aux poisons et maladies." },
  { key: 'ingeniosite',  name: 'Ingéniosité',   specs: ['Artisanat', 'Cryptographie', 'Mécanique', 'Pièges'],
    description: "Intelligence, raisonnement, mémoire. Entre dans la Défense d'Intrigue et permet d'identifier énigmes et instructions." },
  { key: 'langue',       name: 'Langue',        specs: ['Andal', 'Asshai', 'Braavosi', 'Dothraki', 'Lhazareen', 'Rhoynar', 'Valyrois', 'Vi Dothrak'],
    description: "Communication parlée et écrite. Le rang de départ s'applique à la langue commune ; rangs supplémentaires pour autres langues ou alphabétisation." },
  { key: 'larcin',       name: 'Larcin',        specs: ['Crochetage', 'Escalade', 'Filouterie', 'Pickpocket', 'Vol'],
    description: "Activités délictueuses : crochetage de serrures, vol à la tire, tours d'illusionniste." },
  { key: 'persuasion',   name: 'Persuasion',    specs: ['Baratin', 'Charme', 'Commandement', 'Marchandage', 'Séduction'],
    description: "Manipulation des sentiments et croyances d'autrui. Compétence centrale des intrigues sociales." },
  { key: 'soins',        name: 'Soins',         specs: ['Chirurgie', 'Empoisonnement', 'Guérison', 'Herbes', 'Sage-femme'],
    description: "Connaissances médicales et assistance aux blessés. Accélère la récupération de lésions et blessures." },
  { key: 'statut',       name: 'Statut',        specs: ['Étiquette', 'Héraldique', 'Intendance', 'Tournois'],
    description: "Place sociale dans la maison noble. Entre dans la Défense d'Intrigue. À acheter en premier lors de la création (page 43)." },
  { key: 'survie',       name: 'Survie',        specs: ['Chasse', 'Orientation', 'Pistage', 'Postage'],
    description: "Se débrouiller en pleine nature : chasser, s'orienter, suivre des traces, éviter de se perdre." },
  { key: 'tir',          name: 'Tir',           specs: ['Arbalètes', 'Arcs', 'Armes de siège', 'Fronde', 'Jet'],
    description: "Précision aux armes à distance : arcs, arbalètes, armes de siège, frondes, armes de jet." },
  { key: 'vigilance',    name: 'Vigilance',     specs: ['Détection des mensonges', 'Empathie', 'Observation', 'Perception'],
    description: "Sens, perception, empathie. S'ajoute aux deux Défenses (Combat et Intrigue). Détecte mensonges et environnement." },
  { key: 'volonte',      name: 'Volonté',       specs: ['Coordination', 'Courage', 'Dévotion', 'Intégrité'],
    description: "Santé mentale et résistance. Détermine le Sang-Froid (×3), permet de résister à la peur, à la magie et à la manipulation." },
];

// Vérification au chargement + crosscheck contre armes.js et boucliers.js
// (si chargés). Détecte les spécialités référencées par une arme/bouclier
// mais absentes de SKILLS.
(function verifierIntegriteCompetences() {
  // Sanity sur les champs requis
  SKILLS.forEach(s => {
    if (!s.key || !s.name || !Array.isArray(s.specs)) {
      console.warn(`[competences.js] Compétence mal formée : ${JSON.stringify(s)}`);
    }
  });

  // Construire l'ensemble {compétence → set de spécialités} pour lookup rapide
  const specsParCompetence = {};
  SKILLS.forEach(s => {
    specsParCompetence[s.key] = new Set(s.specs);
  });

  // Crosscheck armes
  if (typeof ARMES !== 'undefined') {
    ARMES.forEach(a => {
      const setSpecs = specsParCompetence[a.competence_test];
      if (!setSpecs) {
        console.warn(`[competences.js] Arme "${a.nom}" : competence_test "${a.competence_test}" inconnue.`);
      } else if (!setSpecs.has(a.specialite_test)) {
        console.warn(`[competences.js] Arme "${a.nom}" : spécialité "${a.specialite_test}" absente de ${a.competence_test}.specs.`);
      }
    });
  }

  // Crosscheck boucliers (la spécialité associée est "Boucliers" dans Corps à corps)
  if (typeof BOUCLIERS !== 'undefined') {
    const setCorps = specsParCompetence['corps'];
    if (setCorps && !setCorps.has('Boucliers')) {
      console.warn(`[competences.js] La spécialité "Boucliers" est absente de Corps à corps.`);
    }
  }

  console.log(`[competences.js] ${SKILLS.length} compétences chargées.`);
})();
