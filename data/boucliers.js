// --- Boucliers du Trône de Fer JdR (extraits de la Table 9-3) ---
//
// Source : Chapitre 9, page 152 du livre Green Ronin VF.
//
// Les boucliers sont listés dans la Table 9-3 (Armes), spécialité "Bouclier",
// mais traités à part dans cette app : ce ne sont pas vraiment des armes
// au sens combat actif (on s'en sert pour parer), même s'ils peuvent être
// utilisés pour frapper (dégâts = Athlétisme −2).
//
// FORMAT D'UN BOUCLIER :
//   - id              : identifiant interne snake_case
//   - nom             : libellé affiché
//   - formation       : rang minimum requis dans la spécialité Bouclier
//                       (null = aucune ; 1 ou 2 = pénalité si rang inférieur)
//   - bonus_defensif  : ajouté à la Défense de Combat tant que le bouclier
//                       est tenu (cumulable avec arme Défensive)
//   - qualites        : tableau de { id, valeur? } référençant QUALITES
//                       (Encombrante pour les gros boucliers, Secondaire
//                       pour la Targe)
//   - degats_attaque  : utilisé si on frappe avec le bouclier
//                       { attribut: 'athletisme', mod: -2 }
//
// DÉPENDANCE : qualites.js doit être chargé AVANT ce fichier.

const BOUCLIERS = [
  {
    id: 'targe',
    nom: 'Targe',
    formation: null,
    bonus_defensif: 1,
    qualites: [
      { id: 'secondaire', valeur: 1 },
    ],
    degats_attaque: { attribut: 'athletisme', mod: -2 }
  },
  {
    id: 'bouclier',
    nom: 'Bouclier',
    formation: null,
    bonus_defensif: 2,
    qualites: [],
    degats_attaque: { attribut: 'athletisme', mod: -2 }
  },
  {
    id: 'grand_bouclier',
    nom: 'Grand bouclier',
    formation: 1,
    bonus_defensif: 4,
    qualites: [
      { id: 'encombrante', valeur: 1 },
    ],
    degats_attaque: { attribut: 'athletisme', mod: -2 }
  },
  {
    id: 'pavois',
    nom: 'Pavois',
    formation: 2,
    bonus_defensif: 6,
    qualites: [
      { id: 'encombrante', valeur: 2 },
    ],
    degats_attaque: { attribut: 'athletisme', mod: -2 }
  },
];

// Vérification au chargement.
(function verifierIntegriteBoucliers() {
  if (typeof QUALITES === 'undefined') {
    console.error("[boucliers.js] QUALITES n'est pas défini. " +
      "data/qualites.js doit être chargé AVANT data/boucliers.js.");
    return;
  }
  const idsVus = new Set();
  BOUCLIERS.forEach(b => {
    if (idsVus.has(b.id)) console.warn(`[boucliers.js] id en doublon : "${b.id}".`);
    idsVus.add(b.id);
    b.qualites.forEach(q => {
      if (!QUALITES[q.id]) {
        console.warn(`[boucliers.js] "${b.nom}" : qualité "${q.id}" inexistante dans QUALITES.`);
      }
    });
  });
  console.log(`[boucliers.js] ${BOUCLIERS.length} boucliers chargés.`);
})();
