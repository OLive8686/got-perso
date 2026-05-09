// --- Avantages (Table 5-1) ---
//
// Source : Chapitre 5 du livre Green Ronin VF, pages 71-87.
//
// FORMAT D'UN AVANTAGE :
//   - id          : identifiant interne snake_case
//   - nom         : libellé affiché
//   - categorie   : 'competence' | 'destin' | 'heritage' | 'martial' | 'social'
//   - conditions  : tableau de prérequis (vide = aucun)
//                   types possibles :
//                     { type: 'competence',     cle: <key>, rang_min: <n> }
//                     { type: 'competence_ou',  alternatives: [{cle,rang_min},...] }
//                     { type: 'specialite',     competence: <key>,
//                                               nom: <string>, rang_min: <n> }
//                     { type: 'avantage',       id: <id>, nb_min?: <n> }
//                     { type: 'avantage_ou',    ids: [<id>, ...] }
//                     { type: 'defaut',         id: <id> }
//                     { type: 'sexe',           valeur: 'masculin'|'feminin' }
//                     { type: 'narrateur',      note: <string> } (autorisation MJ)
//   - description : résumé fonctionnel court en français
//   - cumulable   : true si l'avantage peut être pris plusieurs fois
//                   (omis sinon)
//
// IMPORTANT : les descriptions sont des résumés rédigés à partir des
// règles du livre. Pour les détails d'application en partie, se reporter
// aux pages 74-87 du livre.

