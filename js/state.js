// === État central du personnage ===
//
// Source unique de vérité. Toutes les mutations passent par les
// méthodes de cet objet ; chaque mutation déclenche les listeners
// (UI), qui re-rendent ce qu'il faut.
//
// Pas de DOM ici. Pas de logique de calcul (ça vit dans calculs.js).
// Juste : stockage + mutations + persistence localStorage + abonnés.
//
// FORMAT DE state.data :
//   identité       : nom, maison, age, sexe, role, statut_depart,
//                    histoire, objectif, vertu, vice, traits, allies
//   compétences    : skills[skillKey] = rang (entier, défaut 2)
//   spécialités    : specialties[skillKey] = { specName: rangB }
//   équipement     : armure (id), bouclier (id),
//                    armes (array d'ids — peut contenir des doublons)
//   destinée       : avantages (array d'ids),
//                    defauts (array d'ids),
//                    faiblesses (array de { competence, count })
//
// PERSISTENCE :
//   Sérialisation automatique en localStorage à chaque modification.
//   Restauration au chargement (cf. State.charger()).

const State = {

  // -----------------------------------------------------------
  // Données du personnage
  // -----------------------------------------------------------
  data: null,   // initialisé par State.init()

  // Liste des observateurs notifiés à chaque mutation
  _listeners: [],

  // Clé de stockage local
  _CLE_STORAGE: 'got_perso_v1',
  // Clé de la bibliothèque (plusieurs personnages sauvegardés)
  _CLE_BIBLIO:  'got_perso_library_v1',
  // ID de la fiche de la bibliothèque actuellement chargée (null si nouveau perso non sauvé)
  _idCourant:   null,

  // -----------------------------------------------------------
  // Initialisation
  // -----------------------------------------------------------
  init() {
    this.data = this._etatVierge();
    // Initialise toutes les compétences à rang 2 (défaut du système)
    if (typeof SKILLS !== 'undefined') {
      SKILLS.forEach(s => {
        this.data.skills[s.key] = 2;
        this.data.specialties[s.key] = {};
      });
    }
  },

  _etatVierge() {
    return {
      // Identité de base
      nom: '', maison: '', age: '', sexe: '', role: '',
      statut_depart: '',

      // Concept & histoire
      histoire: '', objectif: '', motivation: '', vertu: '', vice: '',
      traits: '', allies: '',

      // Apparence physique (fiche officielle)
      taille: '', poids: '',
      couleur_yeux: '', couleur_cheveux: '',

      // Détails de personnage
      habitudes:        '',
      serviteurs:       '',
      ennemis:          '',
      serments:         '',
      armoiries:        '',
      portrait:         '',
      devises:          '',
      equipement_libre: '',  // Possessions hors armes/armure
      blessures_notes:  '',  // Notes textuelles de blessures (la mécanique reste calculée)

      // Compétences/Spécialités
      skills:      {},  // key -> rang
      specialties: {},  // key -> { specName: rangB }

      // Équipement
      armure:   null,   // id ARMURES
      bouclier: null,   // id BOUCLIERS
      armes:    [],     // [id, ...] — doublons autorisés

      // Destinée
      avantages:  [],   // [id, ...]
      defauts:    [],   // [id, ...]
      faiblesses: [],   // [{ competence: skillKey, count: n }]
    };
  },

  // -----------------------------------------------------------
  // Souscription / notification
  // -----------------------------------------------------------
  subscribe(fn) {
    this._listeners.push(fn);
  },

  notify() {
    this._sauver();
    this._listeners.forEach(fn => {
      try { fn(this.data); }
      catch (e) { console.error('[state.js] Erreur dans un listener :', e); }
    });
  },

  // -----------------------------------------------------------
  // Mutateurs — Identité
  // -----------------------------------------------------------
  set(champ, valeur) {
    this.data[champ] = valeur;
    this.notify();
  },

  // -----------------------------------------------------------
  // Mutateurs — Compétences & spécialités
  // -----------------------------------------------------------
  setSkill(key, rang) {
    this.data.skills[key] = Math.max(1, Math.min(7, rang));
    // Si on baisse une compétence sous le rang d'une spécialité, on borne la spécialité
    const newRang = this.data.skills[key];
    const specs = this.data.specialties[key] || {};
    Object.keys(specs).forEach(name => {
      if (specs[name] > newRang) specs[name] = newRang;
      if (specs[name] <= 0) delete specs[name];
    });
    this.notify();
  },

  changerRangSkill(key, delta) {
    const cur = this.data.skills[key] ?? 2;
    this.setSkill(key, cur + delta);
  },

  setSpecialty(skillKey, name, rangB) {
    if (!this.data.specialties[skillKey]) this.data.specialties[skillKey] = {};
    if (rangB <= 0) {
      delete this.data.specialties[skillKey][name];
    } else {
      // Une spécialité ne peut excéder le rang de sa compétence
      const max = this.data.skills[skillKey] ?? 2;
      this.data.specialties[skillKey][name] = Math.min(max, Math.max(1, rangB));
    }
    this.notify();
  },

  toggleSpecialty(skillKey, name) {
    const cur = (this.data.specialties[skillKey] || {})[name] ?? 0;
    this.setSpecialty(skillKey, name, cur > 0 ? 0 : 1);
  },

  changerRangSpecialty(skillKey, name, delta) {
    const cur = (this.data.specialties[skillKey] || {})[name] ?? 0;
    this.setSpecialty(skillKey, name, cur + delta);
  },

  // -----------------------------------------------------------
  // Mutateurs — Équipement
  // -----------------------------------------------------------
  setArmure(id) {
    this.data.armure = id || null;
    this.notify();
  },

  setBouclier(id) {
    this.data.bouclier = id || null;
    this.notify();
  },

  ajouterArme(id) {
    if (!id) return;
    this.data.armes.push(id);
    this.notify();
  },

  retirerArme(index) {
    if (index < 0 || index >= this.data.armes.length) return;
    this.data.armes.splice(index, 1);
    this.notify();
  },

  // -----------------------------------------------------------
  // Mutateurs — Avantages / Défauts / Faiblesses
  // -----------------------------------------------------------
  toggleAvantage(id) {
    const idx = this.data.avantages.indexOf(id);
    if (idx >= 0) this.data.avantages.splice(idx, 1);
    else this.data.avantages.push(id);
    this.notify();
  },

  toggleDefaut(id) {
    const idx = this.data.defauts.indexOf(id);
    if (idx >= 0) this.data.defauts.splice(idx, 1);
    else this.data.defauts.push(id);
    this.notify();
  },

  setFaiblesse(skillKey, count) {
    const idx = this.data.faiblesses.findIndex(f => f.competence === skillKey);
    if (count <= 0) {
      if (idx >= 0) this.data.faiblesses.splice(idx, 1);
    } else {
      if (idx >= 0) this.data.faiblesses[idx].count = count;
      else this.data.faiblesses.push({ competence: skillKey, count });
    }
    this.notify();
  },

  changerFaiblesse(skillKey, delta) {
    const f = this.data.faiblesses.find(f => f.competence === skillKey);
    const cur = f ? f.count : 0;
    this.setFaiblesse(skillKey, cur + delta);
  },

  // -----------------------------------------------------------
  // Reset complet
  // -----------------------------------------------------------
  reset() {
    if (!confirm('Réinitialiser tout le personnage ? Cette action est irréversible.')) return;
    this.init();
    this.notify();
  },

  // -----------------------------------------------------------
  // Persistence localStorage
  // -----------------------------------------------------------
  _sauver() {
    try {
      localStorage.setItem(this._CLE_STORAGE, JSON.stringify(this.data));
    } catch (e) {
      // localStorage indisponible (mode privé, quota dépassé, etc.) : on ignore
      console.warn('[state.js] Impossible de sauvegarder en localStorage :', e.message);
    }
  },

  charger() {
    try {
      const json = localStorage.getItem(this._CLE_STORAGE);
      if (!json) return false;
      const sauve = JSON.parse(json);
      // Fusion défensive : conserve les champs absents des anciennes versions
      Object.assign(this.data, sauve);
      // Garantit que toutes les compétences existent
      if (typeof SKILLS !== 'undefined') {
        SKILLS.forEach(s => {
          if (!(s.key in this.data.skills))      this.data.skills[s.key] = 2;
          if (!(s.key in this.data.specialties)) this.data.specialties[s.key] = {};
        });
      }
      return true;
    } catch (e) {
      console.warn('[state.js] Erreur au chargement localStorage :', e.message);
      return false;
    }
  },

  exporter() {
    return JSON.stringify(this.data, null, 2);
  },

  importer(json) {
    try {
      const obj = JSON.parse(json);
      this.data = Object.assign(this._etatVierge(), obj);
      if (typeof SKILLS !== 'undefined') {
        SKILLS.forEach(s => {
          if (!(s.key in this.data.skills))      this.data.skills[s.key] = 2;
          if (!(s.key in this.data.specialties)) this.data.specialties[s.key] = {};
        });
      }
      this.notify();
      return true;
    } catch (e) {
      console.error('[state.js] Import JSON invalide :', e.message);
      return false;
    }
  },

  // -----------------------------------------------------------
  // Bibliothèque de personnages (plusieurs slots)
  // -----------------------------------------------------------
  // Format d'une entrée :
  //   { id: number, nom: string, date: ISOstring, data: { … } }

  /**
   * Lit la bibliothèque depuis localStorage.
   * @returns {Array} Liste des fiches sauvegardées (jamais null).
   */
  _lireBiblio() {
    try {
      const json = localStorage.getItem(this._CLE_BIBLIO);
      if (!json) return [];
      const arr = JSON.parse(json);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      console.warn('[state.js] Lecture bibliothèque échouée :', e.message);
      return [];
    }
  },

  /**
   * Écrit la bibliothèque dans localStorage.
   */
  _ecrireBiblio(arr) {
    try {
      localStorage.setItem(this._CLE_BIBLIO, JSON.stringify(arr));
    } catch (e) {
      console.warn('[state.js] Écriture bibliothèque échouée :', e.message);
    }
  },

  /**
   * Liste les personnages sauvegardés (pour affichage UI).
   * @returns {Array<{id, nom, date}>} sans la clé .data pour éviter de tout charger
   */
  listerBiblio() {
    return this._lireBiblio().map(({ id, nom, date }) => ({ id, nom, date }));
  },

  /**
   * Sauvegarde le personnage courant dans la bibliothèque.
   * Si _idCourant est défini → met à jour l'entrée existante.
   * Sinon → crée une nouvelle entrée.
   *
   * Règle de nommage :
   *  - Si `nom` est fourni (non null), on l'applique ET on pose le flag
   *    `nomManuel: true` (signifie : l'utilisateur a explicitement choisi
   *    un nom, on ne le synchronise plus avec data.nom).
   *  - Si `nom` est null/omis → le nom de l'entrée suit `data.nom` SAUF
   *    si l'entrée existante a déjà `nomManuel: true` (auquel cas on garde
   *    le nom manuel pour ne pas écraser un choix conscient de l'utilisateur).
   *
   * @param {string|null} nom Nom explicite, ou null pour utiliser data.nom
   * @returns {number} l'id de l'entrée (utile pour mémoriser _idCourant)
   */
  sauverDansBiblio(nom) {
    const biblio = this._lireBiblio();
    const maintenant = new Date().toISOString();
    // Snapshot complet (deep copy) du state actuel pour découpler de l'édition
    const snapshot = JSON.parse(JSON.stringify(this.data));
    const nomPerso = (this.data?.nom || '').trim() || 'Sans nom';

    if (this._idCourant !== null) {
      // Mise à jour d'une entrée existante
      const idx = biblio.findIndex(e => e.id === this._idCourant);
      if (idx >= 0) {
        const existant   = biblio[idx];
        const nomManuel  = nom !== null && nom !== undefined ? true : (existant.nomManuel === true);
        // Si nom explicite → on le prend. Sinon : nom manuel figé → garder l'existant.
        // Sinon → suivre data.nom (comportement par défaut).
        const nouveauNom = (nom !== null && nom !== undefined)
          ? nom
          : (existant.nomManuel ? existant.nom : nomPerso);
        biblio[idx] = {
          id:        this._idCourant,
          nom:       nouveauNom,
          nomManuel,
          date:      maintenant,
          data:      snapshot,
        };
        this._ecrireBiblio(biblio);
        return this._idCourant;
      }
      // Si l'id n'existe plus (suppression externe ?), on retombe sur création
    }

    // Création d'une nouvelle entrée
    const nouvelId = Date.now();
    const nomManuel = nom !== null && nom !== undefined; // créé avec un nom explicite ?
    biblio.push({
      id:        nouvelId,
      nom:       nom || nomPerso,
      nomManuel,
      date:      maintenant,
      data:      snapshot,
    });
    this._ecrireBiblio(biblio);
    this._idCourant = nouvelId;
    return nouvelId;
  },

  /**
   * Charge un personnage de la bibliothèque dans l'état courant.
   * @param {number} id
   * @returns {boolean} true si chargé
   */
  chargerDepuisBiblio(id) {
    const biblio = this._lireBiblio();
    const entree = biblio.find(e => e.id === id);
    if (!entree) return false;
    // On reconstruit proprement à partir d'un état vierge (pour récupérer
    // d'éventuels champs absents d'une vieille sauvegarde)
    this.data = Object.assign(this._etatVierge(), JSON.parse(JSON.stringify(entree.data)));
    if (typeof SKILLS !== 'undefined') {
      SKILLS.forEach(s => {
        if (!(s.key in this.data.skills))      this.data.skills[s.key] = 2;
        if (!(s.key in this.data.specialties)) this.data.specialties[s.key] = {};
      });
    }
    this._idCourant = id;
    this.notify();
    return true;
  },

  /**
   * Supprime une entrée de la bibliothèque.
   */
  supprimerDeBiblio(id) {
    const biblio = this._lireBiblio().filter(e => e.id !== id);
    this._ecrireBiblio(biblio);
    if (this._idCourant === id) this._idCourant = null;
  },

  /**
   * Renomme une entrée sans changer ses données.
   * Pose le flag `nomManuel: true` pour que ce nom ne soit plus écrasé
   * automatiquement par data.nom lors des sauvegardes suivantes.
   */
  renommerDansBiblio(id, nouveauNom) {
    const biblio = this._lireBiblio();
    const entree = biblio.find(e => e.id === id);
    if (!entree) return false;
    entree.nom = nouveauNom || entree.nom;
    entree.nomManuel = true;
    entree.date = new Date().toISOString();
    this._ecrireBiblio(biblio);
    return true;
  },

  /**
   * Duplique une entrée existante (copie avec nouvel id).
   */
  dupliquerDansBiblio(id) {
    const biblio = this._lireBiblio();
    const original = biblio.find(e => e.id === id);
    if (!original) return null;
    const nouvelId = Date.now();
    biblio.push({
      id:   nouvelId,
      nom:  original.nom + ' (copie)',
      date: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(original.data)),
    });
    this._ecrireBiblio(biblio);
    return nouvelId;
  },

  /**
   * Démarre un nouveau personnage vierge SANS toucher à la bibliothèque.
   * Utilisé par le bouton "Nouveau".
   */
  nouveauPersonnage() {
    this.init();
    this._idCourant = null;
    this.notify();
  },

  /**
   * @returns {number|null} L'id de l'entrée biblio actuellement chargée
   */
  getIdCourant() {
    return this._idCourant;
  },

  // -----------------------------------------------------------
  // Export / Import global (toute la bibliothèque dans un fichier)
  // -----------------------------------------------------------
  /**
   * Exporte toute la bibliothèque + le perso courant dans un objet sérialisable.
   * Format versionné pour pouvoir évoluer plus tard sans casser les anciennes sauvegardes.
   */
  exporterBiblio() {
    return JSON.stringify({
      version:      1,
      exported_at:  new Date().toISOString(),
      personnages:  this._lireBiblio(),
    }, null, 2);
  },

  /**
   * Importe une sauvegarde complète. Par défaut, FUSIONNE avec la biblio existante
   * (les nouveaux ids sont régénérés pour éviter les collisions).
   * @param {string} json Le contenu du fichier importé
   * @param {boolean} remplacer Si true, écrase la biblio existante au lieu de fusionner
   * @returns {{ok: boolean, ajoutes: number, message: string}}
   */
  importerBiblio(json, remplacer = false) {
    try {
      const obj = JSON.parse(json);
      if (!obj || !Array.isArray(obj.personnages)) {
        return { ok: false, ajoutes: 0, message: 'Fichier invalide : champ "personnages" manquant.' };
      }
      const biblio = remplacer ? [] : this._lireBiblio();
      let ajoutes = 0;
      // On régénère les ids pour éviter les collisions avec la biblio existante
      let baseId = Date.now();
      obj.personnages.forEach(p => {
        if (!p || typeof p !== 'object' || !p.data) return;
        biblio.push({
          id:   baseId++,
          nom:  p.nom || 'Sans nom',
          date: p.date || new Date().toISOString(),
          data: p.data,
        });
        ajoutes++;
      });
      this._ecrireBiblio(biblio);
      return { ok: true, ajoutes, message: `${ajoutes} personnage(s) importé(s).` };
    } catch (e) {
      return { ok: false, ajoutes: 0, message: 'JSON invalide : ' + e.message };
    }
  },

};

// Vérification au chargement
(function verifierIntegriteState() {
  const methodesAttendues = ['init', 'subscribe', 'notify', 'set', 'setSkill',
    'setSpecialty', 'setArmure', 'setBouclier', 'ajouterArme', 'retirerArme',
    'toggleAvantage', 'toggleDefaut', 'reset', 'charger', 'exporter', 'importer'];
  methodesAttendues.forEach(m => {
    if (typeof State[m] !== 'function') {
      console.warn(`[state.js] Méthode "${m}" manquante.`);
    }
  });
  console.log('[state.js] Module State chargé.');
})();
