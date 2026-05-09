// --- Qualités d'armes du Trône de Fer JdR ---
//
// Définit les qualités spéciales que peuvent porter les armes
// (Chapitre 9 du livre de règles Green Ronin VF, pages 152-155).
//
// Descriptions = résumés fonctionnels en français, rédigés à partir
// des règles du livre. Référence : Chapitre 9, section "Traits des armes".
//
// CHAQUE QUALITÉ A :
//   - id           : identifiant interne (snake_case, sans accent)
//   - nom          : libellé affiché en français
//   - parametree   : true si la qualité prend une valeur (ex. "Perforante 2")
//   - description  : règle résumée en français, à afficher en infobulle
//   - effets       : champs structurés pour les calculs automatiques
//                    (vide {} si l'effet n'est pas calculable automatiquement)
//
// CONVENTION : ce fichier ne contient AUCUNE logique. Il est chargé
// par index.html avant data/armes.js (qui référence les ids).
// Les effets mécaniques sont appliqués dans js/calculs.js et
// js/combat.js, pas ici.

const QUALITES = {

  // -------------------------------------------------------------
  // ATTAQUE & DÉGÂTS
  // -------------------------------------------------------------

  perforante: {
    id: 'perforante',
    nom: 'Perforante',
    parametree: true,
    description:
      "L'arme ignore X points de Valeur d'Armure de la cible lors d'une " +
      "attaque réussie.",
    effets: {
      // 'X' = valeur portée par l'arme — interprétée par calculs.js
      va_reduction: 'X'
    }
  },

  puissante: {
    id: 'puissante',
    nom: 'Puissante',
    parametree: false,
    description:
      "Pour chaque dé de bonus que vous investissez en Force lors d'une " +
      "attaque avec cette arme, augmentez ses dégâts de +1.",
    effets: {
      // Bonus aux dégâts proportionnel aux dés de Force investis dans le test.
      bonus_par_de_force: 1
    }
  },

  empalement: {
    id: 'empalement',
    nom: 'Empalement',
    parametree: false,
    description:
      "Avec au moins 3 degrés de réussite à l'attaque, l'arme transperce la " +
      "cible et y reste fichée. La victime ne peut plus se déplacer mais " +
      "vous ne pouvez plus l'attaquer avec cette arme. Pour déloger l'arme : " +
      "test d'Athlétisme contre une difficulté de (3 + VA de la cible). " +
      "En cas de réussite, chaque degré de réussite supplémentaire inflige " +
      "les dégâts de l'arme.",
    effets: {
      seuil_degres_reussite: 3
    }
  },

  fracassante: {
    id: 'fracassante',
    nom: 'Fracassante',
    parametree: true,
    description:
      "Avec plusieurs degrés de réussite, réduit le Bonus Défensif d'une " +
      "arme adverse OU la Valeur d'Armure de l'adversaire de X points. " +
      "L'effet s'applique d'abord aux armes Défensives ; quand un Bonus " +
      "Défensif (arme) ou une VA (armure) tombe à 0, l'objet est détruit.",
    effets: {
      degats_armure_ou_arme: 'X'
    }
  },

  assommante: {
    id: 'assommante',
    nom: 'Assommante',
    parametree: false,
    description:
      "Quand vous obtenez plusieurs degrés de réussite avec cette arme, " +
      "vous pouvez sacrifier l'un d'eux pour étourdir l'adversaire : il ne " +
      "pourra pas réaliser d'action majeure à son prochain tour.",
    effets: {}
  },

  hargneuse: {
    id: 'hargneuse',
    nom: 'Hargneuse',
    parametree: false,
    description:
      "Si vous vainquez un adversaire avec une arme Hargneuse, sa défaite " +
      "se solde systématiquement par la mort. La victime peut brûler 1 " +
      "Point de Destinée pour échapper à ce sort.",
    effets: {}
  },

  // -------------------------------------------------------------
  // DÉFENSE & MAIN SECONDAIRE
  // -------------------------------------------------------------

  defensive: {
    id: 'defensive',
    nom: 'Défensive',
    parametree: true,
    description:
      "Si vous tenez l'arme SANS l'utiliser pour attaquer ce tour-ci, elle " +
      "ajoute +X à votre Défense de Combat. Si l'arme a aussi la qualité " +
      "Secondaire et que vous utilisez le bonus Secondaire pour augmenter " +
      "les dégâts, vous perdez le bonus Défensif jusqu'à votre prochain tour.",
    effets: {
      // Bonus appliqué uniquement si le porteur n'attaque pas avec cette arme.
      defense_bonus_si_pas_attaque: 'X'
    }
  },

  secondaire: {
    id: 'secondaire',
    nom: 'Secondaire',
    parametree: true,
    description:
      "L'arme se manie en main non-directrice (off-hand). Lors d'une attaque " +
      "à deux armes (action majeure) réussie, vous pouvez ajouter le " +
      "modificateur Secondaire (+X) aux dégâts de votre arme principale.",
    effets: {
      bonus_degats_arme_principale: 'X'
    }
  },

  // -------------------------------------------------------------
  // VITESSE / ALLONGE
  // -------------------------------------------------------------

  rapide: {
    id: 'rapide',
    nom: 'Rapide',
    parametree: false,
    description:
      "Lors d'une attaque répartie (plusieurs cibles dans le même tour), " +
      "vous gagnez +1B à chaque test. Ces dés bonus peuvent dépasser la " +
      "limite habituelle du nombre de dés par attaque.",
    effets: {
      bonus_par_test_attaque_repartie: '+1B'
    }
  },

  lente: {
    id: 'lente',
    nom: 'Lente',
    parametree: false,
    description:
      "L'arme est embarrassante : vous ne pouvez pas porter d'attaques " +
      "réparties avec elle.",
    effets: {
      interdit_attaque_repartie: true
    }
  },

  allonge: {
    id: 'allonge',
    nom: 'Allonge',
    parametree: false,
    description:
      "Vous pouvez attaquer un adversaire non-adjacent jusqu'à 3 mètres en " +
      "subissant un malus de –1D au test de Corps à Corps.",
    effets: {
      portee_metres: 3,
      malus_test: '-1D'
    }
  },

  // -------------------------------------------------------------
  // PORTÉE (ARMES À DISTANCE)
  // -------------------------------------------------------------

  portee_courte: {
    id: 'portee_courte',
    nom: 'Portée Courte',
    parametree: false,
    description:
      "Portée effective de 10 mètres sans malus. Au-delà : –1D au test de " +
      "Tir par tranche entamée de 10 mètres supplémentaires.",
    effets: {
      portee_optimale_m: 10,
      tranche_malus_m: 10,
      malus_par_tranche: '-1D'
    }
  },

  portee_longue: {
    id: 'portee_longue',
    nom: 'Portée Longue',
    parametree: false,
    description:
      "Portée effective de 100 mètres avec ligne de tir dégagée. Au-delà : " +
      "–1D au test de Tir par tranche entamée de 100 mètres supplémentaires.",
    effets: {
      portee_optimale_m: 100,
      tranche_malus_m: 100,
      malus_par_tranche: '-1D'
    }
  },

  rechargement: {
    id: 'rechargement',
    nom: 'Rechargement',
    parametree: true,
    description:
      "L'arme nécessite une action de rechargement entre les tirs. La " +
      "valeur précise la nature de l'action requise : 'mineure' ou 'majeure'.",
    effets: {
      action_rechargement: 'X'
    }
  },

  // -------------------------------------------------------------
  // ENCOMBREMENT & MANIEMENT
  // -------------------------------------------------------------

  deux_mains: {
    id: 'deux_mains',
    nom: 'Deux Mains',
    parametree: false,
    description:
      "L'arme se manie à deux mains. Si vous la tenez à une seule main, " +
      "votre test de Corps à Corps subit un malus de –2D.",
    effets: {
      malus_si_une_main: '-2D'
    }
  },

  incommode: {
    id: 'incommode',
    nom: 'Incommode',
    parametree: false,
    description:
      "L'arme n'est pas conçue pour le combat à cheval. À cheval, vous " +
      "subissez un malus de –2D aux tests liés à cette arme (Corps à Corps " +
      "ou Tir selon le cas).",
    effets: {
      malus_a_cheval: '-2D'
    }
  },

  encombrante: {
    id: 'encombrante',
    nom: 'Encombrante',
    parametree: true,
    description:
      "L'arme augmente votre Encombrement total de X points pour le calcul " +
      "de votre Déplacement (Table 9-1).",
    effets: {
      encombrement_supp: 'X'
    }
  },

  fragile: {
    id: 'fragile',
    nom: 'Fragile',
    parametree: false,
    description:
      "Quand vous obtenez plusieurs degrés de réussite avec cette arme, " +
      "elle se brise automatiquement.",
    effets: {}
  },

  // -------------------------------------------------------------
  // CORPS À CORPS / RIXE / SPÉCIAUX
  // -------------------------------------------------------------

  polyvalente: {
    id: 'polyvalente',
    nom: 'Polyvalente',
    parametree: false,
    description:
      "L'arme se manie à une ou deux mains, au choix. À deux mains, " +
      "augmentez ses dégâts de +1.",
    effets: {
      bonus_degats_si_deux_mains: 1
    }
  },

  empoigne: {
    id: 'empoigne',
    nom: 'Empoigne',
    parametree: false,
    description:
      "Sur une attaque réussie qui égale ou dépasse l'Athlétisme passif de " +
      "la cible (les dés de Force s'appliquent), vous pouvez l'empoigner. " +
      "Une cible empoignée subit –5 à sa Défense de Combat (min 1), ne peut " +
      "se déplacer (sauf à se libérer via une action mineure de Corps à " +
      "Corps en Rixe), et ne peut attaquer qu'avec une arme de Rixe ou " +
      "une Lame courte. De votre côté, tant que vous empoignez, vous ne " +
      "pouvez pas vous déplacer ni attaquer autrement qu'avec une arme " +
      "d'Empoigne ou Secondaire.",
    effets: {
      malus_defense_cible: -5,
      defense_cible_min: 1
    }
  },

  empetrement: {
    id: 'empetrement',
    nom: 'Empêtrement',
    parametree: false,
    description:
      "L'adversaire frappé voit son Déplacement réduit à 1 mètre et subit " +
      "–5 à tous ses tests. Il peut se libérer (action mineure) via un test " +
      "d'Athlétisme délicat (9) avec les dés de Force, OU un test d'Agilité " +
      "délicat (9) avec les dés de Contorsionniste. Tant que la cible reste " +
      "empêtrée, vous ne pouvez pas porter de nouvelles attaques avec cette " +
      "arme.",
    effets: {
      cible_deplacement_m: 1,
      malus_tests_cible: -5,
      seuil_liberation: 9
    }
  },

  // -------------------------------------------------------------
  // CAVALERIE
  // -------------------------------------------------------------

  montee: {
    id: 'montee',
    nom: 'Montée',
    parametree: false,
    description:
      "Arme conçue pour le combat à cheval. À pied, elle impose un malus " +
      "de –2D aux tests de Corps à Corps.",
    effets: {
      malus_au_sol: '-2D'
    }
  },

  reception_charge: {
    id: 'reception_charge',
    nom: 'Réception de Charge',
    parametree: false,
    description:
      "L'arme est trop incommode pour le combat classique : elle ne sert " +
      "qu'au moyen de l'action 'Réception de Charge' (action majeure, " +
      "préparée). Si une cible vous charge, l'attaque touche, augmentez " +
      "les dégâts de base de l'arme de +2.",
    effets: {
      bonus_action_reception: 2
    }
  },

};

// Vérification simple au chargement : alerte si on a oublié un champ.
// (S'exécute à chaque chargement de la page.)
(function verifierIntegriteQualites() {
  const champsAttendus = ['id', 'nom', 'parametree', 'description', 'effets'];
  Object.entries(QUALITES).forEach(([cle, q]) => {
    champsAttendus.forEach(champ => {
      if (!(champ in q)) {
        console.warn(`[qualites.js] Qualité "${cle}" : champ "${champ}" manquant.`);
      }
    });
    if (q.id !== cle) {
      console.warn(`[qualites.js] Qualité "${cle}" : id="${q.id}" ne correspond pas à la clé.`);
    }
  });
})();