const AVANTAGES = [

  // =================================================================
  // ATTRIBUTS DE COMPÉTENCE
  // =================================================================
  { id: 'adroit', nom: 'Adroit', categorie: 'competence',
    conditions: [],
    description: "Relancez les 1 sur les tests d'Agilité (un nombre de 1 égal au nombre de dés bonus de la spécialité la plus adaptée, minimum 1)." },

  { id: 'ami_des_betes', nom: 'Ami des bêtes', categorie: 'competence',
    conditions: [],
    description: "+1D aux tests de Dressage avec les spécialités Charme et Exercices." },

  { id: 'amuseur', nom: 'Amuseur', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'persuasion', rang_min: 3 }],
    description: "Vous gagnez votre vie en divertissant un public (test de Persuasion difficile)." },

  { id: 'artiste', nom: 'Artiste', categorie: 'competence',
    conditions: [],
    description: "Vous créez des œuvres d'art dans un domaine (peinture, poésie, sculpture…)." },

  { id: 'athlete_ne', nom: 'Athlète-né', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'athletisme', rang_min: 4 }],
    description: "Sur une spécialité d'Athlétisme choisie, convertissez la moitié de vos dés bonus en dés de test (arrondi à l'inférieur, min 1).",
    cumulable: true },

  { id: 'connaissances_precises', nom: 'Connaissances précises', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'connaissance', rang_min: 4 }],
    description: "Expertise dans un domaine de Connaissance choisi : convertissez vos dés bonus d'Éducation en dés de test pour ce domaine.",
    cumulable: true },

  { id: 'evaluation', nom: 'Évaluation', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'connaissance', rang_min: 3 }],
    description: "Test d'Ingéniosité Difficile (9) pour estimer la valeur d'un objet précieux." },

  { id: 'expertise', nom: 'Expertise', categorie: 'competence',
    conditions: [],
    description: "+1D aux tests d'une spécialité choisie. Cumulable sur des spécialités différentes.",
    cumulable: true },

  { id: 'faiseur_de_miracles', nom: 'Faiseur de miracles', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'soins', rang_min: 4 }],
    description: "+2B en cas de réussite aux tests de Soins (diagnostic), +1B par degré supplémentaire ; convertissez 2 dés bonus en dés test sur le test de Soins ; ajoutez Éducation au résultat." },

  { id: 'fin_gestionnaire', nom: 'Fin gestionnaire', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'statut', rang_min: 3 },
      { type: 'specialite', competence: 'statut', nom: 'Intendance', rang_min: 1 }
    ],
    description: "Ajoutez votre rang d'Ingéniosité au résultat de Statut pour les événements liés à la maison ; relancez les 1 sur les tests de Statut générant de l'argent." },

  { id: 'furtif', nom: 'Furtif', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'discretion', rang_min: 4 },
      { type: 'specialite', competence: 'discretion', nom: 'Furtivité', rang_min: 1 }
    ],
    description: "Relancez les 1 sur les tests de Furtivité ; ajoutez votre rang d'Agilité au résultat." },

  { id: 'grand_chasseur', nom: 'Grand chasseur', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'survie', rang_min: 4 }],
    description: "Bonus aux combats, chasses et traques d'animaux ; convertissez les dés bonus de Chasse en dés de test." },

  { id: 'memoire_eidetique', nom: 'Mémoire eidétique', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'ingeniosite', rang_min: 2 },
      { type: 'specialite', competence: 'ingeniosite', nom: 'Mémoire', rang_min: 1 }
    ],
    description: "Vos dés bonus de Mémoire deviennent des dés de test." },

  { id: 'metier', nom: 'Métier', categorie: 'competence',
    conditions: [],
    description: "Vous maîtrisez un métier choisi : test d'Ingéniosité Difficile (9) pour produire des objets et générer des revenus." },

  { id: 'pedagogue', nom: 'Pédagogue', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'connaissance', rang_min: 4 },
      { type: 'competence', cle: 'persuasion',   rang_min: 3 }
    ],
    description: "Conférez à un élève une réserve de dés bonus utilisables sur la compétence enseignée (1B par degré de réussite au test de Persuasion)." },

  { id: 'polyglotte', nom: 'Polyglotte', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'ingeniosite', rang_min: 4 },
      { type: 'specialite', competence: 'ingeniosite', nom: 'Décryptage', rang_min: 1 }
    ],
    description: "Vous lisez automatiquement toute langue où vous avez au moins 1 rang ; test d'Ingéniosité Formidable (12) pour saisir l'essentiel d'une langue inconnue à l'oral." },

  { id: 'reseau', nom: 'Réseau', categorie: 'competence',
    conditions: [{ type: 'specialite', competence: 'connaissance', nom: 'Connaissance de la rue', rang_min: 1 }],
    description: "+1D aux tests de Connaissance dans une région choisie. Cumulable sur des régions différentes.",
    cumulable: true },

  { id: 'robuste', nom: 'Robuste', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'endurance', rang_min: 3 },
      { type: 'specialite', competence: 'endurance', nom: 'Vigueur', rang_min: 1 }
    ],
    description: "Ignorez le malus de -1 ou -1D aux tests d'Endurance pour récupérer des lésions ou blessures." },

  { id: 'se_fondre_dans_la_foule', nom: 'Se fondre dans la foule', categorie: 'competence',
    conditions: [
      { type: 'competence', cle: 'discretion', rang_min: 3 },
      { type: 'specialite', competence: 'discretion', nom: 'Caméléon', rang_min: 1 }
    ],
    description: "Utilisez Caméléon en action franche ; ajoutez votre rang d'Ingéniosité aux tests de Caméléon." },

  { id: 'sens_aiguises', nom: 'Sens aiguisés', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'vigilance', rang_min: 4 }],
    description: "Relancez les 1 sur les tests de Vigilance (Observation) ; ajoutez votre rang d'Ingéniosité à votre Vigilance passive." },

  { id: 'sinistre', nom: 'Sinistre', categorie: 'competence',
    conditions: [],
    description: "Aura menaçante : au premier round de combat ou d'intrigue, vos adversaires subissent -1D aux tests de Corps à corps et de Persuasion vous visant." },

  { id: 'specialiste_de_terrain', nom: 'Spécialiste de terrain', categorie: 'competence',
    conditions: [{ type: 'competence', cle: 'survie', rang_min: 4 }],
    description: "Sur un type de terrain choisi : ajoutez votre rang d'Éducation aux tests de Survie ; pas de malus de déplacement.",
    cumulable: true },

  { id: 'talentueux', nom: 'Talentueux', categorie: 'competence',
    conditions: [],
    description: "+1 au résultat de tous les tests d'une compétence choisie. Cumulable sur des compétences différentes.",
    cumulable: true },

  { id: 'voyou', nom: 'Voyou', categorie: 'competence',
    conditions: [],
    description: "Relancez les 1 sur les tests de Larcin (un nombre de 1 égal au nombre de dés bonus de la spécialité la plus adaptée, minimum 1)." },

  // =================================================================
  // ATTRIBUTS DU DESTIN
  // =================================================================
  { id: 'celebre', nom: 'Célèbre', categorie: 'destin',
    conditions: [],
    description: "Lors des tests de Persuasion (Charme/Séduire), convertissez vos dés bonus de ces spécialités en dés de test (à concurrence de votre Statut). Vous subissez un malus égal à votre Statut aux tests de Discrétion pour vous déguiser." },

  { id: 'chanceux', nom: 'Chanceux', categorie: 'destin',
    conditions: [],
    description: "Une fois par jour, relancez un test et conservez le meilleur résultat." },

  { id: 'chef_de_famille', nom: 'Chef de famille', categorie: 'destin',
    conditions: [{ type: 'avantage', id: 'charismatique' }],
    description: "Vous dirigez votre maison. +2 aux tests de Statut, augmentez l'Influence d'une spécialité de Persuasion choisie en intrigue. Une seule personne du groupe peut prendre cet avantage." },

  { id: 'compagnon', nom: 'Compagnon', categorie: 'destin',
    conditions: [{ type: 'competence', cle: 'statut', rang_min: 3 }],
    description: "Allié dévoué (PNJ de Statut inférieur, créé via les règles de personnage). Si adjacent : +2 à votre Défense de Combat." },

  { id: 'compagnon_animal', nom: 'Compagnon animal', categorie: 'destin',
    conditions: [
      { type: 'competence', cle: 'dressage', rang_min: 3 },
      { type: 'specialite', competence: 'dressage', nom: 'Exercices', rang_min: 1 }
    ],
    description: "Animal entièrement dévoué (chien, aigle, cheval, corbeau, lynx, loup). +1D aux tests de Corps à corps quand l'animal est adjacent ; pas de tests de Dressage requis pour le contrôler." },

  { id: 'fief', nom: 'Fief', categorie: 'destin',
    conditions: [{ type: 'avantage', id: 'mecene' }],
    description: "Votre suzerain vous accorde des terres et un titre ; vous régnez sur un domaine, en contrepartie d'obligations militaires." },

  { id: 'frere_garde_de_nuit', nom: 'Frère de la Garde de Nuit', categorie: 'destin',
    conditions: [{ type: 'narrateur', note: 'Permission du narrateur requise.' }],
    description: "Membre juré de la Garde de Nuit : Statut tombe à 2, immunité aux revers de fortune de votre maison. Vous perdez tous les attributs du Destin liés à la maison (PD remboursés). Patrouilleur, Ingénieur ou Intendant selon affectation." },

  { id: 'heritage', nom: 'Héritage', categorie: 'destin',
    conditions: [
      { type: 'avantage_ou', ids: ['heritier', 'chef_de_famille'] }
    ],
    description: "Vous possédez une arme en acier valyrien transmise dans la famille (généralement une épée ou une dague). Voir page 124 pour les statistiques." },

  { id: 'heritier', nom: 'Héritier', categorie: 'destin',
    conditions: [{ type: 'narrateur', note: "Permission du narrateur ; un seul membre du groupe peut le prendre." }],
    description: "Vous êtes l'héritier légitime du suzerain de votre maison. Conditions de groupe : un seul membre peut le prendre." },

  { id: 'maitre_des_corbeaux', nom: 'Maître des corbeaux', categorie: 'destin',
    conditions: [{ type: 'competence', cle: 'dressage', rang_min: 3 }],
    description: "Vous envoyez des corbeaux porter vos messages : test de Dressage Facile (6) avec spécialité Charme." },

  { id: 'mecene', nom: 'Mécène', categorie: 'destin',
    conditions: [{ type: 'narrateur', note: "Le mécène et le narrateur définissent le personnage qui joue ce rôle." }],
    description: "Vous bénéficiez des faveurs d'un personnage important. Pas d'effet mécanique direct, mais ouvre l'accès à plusieurs autres avantages." },

  { id: 'membre_garde_royale', nom: 'Membre de la Garde Royale', categorie: 'destin',
    conditions: [{ type: 'avantage', id: 'mecene' }],
    description: "Statut passe à 5 ; Sang-froid +2 ; +1 aux tests de Corps à corps en défendant la famille royale ; une cellule à Port-Réal et équipement royal. Vous perdez les attributs du Destin liés à votre maison d'origine." },

  { id: 'mestre', nom: 'Mestre', categorie: 'destin',
    conditions: [
      { type: 'competence', cle: 'ingeniosite', rang_min: 3 },
      { type: 'avantage', id: 'connaissances_precises', nb_min: 2 }
    ],
    description: "Mestre de la Citadelle : insensible à la fortune de votre maison d'origine ; ajoutez votre rang d'Ingéniosité aux tests de Connaissance et de Volonté." },

  { id: 'nyctalope', nom: 'Nyctalope', categorie: 'destin',
    conditions: [],
    description: "Vous voyez dans le noir : aucun malus aux tests dans les zones où le faible éclairage handicaperait normalement." },

  { id: 'pieux', nom: 'Pieux', categorie: 'destin',
    conditions: [
      { type: 'competence', cle: 'volonte', rang_min: 3 },
      { type: 'specialite', competence: 'volonte', nom: 'Dévouement', rang_min: 1 }
    ],
    description: "Une fois par jour, gagnez +1D à un test unique en vous appuyant sur votre foi en un dieu ou principe choisi." },

  { id: 'pupille', nom: 'Pupille', categorie: 'destin',
    conditions: [{ type: 'narrateur', note: "Le narrateur définit la maison d'adoption (souvent un ennemi de votre père)." }],
    description: "Élevé par une autre maison : vous êtes immune aux revers de fortune de votre maison actuelle (la maison d'adoption)." },

  { id: 'riche', nom: 'Riche', categorie: 'destin',
    conditions: [],
    description: "Au début de chaque mois, test d'Ingéniosité ou de Statut Très facile (3) : 10 dragons d'or par degré de réussite remplissent vos coffres." },

  { id: 'troisieme_oeil', nom: 'Troisième œil', categorie: 'destin',
    conditions: [],
    description: "Rêves prophétiques : après chaque nuit complète, lancez un d6 ; sur un 6, +1D à n'importe quel test pendant la journée." },

  { id: 'troisieme_oeil_ouvert', nom: 'Troisième œil ouvert', categorie: 'destin',
    conditions: [
      { type: 'competence', cle: 'volonte', rang_min: 4 },
      { type: 'specialite', competence: 'volonte', nom: 'Dévouement', rang_min: 1 },
      { type: 'avantage', id: 'compagnon_animal' },
      { type: 'avantage', id: 'troisieme_oeil' }
    ],
    description: "Pendant le sommeil, sur un d6 résultat 5, vous pouvez prendre le contrôle de votre compagnon animal (test de Volonté Difficile)." },

  { id: 'unite', nom: 'Unité', categorie: 'destin',
    conditions: [{ type: 'avantage', id: 'mecene' }],
    description: "Une escouade de vétérans à vos côtés. Se réorganise automatiquement chaque round jusqu'à destruction complète. Pas de salaire mais ils mangent." },

  { id: 'vervue', nom: 'Vervue', categorie: 'destin',
    conditions: [
      { type: 'competence', cle: 'ingeniosite', rang_min: 5 },
      { type: 'competence', cle: 'volonte',     rang_min: 4 },
      { type: 'avantage',   id: 'troisieme_oeil' }
    ],
    description: "Vous avez la vervue (don des vervoyants) : visions prophétiques quand des événements importants approchent." },

  { id: 'zoman', nom: 'Zoman', categorie: 'destin',
    conditions: [
      { type: 'competence', cle: 'volonte', rang_min: 5 },
      { type: 'specialite', competence: 'volonte', nom: 'Dévouement', rang_min: 2 },
      { type: 'avantage', id: 'compagnon_animal' },
      { type: 'avantage', id: 'troisieme_oeil' },
      { type: 'avantage', id: 'troisieme_oeil_ouvert' }
    ],
    description: "Pendant le sommeil, vous projetez votre conscience dans votre compagnon animal et y restez aussi longtemps que voulu (>1 semaine = mort de votre corps)." },

  // =================================================================
  // ATTRIBUTS HÉRITÉS (un seul de cette catégorie peut être pris)
  // =================================================================
  { id: 'immense', nom: 'Immense', categorie: 'heritage',
    conditions: [{ type: 'competence', cle: 'endurance', rang_min: 5 }],
    description: "Taille hors du commun : maniez les armes à deux mains d'une seule main ; ignorez la qualité Incommode des armes." },

  { id: 'sang_de_valyria', nom: 'Sang de Valyria', categorie: 'heritage',
    conditions: [],
    description: "Cheveux argentés, yeux violets ; +2 au résultat d'Endurance passive contre le feu et la chaleur ; Statut considéré supérieur d'1 rang en intrigue ; +2 aux tests de Persuasion (Intimider)." },

  { id: 'sang_des_andals', nom: 'Sang des Andals', categorie: 'heritage',
    conditions: [],
    description: "Choisissez une compétence où vous avez rang ≥ 3 : relancez 1 dé. Une fois par jour, +2 à un test au choix." },

  { id: 'sang_des_fer_nes', nom: 'Sang des Fer-nés', categorie: 'heritage',
    conditions: [],
    description: "Une fois par combat, +1D à un test unique de Corps à corps. Sur un bateau ou dans l'eau : relancez les 1 d'Athlétisme dans la spécialité adaptée." },

  { id: 'sang_des_heros', nom: 'Sang des Héros', categorie: 'heritage',
    conditions: [],
    description: "Choisissez une compétence : vous pouvez la faire monter au-delà de rang 7 avec de l'expérience." },

  { id: 'sang_des_premiers_hommes', nom: 'Sang des Premiers Hommes', categorie: 'heritage',
    conditions: [],
    description: "Santé +2 ; +2 au résultat de tous les tests d'Endurance." },

  { id: 'sang_des_rhoynars', nom: 'Sang des Rhoynars', categorie: 'heritage',
    conditions: [],
    description: "+2 à la Défense de Combat ; relancez un nombre de 1 égal à votre rang d'Ingéniosité aux tests de Tactique." },

  { id: 'sang_des_sauvageons', nom: 'Sang des sauvageons', categorie: 'heritage',
    conditions: [],
    description: "Statut élevé ne vous force pas à plier en intrigue. Sous froid extrême, ajoutez votre rang d'Athlétisme à votre Endurance passive." },

  // =================================================================
  // ATTRIBUTS MARTIAUX
  // =================================================================
  { id: 'coriace', nom: 'Coriace', categorie: 'martial',
    conditions: [{ type: 'specialite', competence: 'endurance', nom: 'Résilience', rang_min: 1 }],
    description: "Ajoutez votre Résilience à votre Santé." },

  { id: 'danseur_eau_1', nom: "Danseur d'eau I", categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 3 },
      { type: 'specialite', competence: 'corps', nom: 'Escrime', rang_min: 1 }
    ],
    description: "Ajoutez votre rang de Corps à corps au résultat des tests de Vigilance ; rang à votre Vigilance passive." },

  { id: 'danseur_eau_2', nom: "Danseur d'eau II", categorie: 'martial',
    conditions: [{ type: 'avantage', id: 'danseur_eau_1' }],
    description: "Ajoutez votre rang de Corps à corps au résultat des tests d'Agilité." },

  { id: 'danseur_eau_3', nom: "Danseur d'eau III", categorie: 'martial',
    conditions: [{ type: 'avantage', id: 'danseur_eau_2' }],
    description: "Quand vous vous battez avec une arme d'Escrime, ajoutez votre rang d'Escrime à votre Défense de Combat. Annulé si vous portez une armure d'Encombrement ≥ 1." },

  { id: 'defense_acrobatique', nom: 'Défense acrobatique', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'agilite', rang_min: 4 },
      { type: 'specialite', competence: 'agilite', nom: 'Acrobaties', rang_min: 1 }
    ],
    description: "Action mineure : ajoutez le double de votre rang d'Acrobaties à votre Défense de Combat jusqu'à votre prochain tour." },

  { id: 'exaltant', nom: 'Exaltant', categorie: 'martial',
    conditions: [{ type: 'competence', cle: 'art_mil', rang_min: 4 }],
    description: "Lors des batailles rangées, +1 ordre par round ; sacrifiez un ordre pour relancer un test d'Art militaire et garder le meilleur résultat." },

  { id: 'fou_de_guerre', nom: 'Fou de guerre', categorie: 'martial',
    conditions: [],
    description: "Attaque gratuite à chaque lésion ou blessure subie. Test de Volonté Formidable (12) pour continuer à combattre une fois vaincu (Endurance fois max)." },

  { id: 'fureur', nom: 'Fureur', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'athletisme', rang_min: 4 },
      { type: 'specialite', competence: 'athletisme', nom: 'Force', rang_min: 2 }
    ],
    description: "Action majeure : -2D à un test pour +4 dégâts (avant degrés de réussite)." },

  { id: 'grele_acier', nom: "Grêle d'acier", categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'tir', rang_min: 4 },
      { type: 'specialite', competence: 'tir', nom: 'Jet', rang_min: 2 }
    ],
    description: "Vos armes de jet acquièrent la qualité Rapide." },

  { id: 'lutteur_1', nom: 'Lutteur I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Rixe', rang_min: 1 }
    ],
    description: "Vos poings acquièrent la qualité Rapide ; +Athlétisme au résultat des tests de Corps à corps à mains nues." },

  { id: 'lutteur_2', nom: 'Lutteur II', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Rixe', rang_min: 3 },
      { type: 'avantage', id: 'lutteur_1' }
    ],
    description: "Vos poings deviennent des armes Puissantes ; ajoutez votre rang d'Athlétisme aux dégâts à mains nues." },

  { id: 'lutteur_3', nom: 'Lutteur III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'specialite', competence: 'corps', nom: 'Rixe', rang_min: 5 },
      { type: 'avantage', id: 'lutteur_2' }
    ],
    description: "À 3 degrés de réussite, sacrifiez vos dés pour assommer (test contre Endurance passive de la cible). Récupération = action majeure de la cible." },

  { id: 'maitre_braavosi_1', nom: 'Maître bräavosi I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Escrime', rang_min: 1 }
    ],
    description: "Les armes d'Escrime gagnent Défensive +1 (ou augmentent leur Défensive existante de 1). Bonus +1 conservé même quand vous attaquez avec." },

  { id: 'maitre_braavosi_2', nom: 'Maître bräavosi II', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'specialite', competence: 'corps', nom: 'Escrime', rang_min: 2 },
      { type: 'avantage', id: 'maitre_braavosi_1' }
    ],
    description: "Avec une arme d'Escrime, action majeure : sacrifiez vos dés bonus pour une attaque unique adjacente. Si touche : dégâts ordinaires +1 à la Défense de Combat par tranche de 5 du résultat." },

  { id: 'maitre_braavosi_3', nom: 'Maître bräavosi III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 6 },
      { type: 'specialite', competence: 'corps', nom: 'Escrime', rang_min: 3 },
      { type: 'avantage', id: 'maitre_braavosi_2' }
    ],
    description: "Quand un ennemi armé d'une arme de Corps à corps vous rate, contre-attaque gratuite (action franche)." },

  { id: 'maitre_armes_inne', nom: "Maître d'armes inné", categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'agilite', rang_min: 4 },
      { type: 'competence', cle: 'ingeniosite', rang_min: 4 },
      { type: 'competence', cle: 'corps', rang_min: 5 }
    ],
    description: "Maniez n'importe quelle arme sans malus, quels que soient ses prérequis de Formation." },

  { id: 'maitre_armes_hast_1', nom: "Maître des armes d'hast I", categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Armes à hast', rang_min: 2 }
    ],
    description: "Balayage avec une arme d'hast : test de Corps à corps pour jeter à terre les adversaires à portée (-2 par cible supplémentaire)." },

  { id: 'maitre_armes_hast_2', nom: "Maître des armes d'hast II", categorie: 'martial',
    conditions: [
      { type: 'competence_ou', alternatives: [
        { cle: 'corps',      rang_min: 4 },
        { cle: 'athletisme', rang_min: 4 }
      ]},
      { type: 'avantage', id: 'maitre_armes_hast_1' }
    ],
    description: "Pour jeter un cavalier à bas de sa monture : convertissez vos dés bonus d'Armes à hast en dés de test ; sinon vous êtes désarmé." },

  { id: 'maitre_armes_hast_3', nom: "Maître des armes d'hast III", categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'avantage', id: 'maitre_armes_hast_2' }
    ],
    description: "Action majeure : immobilisez un adversaire avec ≥ 2 degrés de réussite (l'empêchez de dépenser une action mineure pour se déplacer)." },

  { id: 'maitre_armures', nom: 'Maître des armures', categorie: 'martial',
    conditions: [],
    description: "+1 VA, Encombrement de l'armure -1." },

  { id: 'maitre_boucliers', nom: 'Maître des boucliers', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 3 },
      { type: 'specialite', competence: 'corps', nom: 'Boucliers', rang_min: 1 }
    ],
    description: "+1 au Bonus défensif de tout bouclier que vous portez." },

  { id: 'maitre_casse_tete_1', nom: 'Maître des casse-tête I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Casse-tête', rang_min: 2 }
    ],
    description: "L'arme casse-tête gagne la qualité Fracassante (ou +1 à sa valeur de Fracassante)." },

  { id: 'maitre_casse_tete_2', nom: 'Maître des casse-tête II', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'specialite', competence: 'corps', nom: 'Casse-tête', rang_min: 3 },
      { type: 'avantage', id: 'maitre_casse_tete_1' }
    ],
    description: "Sacrifiez vos dés bonus pour réduire la cible à 1 action mineure et -1 par degré au tour suivant." },

  { id: 'maitre_casse_tete_3', nom: 'Maître des casse-tête III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 6 },
      { type: 'specialite', competence: 'corps', nom: 'Casse-tête', rang_min: 4 },
      { type: 'avantage', id: 'maitre_casse_tete_2' }
    ],
    description: "Sacrifiez vos dés bonus : l'adversaire subit une blessure, tombe à terre et perd ses actions." },

  { id: 'maitre_haches_1', nom: 'Maître des haches I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Haches', rang_min: 2 }
    ],
    description: "Sacrifiez des dés bonus pour ajouter aux dégâts (avant VA, mais après degrés)." },

  { id: 'maitre_haches_2', nom: 'Maître des haches II', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'specialite', competence: 'corps', nom: 'Haches', rang_min: 3 },
      { type: 'avantage', id: 'maitre_haches_1' }
    ],
    description: "Sacrifiez tous vos dés bonus pour infliger une blessure (en plus des dégâts)." },

  { id: 'maitre_haches_3', nom: 'Maître des haches III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 6 },
      { type: 'specialite', competence: 'corps', nom: 'Haches', rang_min: 4 },
      { type: 'avantage', id: 'maitre_haches_2' }
    ],
    description: "Sacrifiez tous vos dés bonus pour infliger blessure + Mutilé (l'adversaire peut brûler 1 PD pour éviter Mutilé)." },

  { id: 'maitre_lames_courtes_1', nom: 'Maître des lames courtes I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Lames courtes', rang_min: 1 }
    ],
    description: "Vos lames courtes acquièrent la qualité Perforante 1 (ou +1 si déjà présente)." },

  { id: 'maitre_lames_courtes_2', nom: 'Maître des lames courtes II', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'avantage', id: 'maitre_lames_courtes_1' }
    ],
    description: "Dégainer une lame courte = action franche ; ajoutez vos dés bonus en Lames courtes au résultat des tests de Corps à corps avec elle." },

  { id: 'maitre_lames_courtes_3', nom: 'Maître des lames courtes III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 6 },
      { type: 'avantage', id: 'maitre_lames_courtes_2' }
    ],
    description: "Avec une lame courte, ajoutez vos dés bonus de la spécialité aux dégâts (après degrés)." },

  { id: 'maitre_lames_longues_1', nom: 'Maître des lames longues I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 4 },
      { type: 'specialite', competence: 'corps', nom: 'Lames longues', rang_min: 2 }
    ],
    description: "Sacrifiez tous vos dés bonus de Lames longues pour 1 degré de réussite gratuit. Adversaires armés d'armes de parade subissent -1 à leur Défense de Combat." },

  { id: 'maitre_lames_longues_2', nom: 'Maître des lames longues II', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 5 },
      { type: 'avantage', id: 'maitre_lames_longues_1' }
    ],
    description: "Sacrifiez 2 dés bonus pour déplacer la cible touchée d'1 m dans n'importe quelle direction (peut la pousser dans le terrain dangereux)." },

  { id: 'maitre_lames_longues_3', nom: 'Maître des lames longues III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 6 },
      { type: 'avantage', id: 'maitre_lames_longues_2' }
    ],
    description: "Sacrifiez vos dés bonus pour infliger une blessure + Mutilé (l'adversaire peut brûler 1 PD pour éviter Mutilé)." },

  { id: 'maitre_lances_1', nom: 'Maître des lances I', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 3 },
      { type: 'specialite', competence: 'corps', nom: 'Lances', rang_min: 1 }
    ],
    description: "Action majeure : si une attaque rate, attaquez immédiatement un autre ennemi adjacent." },

  { id: 'maitre_lances_2', nom: 'Maître des lances II', categorie: 'martial',
    conditions: [{ type: 'avantage', id: 'maitre_lances_1' }],
    description: "+1D aux tentatives de Renversement avec une lance ; attaquez les adversaires 1 m plus loin que d'ordinaire." },

  { id: 'maitre_lances_3', nom: 'Maître des lances III', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'athletisme', rang_min: 5 },
      { type: 'avantage', id: 'maitre_lances_2' }
    ],
    description: "Vos lances acquièrent Perforante 2 (ou +2 si déjà Perforantes)." },

  { id: 'maitrise_armes', nom: 'Maîtrise des armes', categorie: 'martial',
    conditions: [],
    description: "Choisissez une arme spécifique : ses dégâts augmentent de 1.",
    cumulable: true },

  { id: 'maitrise_boucliers', nom: 'Maîtrise des boucliers', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 3 },
      { type: 'specialite', competence: 'corps', nom: 'Boucliers', rang_min: 1 }
    ],
    description: "+1 Bonus défensif des boucliers (cumule avec Maître des boucliers)." },

  { id: 'maitrise_sup_armes', nom: 'Maîtrise supérieure des armes', categorie: 'martial',
    conditions: [{ type: 'avantage', id: 'maitrise_armes' }],
    description: "Cumulé avec Maîtrise des armes : dégâts de l'arme choisie +1 supplémentaire." },

  { id: 'maitrise_sup_armures', nom: 'Maîtrise supérieure des armures', categorie: 'martial',
    conditions: [{ type: 'avantage', id: 'maitre_armures' }],
    description: "Cumulé avec Maître des armures : VA de votre armure +1 supplémentaire (total +2)." },

  { id: 'meneur_hommes', nom: "Meneur d'hommes", categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'art_mil', rang_min: 4 },
      { type: 'specialite', competence: 'art_mil', nom: 'Commandement', rang_min: 1 }
    ],
    description: "Une fois par round en escarmouche/bataille, réorganisez automatiquement une unité désorganisée ou ralliez une unité en déroute (gratuit, ne consomme pas un ordre)." },

  { id: 'oint', nom: 'Oint', categorie: 'martial',
    conditions: [{ type: 'avantage', id: 'mecene' }],
    description: "Vous êtes un chevalier oint : +2 aux tests de Statut, 1/jour gagnez +5 à toutes les Défenses (action franche)." },

  { id: 'precis', nom: 'Précis', categorie: 'martial',
    conditions: [{ type: 'competence', cle: 'tir', rang_min: 4 }],
    description: "+1D contre les adversaires disposant d'une couverture (ignore couvert partiel)." },

  { id: 'rapide', nom: 'Rapide', categorie: 'martial',
    conditions: [],
    description: "Déplacement +1 m ; sprint × 5 au lieu de × 4." },

  { id: 'rechargement_rapide', nom: 'Rechargement rapide', categorie: 'martial',
    conditions: [{ type: 'competence', cle: 'agilite', rang_min: 4 }],
    description: "Réduit le temps de rechargement des armes de Tir d'un cran (majeure → mineure ; mineure → franche)." },

  { id: 'sixieme_sens', nom: 'Sixième sens', categorie: 'martial',
    conditions: [{ type: 'competence', cle: 'vigilance', rang_min: 4 }],
    description: "Relancez les 1 sur les tests d'initiative ; annulez le bonus de +1D des attaques par surprise contre vous." },

  { id: 'tir_double', nom: 'Tir double', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'tir', rang_min: 5 },
      { type: 'specialite', competence: 'tir', nom: 'Arcs', rang_min: 3 }
    ],
    description: "Action majeure : tirez 2 flèches simultanément (-1D à chaque test). Mêmes ou cibles adjacentes." },

  { id: 'tir_triple', nom: 'Tir triple', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'tir', rang_min: 7 },
      { type: 'specialite', competence: 'tir', nom: 'Arcs', rang_min: 5 },
      { type: 'avantage', id: 'tir_double' }
    ],
    description: "Action majeure : 3 flèches simultanées (-2D à chaque test)." },

  { id: 'tireur_elite', nom: "Tireur d'élite", categorie: 'martial',
    conditions: [{ type: 'competence', cle: 'tir', rang_min: 5 }],
    description: "Tous vos arcs et arbalètes gagnent Perforante 1 (ou +1 si déjà Perforante) et la qualité Hargneuse." },

  { id: 'veteran_tournois', nom: 'Vétéran des tournois', categorie: 'martial',
    conditions: [
      { type: 'competence', cle: 'corps', rang_min: 3 },
      { type: 'specialite', competence: 'corps', nom: 'Lances', rang_min: 1 },
      { type: 'competence', cle: 'statut', rang_min: 3 },
      { type: 'specialite', competence: 'statut', nom: 'Tournois', rang_min: 1 }
    ],
    description: "En joute : ajoutez vos dés bonus de Tournois aux résultats de Corps à corps et à votre Dressage passif." },

  // =================================================================
  // ATTRIBUTS SOCIAUX
  // =================================================================
  { id: 'apprecie_peuple', nom: 'Apprécié par le peuple', categorie: 'social',
    conditions: [],
    description: "+1B aux tests de Persuasion contre les personnages de Statut ≤ 3." },

  { id: 'apprecie_nobles', nom: 'Apprécié par les nobles', categorie: 'social',
    conditions: [],
    description: "+1B aux tests de Persuasion contre les personnages de Statut ≥ 4." },

  { id: 'autorite', nom: 'Autorité', categorie: 'social',
    conditions: [],
    description: "Réduit de 2 le malus dû à l'humeur affectant la Persuasion (humeur Inamicale = malus -2 au lieu de -4, etc.)." },

  { id: 'charismatique', nom: 'Charismatique', categorie: 'social',
    conditions: [{ type: 'competence', cle: 'persuasion', rang_min: 3 }],
    description: "Choisissez une spécialité de Persuasion : +2 au résultat des tests avec cette spécialité.",
    cumulable: true },

  { id: 'convaincant', nom: 'Convaincant', categorie: 'social',
    conditions: [{ type: 'avantage', id: 'charismatique' }],
    description: "Choisissez une spécialité de Persuasion associée à Charismatique : Influence avec cette spécialité +1.",
    cumulable: true },

  { id: 'courtois', nom: 'Courtois', categorie: 'social',
    conditions: [{ type: 'competence', cle: 'persuasion', rang_min: 3 }],
    description: "Ajoutez la moitié de votre rang de Persuasion à votre Duperie passive ; +Ingéniosité à Duperie passive contre la spécialité Comprendre la cible." },

  { id: 'devoue', nom: 'Dévoué', categorie: 'social',
    conditions: [{ type: 'competence', cle: 'volonte', rang_min: 4 }],
    description: "Vos adversaires subissent -1D à tous les tests de Persuasion via Convaincre, Intimider ou Séduire contre vous." },

  { id: 'diplomate_avise', nom: 'Diplomate avisé', categorie: 'social',
    conditions: [
      { type: 'competence', cle: 'vigilance', rang_min: 4 },
      { type: 'specialite', competence: 'vigilance', nom: 'Empathie', rang_min: 2 }
    ],
    description: "Pendant l'action Réfléchir d'une intrigue : conservez tous vos dés bonus jusqu'à la fin de l'intrigue (sans limite normale)." },

  { id: 'eloquent', nom: 'Éloquent', categorie: 'social',
    conditions: [
      { type: 'competence', cle: 'langue', rang_min: 4 },
      { type: 'competence', cle: 'persuasion', rang_min: 4 }
    ],
    description: "Vous jouez automatiquement en premier lors d'une intrigue (équivalent d'une initiative parfaite)." },

  { id: 'fascinant', nom: 'Fascinant', categorie: 'social',
    conditions: [{ type: 'avantage', id: 'charismatique' }],
    description: "Avec la spécialité Charme : l'humeur de la cible augmente d'un cran par dé bonus de Charme investi (minimum 2 crans)." },

  { id: 'maitre_negociateur', nom: 'Maître négociateur', categorie: 'social',
    conditions: [{ type: 'competence', cle: 'duperie', rang_min: 3 }],
    description: "Tant que vos adversaires ignorent votre humeur, vous ne subissez aucun malus dû à votre humeur de départ aux tests de Persuasion." },

  { id: 'obstine', nom: 'Obstiné', categorie: 'social',
    conditions: [
      { type: 'competence', cle: 'volonte', rang_min: 3 },
      { type: 'specialite', competence: 'volonte', nom: 'Dévouement', rang_min: 1 }
    ],
    description: "Ajoutez votre rang de Dévouement à votre Sang-froid." },

  { id: 'perfide', nom: 'Perfide', categorie: 'social',
    conditions: [],
    description: "Ajoutez votre rang d'Ingéniosité au résultat des tests de Duperie effectués durant une intrigue." },

  { id: 'respecte', nom: 'Respecté', categorie: 'social',
    conditions: [{ type: 'specialite', competence: 'statut', nom: 'Réputation', rang_min: 2 }],
    description: "Pendant les intrigues, vos adversaires subissent -1D aux tests de Persuasion impliquant Inciter, Intimider et Persifler." },

  { id: 'seduisant', nom: 'Séduisant', categorie: 'social',
    conditions: [],
    description: "Sur les tests de Persuasion : relancez les 1 (un nombre = moitié rang Persuasion, min 1)." },

  { id: 'sociable', nom: 'Sociable', categorie: 'social',
    conditions: [],
    description: "+2B aux tests de Persuasion contre les étrangers à Westeros (issus des cités libres ou au-delà)." },

];

