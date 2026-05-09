// --- Armures du Trône de Fer JdR (Table 9-2) ---
//
// Source : Chapitre 9, page 151 du livre Green Ronin VF.
//
// FORMAT D'UNE ARMURE :
//   - id            : identifiant interne snake_case
//   - nom           : libellé affiché
//   - va            : Valeur d'Armure — réduit les dégâts encaissés
//   - malus_armure  : malus aux tests d'Agilité (y compris résultats
//                     passifs) et à la Défense de Combat (entier négatif)
//   - encombrement  : points d'Encombrement, ajoutés au total qui réduit
//                     le Déplacement (cf. data/deplacement.js)
//
// USAGE DANS LES CALCULS :
//   - Défense de Combat = Agilité + Athlétisme + Vigilance + malus_armure
//                         + bonus défensifs (bouclier, arme défensive)
//   - Dégâts encaissés réduits de la VA (mais minimum 0).
//   - L'encombrement total module le Déplacement (Table 9-1).

const ARMURES = [
  { id: 'vetements',          nom: 'Vêtements',                va: 0,  malus_armure: 0,  encombrement: 0 },
  { id: 'robe_chasuble',      nom: 'Robe, chasuble',           va: 1,  malus_armure: 0,  encombrement: 1 },
  { id: 'jaque',              nom: 'Jaque',                    va: 1,  malus_armure: 0,  encombrement: 0 },
  { id: 'cuir_souple',        nom: 'Armure de cuir souple',    va: 2,  malus_armure: -1, encombrement: 1 },
  { id: 'cuir_rigide',        nom: 'Armure de cuir rigide',    va: 3,  malus_armure: -2, encombrement: 0 },
  { id: 'bois_os',            nom: "Armure de bois ou d'os",   va: 4,  malus_armure: -3, encombrement: 1 },
  { id: 'mailles',            nom: 'Armure de mailles',        va: 4,  malus_armure: -2, encombrement: 1 },
  { id: 'peaux',              nom: 'Armure de peaux',          va: 5,  malus_armure: -3, encombrement: 3 },
  { id: 'cotte_de_mailles',   nom: 'Cotte de mailles',         va: 5,  malus_armure: -3, encombrement: 2 },
  { id: 'cuirasse',           nom: 'Cuirasse',                 va: 5,  malus_armure: -2, encombrement: 3 },
  { id: 'ecailles',           nom: 'Armure à écailles',        va: 6,  malus_armure: -3, encombrement: 2 },
  { id: 'ecrevisse',          nom: 'Écrevisse',                va: 7,  malus_armure: -3, encombrement: 3 },
  { id: 'brigandine',         nom: 'Brigandine',               va: 8,  malus_armure: -4, encombrement: 3 },
  { id: 'harnois',            nom: 'Harnois',                  va: 9,  malus_armure: -5, encombrement: 3 },
  { id: 'harnois_complet',    nom: 'Harnois complet',          va: 10, malus_armure: -6, encombrement: 3 },
];

// Vérification simple au chargement.
(function verifierIntegriteArmures() {
  const idsVus = new Set();
  ARMURES.forEach(a => {
    if (idsVus.has(a.id)) console.warn(`[armures.js] id en doublon : "${a.id}".`);
    idsVus.add(a.id);
    if (typeof a.va !== 'number' || a.va < 0) console.warn(`[armures.js] "${a.nom}" : va invalide.`);
    if (typeof a.malus_armure !== 'number' || a.malus_armure > 0) console.warn(`[armures.js] "${a.nom}" : malus_armure devrait être ≤ 0.`);
    if (typeof a.encombrement !== 'number' || a.encombrement < 0) console.warn(`[armures.js] "${a.nom}" : encombrement invalide.`);
  });
  console.log(`[armures.js] ${ARMURES.length} armures chargées.`);
})();