// Vérification au chargement.
(function verifierIntegriteAvantages() {
  const idsVus = new Set();
  const categoriesValides = ['competence', 'destin', 'heritage', 'martial', 'social'];

  AVANTAGES.forEach(a => {
    if (idsVus.has(a.id)) console.warn(`[avantages.js] id en doublon : "${a.id}".`);
    idsVus.add(a.id);
    if (!categoriesValides.includes(a.categorie)) {
      console.warn(`[avantages.js] "${a.nom}" : categorie="${a.categorie}" inconnue.`);
    }
    if (!Array.isArray(a.conditions)) {
      console.warn(`[avantages.js] "${a.nom}" : conditions doit être un tableau.`);
    }
  });

  // Crosscheck des prérequis pointant vers d'autres avantages (avantage / avantage_ou)
  AVANTAGES.forEach(a => {
    a.conditions.forEach(c => {
      if (c.type === 'avantage') {
        if (!idsVus.has(c.id)) {
          console.warn(`[avantages.js] "${a.nom}" requiert l'avantage "${c.id}" qui n'existe pas.`);
        }
      } else if (c.type === 'avantage_ou') {
        (c.ids || []).forEach(id => {
          if (!idsVus.has(id)) {
            console.warn(`[avantages.js] "${a.nom}" (avantage_ou) référence "${id}" qui n'existe pas.`);
          }
        });
      }
    });
  });

  console.log(`[avantages.js] ${AVANTAGES.length} avantages chargés.`);
})();
