// === Couche UI : rendu DOM + événements ===
//
// Lit l'état depuis State, rend le DOM, écoute les interactions
// et déclenche les mutateurs de State. Quand State notifie, on
// re-rend la section active.
//
// PAS de logique métier ici (calculs, règles) : elle vit dans
// js/calculs.js. PAS de stockage : c'est dans js/state.js.
//
// CONVENTION : un seul render() par section, idempotent.
// Les ids et catégories utilisés correspondent aux fichiers data/.

const UI = {

  // Onglet actuellement affiché
  _onglet: 'identite',

  // Filtres en cours sur la liste des avantages (par catégorie)
  _filtreAvantages: 'all',

  // -----------------------------------------------------------
  // INIT — appelé une fois au démarrage
  // -----------------------------------------------------------
  init() {
    this._populerSelectsStatiques();
    this._brancherEvenementsGlobaux();
    this.render();
  },

  // -----------------------------------------------------------
  // POPULATION DES SELECTS (une seule fois)
  // -----------------------------------------------------------
  _populerSelectsStatiques() {
    // Âge
    const selAge = document.getElementById('age');
    if (selAge && typeof AGES !== 'undefined') {
      selAge.innerHTML = '<option value="">— Choisir —</option>' +
        Object.entries(AGES).map(([k, a]) =>
          `<option value="${k}">${a.nom} (${a.age_libelle}) — ${a.xp} XP, ${a.pd} PD</option>`
        ).join('');
    }

    // Armures
    const selArm = document.getElementById('armure-select');
    if (selArm && typeof ARMURES !== 'undefined') {
      selArm.innerHTML = '<option value="">— Aucune armure —</option>' +
        ARMURES.map(a =>
          `<option value="${a.id}">${a.nom} (VA ${a.va}, Malus ${a.malus_armure}, Enc ${a.encombrement})</option>`
        ).join('');
    }

    // Boucliers
    const selBou = document.getElementById('bouclier-select');
    if (selBou && typeof BOUCLIERS !== 'undefined') {
      selBou.innerHTML = '<option value="">— Aucun bouclier —</option>' +
        BOUCLIERS.map(b =>
          `<option value="${b.id}">${b.nom} (Défensif +${b.bonus_defensif})</option>`
        ).join('');
    }

    // Armes (groupées par catégorie)
    const selArme = document.getElementById('arme-select');
    if (selArme && typeof ARMES !== 'undefined') {
      const cats = [...new Set(ARMES.map(a => a.categorie))];
      selArme.innerHTML = '<option value="">— Choisir une arme à ajouter —</option>' +
        cats.map(cat => {
          const armes = ARMES.filter(a => a.categorie === cat);
          return `<optgroup label="${cat}">` +
            armes.map(a => `<option value="${a.id}">${this._libelleArme(a)}</option>`).join('') +
            '</optgroup>';
        }).join('');
    }

    // Datalists pour les champs de concept (autocomplétion)
    if (typeof TABLES_CONCEPT !== 'undefined') {
      const peuplerDatalist = (id, table) => {
        const dl = document.getElementById(id);
        if (!dl) return;
        // Tri pour ordre alphabétique des suggestions
        const valeurs = [...new Set(Object.values(table))].sort((a, b) => a.localeCompare(b, 'fr'));
        dl.innerHTML = valeurs.map(v => `<option value="${v.replace(/"/g, '&quot;')}">`).join('');
      };
      peuplerDatalist('dl-histoire',   TABLES_CONCEPT.histoire);
      peuplerDatalist('dl-objectif',   TABLES_CONCEPT.objectif);
      peuplerDatalist('dl-motivation', TABLES_CONCEPT.motivation);
      peuplerDatalist('dl-vertu',      TABLES_CONCEPT.vertu);
      peuplerDatalist('dl-vice',       TABLES_CONCEPT.vice);
    }
  },

  _libelleArme(a) {
    const form = a.formation ? `${a.formation}B` : '—';
    return `${a.nom} — ${a.attribut_degats}${a.mod_degats >= 0 ? '+' : ''}${a.mod_degats} (Form. ${form})`;
  },

  // -----------------------------------------------------------
  // ÉVÉNEMENTS GLOBAUX
  // -----------------------------------------------------------
  _brancherEvenementsGlobaux() {
    // Onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showTab(btn.dataset.tab));
    });

    // Boutons "suivant" / "précédent"
    document.querySelectorAll('[data-goto-tab]').forEach(btn => {
      btn.addEventListener('click', () => this.showTab(btn.dataset.gotoTab));
    });

    // Champs d'identité (input/select/textarea)
    [
      'nom', 'maison', 'age', 'sexe', 'role', 'statut_depart',
      'histoire', 'objectif', 'motivation', 'vertu', 'vice', 'traits', 'allies',
      // Apparence physique
      'taille', 'poids', 'couleur_yeux', 'couleur_cheveux',
      // Détails personnage
      'habitudes', 'serviteurs', 'ennemis', 'serments',
      'armoiries', 'portrait', 'devises',
      'equipement_libre', 'blessures_notes',
    ].forEach(champ => {
      const el = document.getElementById(champ);
      if (!el) return;
      el.addEventListener('input',  () => State.set(champ, el.value));
      el.addEventListener('change', () => State.set(champ, el.value));
    });

    // Boutons 🎲 (tirage 2d6 dans une table de concept)
    document.querySelectorAll('.btn-roll').forEach(btn => {
      btn.addEventListener('click', () => {
        const champ = btn.dataset.roll;
        if (!champ || typeof tirerConcept !== 'function') return;
        const resultat = tirerConcept(champ);
        if (!resultat) return;
        const input = document.getElementById(champ);
        if (input) {
          input.value = resultat;
          State.set(champ, resultat);
          // Petit feedback visuel
          input.style.transition = 'background 0.4s';
          input.style.background = 'rgba(201, 168, 76, 0.3)';
          setTimeout(() => { input.style.background = ''; }, 600);
        }
      });
    });

    // Armure / Bouclier / Ajout d'arme
    const selArm = document.getElementById('armure-select');
    if (selArm) selArm.addEventListener('change', e => State.setArmure(e.target.value));
    const selBou = document.getElementById('bouclier-select');
    if (selBou) selBou.addEventListener('change', e => State.setBouclier(e.target.value));
    const btnAddArme = document.getElementById('add-arme-btn');
    if (btnAddArme) btnAddArme.addEventListener('click', () => {
      const sel = document.getElementById('arme-select');
      if (sel && sel.value) {
        State.ajouterArme(sel.value);
        sel.value = '';
      }
    });

    // Reset / Print
    const btnReset = document.getElementById('reset-btn');
    if (btnReset) btnReset.addEventListener('click', () => State.reset());
    const btnPrint = document.getElementById('print-btn');
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());
  },

  // -----------------------------------------------------------
  // NAVIGATION ENTRE ONGLETS
  // -----------------------------------------------------------
  showTab(name) {
    this._onglet = name;
    document.querySelectorAll('.tab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === name)
    );
    document.querySelectorAll('.section').forEach(s =>
      s.classList.toggle('active', s.id === `section-${name}`)
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  },

  // -----------------------------------------------------------
  // RENDU PRINCIPAL — dispatch selon l'onglet actif
  // -----------------------------------------------------------
  render() {
    this._renderIdentite();
    this._renderCompetences();
    this._renderSpecialites();
    this._renderAttributs();
    this._renderEquipement();
    this._renderDerivees();
    this._renderFiche();
  },

  // -----------------------------------------------------------
  // ONGLET IDENTITÉ
  // -----------------------------------------------------------
  _renderIdentite() {
    const d = State.data;
    [
      'nom', 'maison', 'age', 'sexe', 'role', 'statut_depart',
      'histoire', 'objectif', 'motivation', 'vertu', 'vice', 'traits', 'allies',
      'taille', 'poids', 'couleur_yeux', 'couleur_cheveux',
      'habitudes', 'serviteurs', 'ennemis', 'serments',
      'armoiries', 'portrait', 'devises',
      'equipement_libre', 'blessures_notes',
    ].forEach(champ => {
      const el = document.getElementById(champ);
      if (el && el.value !== (d[champ] || '')) el.value = d[champ] || '';
    });
  },

  // -----------------------------------------------------------
  // ONGLET COMPÉTENCES
  // -----------------------------------------------------------
  _renderCompetences() {
    const cont = document.getElementById('skills-grid');
    if (!cont) return;

    const ageData = AGES[State.data.age];
    const maxRang = ageData ? ageData.maxRank : 7;

    // En-tête de budget
    this._renderBudgetXP();

    cont.innerHTML = SKILLS.map(s => {
      const rang = State.data.skills[s.key] ?? 2;
      const cout = XP_COST[rang] ?? 0;
      const overMax = (s.key !== 'statut') && (rang > maxRang);
      // Bouton + désactivé si on est au max (Statut excepté)
      const disablePlus  = (s.key !== 'statut') && (rang >= maxRang);
      const disableMoins = rang <= 1;
      return `
        <div class="skill-row ${overMax ? 'over-max' : ''}" data-skill="${s.key}">
          <div class="skill-name">
            ${s.name}
            <span class="info-icon" title="Cliquer pour voir la description"
                  data-action="toggle-skill-desc" data-skill="${s.key}">i</span>
          </div>
          <div class="rank-control">
            <button class="rank-btn" data-action="skill-minus" data-skill="${s.key}" ${disableMoins ? 'disabled' : ''}>−</button>
            <div class="rank-display">${rang}</div>
            <button class="rank-btn" data-action="skill-plus" data-skill="${s.key}" ${disablePlus ? 'disabled' : ''}>+</button>
          </div>
          <div class="skill-cost">XP : <span>${cout}</span></div>
        </div>
      `;
    }).join('');

    // Délégation des clics
    cont.onclick = (ev) => {
      const t = ev.target;
      const action = t.dataset.action;
      const key = t.dataset.skill;
      if (!action || !key) return;
      if (action === 'skill-plus')  State.changerRangSkill(key, +1);
      if (action === 'skill-minus') State.changerRangSkill(key, -1);
      if (action === 'toggle-skill-desc') this._toggleSkillDescription(t, key);
    };
  },

  _toggleSkillDescription(iconEl, skillKey) {
    const row = iconEl.closest('.skill-row');
    if (!row) return;
    const existing = row.querySelector('.skill-description');
    if (existing) {
      existing.remove();
      row.classList.remove('expanded');
      return;
    }
    const skill = SKILLS.find(s => s.key === skillKey);
    if (!skill) return;
    const div = document.createElement('div');
    div.className = 'skill-description';
    const specs = skill.specs && skill.specs.length
      ? `<div style="margin-top:6px"><strong style="color:var(--gold-light); font-style:normal">Spécialités :</strong> ${skill.specs.join(', ')}</div>`
      : '';
    div.innerHTML = `${skill.description || '(pas de description disponible)'}${specs}`;
    row.appendChild(div);
    row.classList.add('expanded');
  },

  _renderBudgetXP() {
    const cont = document.getElementById('budget-xp-container');
    if (!cont) return;
    const data = State.data;
    if (!data.age) {
      cont.innerHTML = '<div class="info-box">Sélectionne d\'abord l\'âge dans l\'onglet Identité.</div>';
      return;
    }
    const total = budgetXP(data);
    const utilise = totalXPCompetences(data);
    const reste = total - utilise;
    const pct = Math.min(100, (utilise / total) * 100);
    const cls = reste < 0 ? 'over' : (reste < 10 ? 'warn' : 'ok');
    cont.innerHTML = `
      <div class="budget-bar">
        <span class="budget-label">XP Compétences</span>
        <span class="budget-value ${cls}">${utilise} / ${total}</span>
        <div class="budget-progress">
          <div class="budget-progress-bar ${reste < 0 ? 'over' : ''}" style="width: ${pct}%"></div>
        </div>
        <span class="budget-label">Reste : <span class="budget-value ${cls}">${reste}</span></span>
      </div>
    `;
  },

  // -----------------------------------------------------------
  // ONGLET SPÉCIALITÉS
  // -----------------------------------------------------------
  _renderSpecialites() {
    const cont = document.getElementById('specialites-container');
    if (!cont) return;

    // Budget
    this._renderBudgetSpecialites();

    cont.innerHTML = SKILLS
      .filter(s => s.specs && s.specs.length > 0)
      .map(s => {
        const rang = State.data.skills[s.key] ?? 2;
        const stateSpecs = State.data.specialties[s.key] || {};
        const pills = s.specs.map(name => {
          const rangB = stateSpecs[name] ?? 0;
          const active = rangB > 0;
          const moinsDispo = rangB > 0;
          const plusDispo  = rangB < rang;
          return `
            <div class="spec-pill ${active ? 'active' : ''}" data-skill="${s.key}" data-spec="${name}">
              <span class="spec-mod ${!moinsDispo ? 'disabled' : ''}" data-action="spec-minus">−</span>
              <span data-action="spec-toggle">${name}</span>
              <span class="spec-rank">${rangB}B</span>
              <span class="spec-mod ${!plusDispo ? 'disabled' : ''}" data-action="spec-plus">+</span>
            </div>
          `;
        }).join('');
        return `
          <div class="specialty-section">
            <div class="specialty-header">
              <span class="skill-label">${s.name}</span>
              <span class="skill-rang">Rang ${rang}</span>
            </div>
            <div class="specialty-list">${pills}</div>
          </div>
        `;
      }).join('');

    cont.onclick = (ev) => {
      const t = ev.target;
      const action = t.dataset.action;
      if (!action) return;
      const pill = t.closest('.spec-pill');
      if (!pill) return;
      const sk = pill.dataset.skill;
      const sp = pill.dataset.spec;
      if (action === 'spec-toggle')  State.toggleSpecialty(sk, sp);
      if (action === 'spec-plus')    State.changerRangSpecialty(sk, sp, +1);
      if (action === 'spec-minus')   State.changerRangSpecialty(sk, sp, -1);
    };
  },

  _renderBudgetSpecialites() {
    const cont = document.getElementById('budget-specs-container');
    if (!cont) return;
    const data = State.data;
    if (!data.age) {
      cont.innerHTML = '<div class="info-box">Sélectionne d\'abord l\'âge dans l\'onglet Identité.</div>';
      return;
    }
    const total = budgetXPSpecialites(data);
    const utilise = totalXPSpecialites(data);
    const reste = total - utilise;
    const pct = total > 0 ? Math.min(100, (utilise / total) * 100) : 0;
    const cls = reste < 0 ? 'over' : (reste < 10 ? 'warn' : 'ok');
    cont.innerHTML = `
      <div class="budget-bar">
        <span class="budget-label">XP Spécialités</span>
        <span class="budget-value ${cls}">${utilise} / ${total}</span>
        <div class="budget-progress">
          <div class="budget-progress-bar ${reste < 0 ? 'over' : ''}" style="width: ${pct}%"></div>
        </div>
        <span class="budget-label">Reste : <span class="budget-value ${cls}">${reste}</span></span>
      </div>
      <div class="info-box">Chaque dé bonus (+1B) coûte 10 XP. Une spécialité ne peut excéder le rang de sa compétence.</div>
    `;
  },

  // -----------------------------------------------------------
  // ONGLET ATTRIBUTS (Destinée + Avantages + Défauts)
  // -----------------------------------------------------------
  _renderAttributs() {
    this._renderBudgetPD();
    this._renderAvantages();
    this._renderDefauts();
  },

  _renderBudgetPD() {
    const cont = document.getElementById('budget-pd-container');
    if (!cont) return;
    const data = State.data;
    if (!data.age) {
      cont.innerHTML = '<div class="info-box">Sélectionne d\'abord l\'âge dans l\'onglet Identité pour débloquer les Points de Destinée.</div>';
      return;
    }
    const pd = budgetPD(data);
    const utilises = data.avantages.length;
    const gagnes   = data.defauts.length;
    const dispo    = pd + gagnes - utilises;
    const max      = nbMaxAvantages(data);
    const ageData  = AGES[data.age];
    cont.innerHTML = `
      <div class="form-grid-3">
        <div class="field">
          <label>PD de départ</label>
          <div style="font-family:'Cinzel',serif; font-size:1.8rem; color:var(--gold);">${pd}</div>
        </div>
        <div class="field">
          <label>PD disponibles</label>
          <div style="font-family:'Cinzel',serif; font-size:1.8rem; color:${dispo < 0 ? 'var(--error)' : 'var(--gold-light)'};">${dispo}</div>
        </div>
        <div class="field">
          <label>Avantages : ${utilises} / max ${max}</label>
          <div style="font-family:'Cinzel',serif; font-size:1.8rem; color:var(--text-dim);">${utilises}</div>
        </div>
      </div>
      <div class="info-box">
        Chaque avantage coûte <strong>1 PD</strong>. Chaque défaut volontaire <strong>rapporte 1 PD</strong>
        (jusqu'à concurrence de ${pd}). Limite d'âge : <strong>${max} avantages max</strong>${ageData?.nb_max_avantages === 0 ? ' (cet âge ne permet aucun avantage à la création)' : ''}.
      </div>
    `;
  },

  _renderAvantages() {
    const cont = document.getElementById('avantages-list');
    if (!cont || typeof AVANTAGES === 'undefined') return;

    // Filtres par catégorie
    const filtreEl = document.getElementById('avantages-filter');
    if (filtreEl && !filtreEl.dataset.bound) {
      filtreEl.dataset.bound = '1';
      filtreEl.onclick = (ev) => {
        const btn = ev.target.closest('button[data-cat]');
        if (!btn) return;
        this._filtreAvantages = btn.dataset.cat;
        this._renderAvantages();
      };
    }
    if (filtreEl) {
      filtreEl.querySelectorAll('button').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === this._filtreAvantages)
      );
    }

    const max = nbMaxAvantages(State.data);
    const dispoNombre = max - State.data.avantages.length;

    const liste = (this._filtreAvantages === 'all')
      ? AVANTAGES
      : AVANTAGES.filter(a => a.categorie === this._filtreAvantages);

    cont.innerHTML = liste.map(a => {
      const sel = State.data.avantages.includes(a.id);
      const conditionsOK = this._verifierConditionsAvantage(a);
      const peutPrendre = sel || (dispoNombre > 0 && conditionsOK);
      const cls = sel ? 'selected' : (peutPrendre ? '' : 'disabled');
      const condTip = !conditionsOK ? ' title="Conditions non remplies"' : '';
      return `
        <div class="attribute-pill ${cls}" data-id="${a.id}"${condTip}>
          <strong>${a.nom}</strong>
          <span class="pill-cat">${a.categorie}</span>
          <span class="info-icon" data-action="info-av" data-id="${a.id}">i</span>
        </div>
      `;
    }).join('') || '<div class="empty-state">Aucun avantage dans cette catégorie.</div>';

    cont.onclick = (ev) => {
      const t = ev.target;
      const pill = t.closest('.attribute-pill');
      if (!pill) return;
      if (t.dataset.action === 'info-av') {
        this._afficherDescription('avantage', t.dataset.id);
        return;
      }
      // Empêche de prendre si désactivé
      if (pill.classList.contains('disabled')) return;
      State.toggleAvantage(pill.dataset.id);
    };
  },

  _verifierConditionsAvantage(av) {
    return av.conditions.every(c => {
      if (c.type === 'competence') {
        return (State.data.skills[c.cle] ?? 2) >= c.rang_min;
      }
      if (c.type === 'competence_ou') {
        return c.alternatives.some(alt => (State.data.skills[alt.cle] ?? 2) >= alt.rang_min);
      }
      if (c.type === 'specialite') {
        const r = (State.data.specialties[c.competence] || {})[c.nom] ?? 0;
        return r >= c.rang_min;
      }
      if (c.type === 'avantage') {
        // nb_min permet d'exiger l'avantage pris N fois (cumulables seulement)
        return State.data.avantages.includes(c.id);
      }
      if (c.type === 'avantage_ou') {
        return c.ids.some(id => State.data.avantages.includes(id));
      }
      if (c.type === 'sexe') return this._sexeMatches(State.data.sexe, c.valeur);
      // 'narrateur' : autorisation MJ — on laisse passer (la règle s'applique en partie)
      return true;
    });
  },

  // Compare la valeur du select Sexe ('Homme' / 'Femme' / 'Autre')
  // à la valeur exigée par une condition ('masculin' / 'feminin').
  _sexeMatches(stateSexe, conditionValeur) {
    if (!stateSexe) return false;
    const s = stateSexe.toLowerCase();
    if (conditionValeur === 'masculin') return s === 'homme' || s === 'masculin';
    if (conditionValeur === 'feminin')  return s === 'femme' || s === 'feminin';
    return false;
  },

  _renderDefauts() {
    const cont = document.getElementById('defauts-list');
    if (!cont || typeof DEFAUTS === 'undefined') return;

    cont.innerHTML = DEFAUTS.map(d => {
      const sel = State.data.defauts.includes(d.id);
      // Vérification basique des conditions (sexe, âge)
      const conditionsOK = d.conditions.every(c => {
        if (c.type === 'sexe') return this._sexeMatches(State.data.sexe, c.valeur);
        if (c.type === 'age')  return c.ages.includes(State.data.age);
        return true;
      });
      const cls = sel ? 'selected' : (conditionsOK ? '' : 'disabled');
      const condTip = !conditionsOK ? ' title="Conditions non remplies"' : '';
      return `
        <div class="attribute-pill defaut-pill ${cls}" data-id="${d.id}"${condTip}>
          <strong>${d.nom}</strong>
          <span class="info-icon" data-action="info-def" data-id="${d.id}">i</span>
        </div>
      `;
    }).join('');

    cont.onclick = (ev) => {
      const t = ev.target;
      const pill = t.closest('.attribute-pill');
      if (!pill) return;
      if (t.dataset.action === 'info-def') {
        this._afficherDescription('defaut', t.dataset.id);
        return;
      }
      if (pill.classList.contains('disabled')) return;
      State.toggleDefaut(pill.dataset.id);
    };
  },

  _afficherDescription(type, id) {
    const cible = document.getElementById('description-zone');
    if (!cible) return;
    let item, titre, conditions = '';
    if (type === 'avantage') {
      item = AVANTAGES.find(a => a.id === id);
      if (!item) return;
      titre = `${item.nom} <span style="color:var(--text-dim); font-size:0.85em">[${item.categorie}]</span>`;
      conditions = this._libelleConditions(item.conditions);
    } else {
      item = DEFAUTS.find(d => d.id === id);
      if (!item) return;
      titre = `${item.nom} <span style="color:var(--text-dim); font-size:0.85em">[défaut, +${item.rapporte_pd} PD]</span>`;
      conditions = this._libelleConditions(item.conditions);
    }
    cible.innerHTML = `
      <div class="attribute-desc">
        <strong>${titre}</strong>
        ${conditions ? `<div style="font-size:0.82em; color:var(--text-mute); margin:4px 0">Conditions : ${conditions}</div>` : ''}
        <div style="margin-top:6px">${item.description}</div>
      </div>
    `;
  },

  _libelleConditions(conds) {
    if (!conds || !conds.length) return '';
    return conds.map(c => {
      if (c.type === 'competence')    return `${this._nomCompetence(c.cle)} ≥ ${c.rang_min}`;
      if (c.type === 'competence_ou') return c.alternatives.map(a => `${this._nomCompetence(a.cle)} ≥ ${a.rang_min}`).join(' OU ');
      if (c.type === 'specialite')    return `${this._nomCompetence(c.competence)} (${c.nom}) ≥ ${c.rang_min}B`;
      if (c.type === 'avantage')      return `Avantage : ${c.id}` + (c.nb_min ? ` (×${c.nb_min})` : '');
      if (c.type === 'avantage_ou')   return c.ids.map(id => `« ${id} »`).join(' OU ');
      if (c.type === 'sexe')          return `Sexe : ${c.valeur}`;
      if (c.type === 'age')           return `Âge : ${(c.ages || []).join(' / ')}`;
      if (c.type === 'narrateur')     return c.note || 'Autorisation du narrateur';
      return JSON.stringify(c);
    }).join(' ; ');
  },

  _nomCompetence(cle) {
    const s = SKILLS.find(s => s.key === cle);
    return s ? s.name : cle;
  },

  // -----------------------------------------------------------
  // ONGLET ÉQUIPEMENT
  // -----------------------------------------------------------
  _renderEquipement() {
    // Sync des selects
    const selArm = document.getElementById('armure-select');
    if (selArm && selArm.value !== (State.data.armure || '')) selArm.value = State.data.armure || '';
    const selBou = document.getElementById('bouclier-select');
    if (selBou && selBou.value !== (State.data.bouclier || '')) selBou.value = State.data.bouclier || '';

    // Stats armure
    const armure = ARMURES.find(a => a.id === State.data.armure);
    const va  = document.getElementById('va-val');
    const mal = document.getElementById('malus-val');
    const enc = document.getElementById('enc-val');
    if (va)  va.textContent  = armure ? armure.va : 0;
    if (mal) mal.textContent = armure ? armure.malus_armure : 0;
    if (enc) enc.textContent = armure ? armure.encombrement : 0;

    // Stats bouclier
    const bouclier = BOUCLIERS.find(b => b.id === State.data.bouclier);
    const bouStats = document.getElementById('bouclier-stats');
    if (bouStats) {
      if (bouclier) {
        const enc = bouclier.qualites.find(q => q.id === 'encombrante');
        bouStats.innerHTML = `
          <div class="stat-badge positive"><div class="stat-val">+${bouclier.bonus_defensif}</div><span class="stat-lbl">Bonus Défensif</span></div>
          ${enc ? `<div class="stat-badge negative"><div class="stat-val">${enc.valeur}</div><span class="stat-lbl">Encombrement</span></div>` : ''}
          ${bouclier.formation ? `<div class="stat-badge"><div class="stat-val">${bouclier.formation}B</div><span class="stat-lbl">Formation</span></div>` : ''}
        `;
      } else {
        bouStats.innerHTML = '';
      }
    }

    // Liste des armes équipées
    const liste = document.getElementById('weapons-list');
    if (liste) {
      if (State.data.armes.length === 0) {
        liste.innerHTML = '<div class="empty-state">Aucune arme équipée</div>';
      } else {
        liste.innerHTML = State.data.armes.map((id, idx) => {
          const a = ARMES.find(x => x.id === id);
          if (!a) return '';
          const qualites = a.qualites.map(q => {
            const def = QUALITES[q.id];
            const nom = def ? def.nom : q.id;
            return q.valeur !== undefined ? `${nom} ${q.valeur}` : nom;
          }).join(', ') || '—';
          const degats = calcDegatsArme(State.data, a);
          const formation = calcFormation(State.data, a);
          const malusFormation = formation.malus_des > 0
            ? ` <span class="penalty">−${formation.malus_des}D Formation</span>`
            : '';
          return `
            <div class="weapon-entry">
              <span class="w-name">${a.nom}</span>
              <span class="w-info">${qualites}${malusFormation}</span>
              <span class="w-dmg">${degats} dégâts</span>
              <button class="w-remove" data-idx="${idx}" title="Retirer">×</button>
            </div>
          `;
        }).join('');
      }
      liste.onclick = (ev) => {
        const t = ev.target.closest('.w-remove');
        if (t) State.retirerArme(parseInt(t.dataset.idx, 10));
      };
    }
  },

  // -----------------------------------------------------------
  // ONGLET STATS DÉRIVÉES
  // -----------------------------------------------------------
  _renderDerivees() {
    const cont = document.getElementById('derived-grid');
    if (!cont) return;
    const d = State.data;
    const cards = [
      { val: calcDefenseCombat(d),   nom: 'Défense de Combat', formula: 'Agi + Ath + Vig + bonus − malus' },
      { val: calcDefenseIntrigue(d), nom: 'Défense d\'Intrigue', formula: 'Vig + Ing + Stat' },
      { val: calcSangFroid(d),       nom: 'Sang-Froid',         formula: '3 × Volonté' },
      { val: calcSante(d),           nom: 'Santé',              formula: '3 × Endurance' },
      { val: calcMaxLesions(d),      nom: 'Max Lésions',        formula: 'Rang Endurance' },
      { val: calcMaxBlessures(d),    nom: 'Max Blessures',      formula: 'Rang Endurance' },
      { val: calcVA(d),              nom: 'Valeur d\'Armure',   formula: 'Selon armure' },
      { val: calcEncombrement(d),    nom: 'Encombrement',       formula: 'Armure + armes Enc.' },
      { val: calcDeplacement(d) + ' m', nom: 'Déplacement',     formula: 'Base 4m + Course − Enc.' },
      { val: calcSprint(d) + ' m',   nom: 'Sprint',             formula: 'Dépl. × 4 − Enc.' },
    ];
    cont.innerHTML = cards.map(c => `
      <div class="derived-card">
        <div class="d-val">${c.val}</div>
        <div class="d-name">${c.nom}</div>
        <div class="d-formula">${c.formula}</div>
      </div>
    `).join('');

    // Tableau d'attaques
    const att = document.getElementById('attack-summary');
    if (att) {
      if (State.data.armes.length === 0) {
        att.innerHTML = '<div class="empty-state">Aucune arme équipée — ajoute une arme dans l\'onglet Équipement.</div>';
      } else {
        att.innerHTML = `
          <table class="attack-table">
            <thead><tr><th>Arme</th><th>Test</th><th>Dégâts</th><th>Qualités</th></tr></thead>
            <tbody>
              ${State.data.armes.map(id => {
                const a = ARMES.find(x => x.id === id);
                if (!a) return '';
                const formation = calcFormation(State.data, a);
                const competence = this._nomCompetence(a.competence_test);
                const rang = State.data.skills[a.competence_test] ?? 2;
                const bonus = formation.bonus_disponibles;
                const malus = formation.malus_des;
                const testStr = `${competence} ${rang}` +
                  (bonus > 0 ? ` (+${bonus}B)` : '') +
                  (malus > 0 ? ` <span class="penalty">−${malus}D</span>` : '');
                const qualites = a.qualites.map(q => {
                  const def = QUALITES[q.id];
                  return q.valeur !== undefined ? `${def?.nom || q.id} ${q.valeur}` : (def?.nom || q.id);
                }).join(', ') || '—';
                return `<tr>
                  <td>${a.nom}</td>
                  <td>${testStr}</td>
                  <td>${calcDegatsArme(State.data, a)}</td>
                  <td style="font-size:0.78rem; color:var(--text-dim)">${qualites}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        `;
      }
    }
  },

  // -----------------------------------------------------------
  // ONGLET FICHE FINALE
  // -----------------------------------------------------------
  _renderFiche() {
    const cont = document.getElementById('sheet-preview');
    if (!cont) return;
    const d = State.data;
    if (!d.nom && !d.age) {
      cont.innerHTML = '<div class="empty-state">Remplis au moins le nom et l\'âge dans l\'onglet Identité pour voir la fiche.</div>';
      return;
    }

    const ageData  = AGES[d.age];
    const armure   = ARMURES.find(a => a.id === d.armure);
    const bouclier = BOUCLIERS.find(b => b.id === d.bouclier);
    const pd       = budgetPD(d);
    // PD restants = PD de départ + 1 par défaut volontaire − 1 par avantage acheté.
    // Plancher 0 pour ne pas afficher de nombre négatif (l'éditeur signale
    // déjà un budget dépassé côté onglet IV).
    const pdRestants = Math.max(0,
      pd + (d.defauts?.length || 0) - (d.avantages?.length || 0)
    );

    // ============== PAGE 1 ==============
    const page1 = `
      <div class="sheet-title">Le Trône de Fer — Fiche de Personnage</div>

      <div class="sheet-identity">
        ${this._sheetField('Nom', d.nom)}
        ${this._sheetField('Maison', d.maison)}
        ${this._sheetField('Âge', ageData ? `${ageData.nom} (${ageData.age_libelle})` : '—')}
        ${this._sheetField('Sexe', d.sexe)}
        ${this._sheetField('Rôle', d.role)}
        ${this._sheetField('Statut', d.skills.statut ?? 2)}
      </div>

      <div class="sheet-section-title">Compétences &amp; Spécialités</div>
      <div class="sheet-skills-grid">
        ${SKILLS.map(s => {
          const rang = d.skills[s.key] ?? 2;
          const specs = Object.entries(d.specialties[s.key] || {})
            .filter(([_, r]) => r > 0)
            .map(([n, r]) => `${n} ${r}B`)
            .join(', ');
          return `
            <div class="sheet-skill-row">
              <span class="ssl-rank">${rang}</span>
              <span class="ssl-name">${s.name}</span>
              <span class="ssl-specs">${specs}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display:grid; grid-template-columns: 2fr 3fr; gap:12px; margin-bottom:16px">
        <div>
          <div class="sheet-section-title">Intrigue</div>
          <div class="sheet-derived" style="grid-template-columns: repeat(2, 1fr); margin-bottom:0">
            ${this._sheetDerivedCard('Déf. Intrigue', calcDefenseIntrigue(d))}
            ${this._sheetDerivedCard('Sang-Froid',    calcSangFroid(d))}
          </div>
        </div>
        <div>
          <div class="sheet-section-title">Combat</div>
          <div class="sheet-derived" style="grid-template-columns: repeat(3, 1fr); margin-bottom:0">
            ${this._sheetDerivedCard('Déf. Combat',   calcDefenseCombat(d))}
            ${this._sheetDerivedCard('Santé',         calcSante(d))}
            ${this._sheetDerivedCard('VA',            calcVA(d))}
            ${this._sheetDerivedCard('Max Lésions',   calcMaxLesions(d))}
            ${this._sheetDerivedCard('Max Blessures', calcMaxBlessures(d))}
            ${this._sheetDerivedCard('Déplacement',   calcDeplacement(d) + ' m')}
          </div>
        </div>
      </div>

      <div class="sheet-section-title">Points de Destinée (restants : ${pdRestants} / ${pd})</div>
      <div style="display:flex; gap:6px; padding:6px 0; flex-wrap:wrap">
        ${[...Array(Math.max(8, pd, pdRestants))].map((_, i) => `
          <div style="width:18px; height:18px; border:2px solid #8b4030; border-radius:2px;
                      background:${i < pdRestants ? '#8b4030' : 'transparent'};
                      display:flex; align-items:center; justify-content:center;
                      color:#fff; font-size:13px; font-weight:bold; line-height:1">${i < pdRestants ? '✦' : ''}</div>
        `).join('')}
      </div>

      <div class="sheet-section-title">Suivi — Dégâts &amp; Blessures</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:12px">
        <div>
          <div style="font-size:0.7rem; letter-spacing:0.08em; color:#7a5a30; text-transform:uppercase; margin-bottom:4px">
            Dégâts (max ${calcSante(d)})
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; padding:4px; border:1px solid #c0a060; background:#fff">
            ${[...Array(calcSante(d))].map(() => `
              <div style="width:14px; height:14px; border:1.5px solid #3a1a08; border-radius:50%"></div>
            `).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:0.7rem; letter-spacing:0.08em; color:#7a5a30; text-transform:uppercase; margin-bottom:4px">
            Lésions (max ${calcMaxLesions(d)})
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; padding:4px; border:1px solid #c0a060; background:#fff">
            ${[...Array(calcMaxLesions(d))].map(() => `
              <div style="width:16px; height:16px; border:1.5px solid #3a1a08; border-radius:2px"></div>
            `).join('')}
          </div>
        </div>
        <div>
          <div style="font-size:0.7rem; letter-spacing:0.08em; color:#7a5a30; text-transform:uppercase; margin-bottom:4px">
            Blessures (max ${calcMaxBlessures(d)})
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; padding:4px; border:1px solid #c0a060; background:#fff">
            ${[...Array(calcMaxBlessures(d))].map(() => `
              <div style="width:16px; height:16px; border:2px solid #8b4030; border-radius:2px;
                          background:repeating-linear-gradient(45deg, transparent 0 3px, rgba(139,64,48,0.2) 3px 5px)"></div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="sheet-section-title">Armes</div>
      ${d.armes.length > 0 ? `
        <table class="sheet-weapons-table sheet-block">
          <thead><tr><th>Arme</th><th>Test</th><th>Dégâts</th></tr></thead>
          <tbody>
            ${d.armes.map(id => {
              const a = ARMES.find(x => x.id === id);
              if (!a) return '';
              const competence = this._nomCompetence(a.competence_test);
              const rang = d.skills[a.competence_test] ?? 2;
              return `<tr>
                <td><strong>${a.nom}</strong></td>
                <td>${competence} ${rang}${a.specialite_test ? ' (' + a.specialite_test + ')' : ''}</td>
                <td>${calcDegatsArme(d, a)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
        ${this._renderQualitesArmes(d)}
      ` : '<div style="font-style:italic; color:#7a5a30; padding:6px 0">Aucune arme équipée.</div>'}

      <div class="sheet-section-title">Armure &amp; Bouclier</div>
      ${(armure || bouclier) ? `
        <div style="font-size:0.92rem; line-height:1.7">
          ${armure ? `<div><strong>${armure.nom}</strong> — VA ${armure.va}, Malus ${armure.malus_armure}, Encombrement ${armure.encombrement}</div>` : ''}
          ${bouclier ? `<div><strong>${bouclier.nom}</strong> — Bonus défensif +${bouclier.bonus_defensif}${bouclier.formation ? ', Formation ' + bouclier.formation + 'B' : ''}</div>` : ''}
        </div>
      ` : '<div style="font-style:italic; color:#7a5a30; padding:6px 0">Aucune armure ni bouclier équipé.</div>'}
    `;

    // ============== PAGE 2 ==============
    const apparence = [d.taille, d.poids, d.couleur_yeux, d.couleur_cheveux].some(v => v);
    const liensExist = d.allies || d.ennemis || d.serments;
    const heraldExist = d.armoiries || d.portrait || d.devises;

    const page2 = `
      <div class="sheet-page-break"></div>

      <div class="sheet-section-title">Apparence</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; font-size:0.92rem">
        ${this._sheetField('Taille', d.taille)}
        ${this._sheetField('Poids', d.poids)}
        ${this._sheetField('Couleur des yeux', d.couleur_yeux)}
        ${this._sheetField('Couleur des cheveux', d.couleur_cheveux)}
      </div>
      ${d.portrait ? `<div style="margin-top:8px; font-size:0.92rem; line-height:1.5"><strong>Portrait :</strong> ${d.portrait}</div>` : ''}

      <div class="sheet-section-title">Traits Distinctifs &amp; Habitudes</div>
      <div style="font-size:0.92rem; line-height:1.6">
        ${d.traits    ? `<div><strong>Traits :</strong> ${d.traits}</div>`     : ''}
        ${d.habitudes ? `<div><strong>Habitudes :</strong> ${d.habitudes}</div>` : ''}
        ${(!d.traits && !d.habitudes) ? '<div style="font-style:italic; color:#7a5a30">— vide —</div>' : ''}
      </div>

      <div class="sheet-section-title">Serviteurs</div>
      <div style="font-size:0.92rem; line-height:1.6; min-height:40px">
        ${d.serviteurs || '<span style="font-style:italic; color:#7a5a30">— aucun —</span>'}
      </div>

      <div class="sheet-section-title">Équipement Supplémentaire</div>
      <div style="font-size:0.92rem; line-height:1.6; min-height:40px">
        ${d.equipement_libre || '<span style="font-style:italic; color:#7a5a30">— vide —</span>'}
      </div>

      <div class="sheet-section-title">Blessures</div>
      <div style="font-size:0.92rem; line-height:1.6; min-height:40px">
        ${d.blessures_notes || '<span style="font-style:italic; color:#7a5a30">— aucune —</span>'}
      </div>

      ${(d.histoire || d.objectif || d.motivation || d.vertu || d.vice) ? `
        <div class="sheet-section-title">Histoire Personnelle</div>
        <div style="font-size:0.92rem; line-height:1.7">
          ${d.histoire   ? `<div><strong>Histoire :</strong> ${d.histoire}</div>` : ''}
          ${d.objectif   ? `<div><strong>Objectif :</strong> ${d.objectif}</div>` : ''}
          ${d.motivation ? `<div><strong>Motivation :</strong> ${d.motivation}</div>` : ''}
          ${d.vertu      ? `<div><strong>Vertu :</strong> ${d.vertu}</div>` : ''}
          ${d.vice       ? `<div><strong>Vice :</strong> ${d.vice}</div>` : ''}
        </div>
      ` : ''}

      <div class="sheet-section-title">Liens — Alliés / Ennemis / Serments</div>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; font-size:0.9rem; line-height:1.5">
        <div><div style="font-weight:600; color:#7a5a30; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Alliés</div>${d.allies || '<span style="font-style:italic; color:#7a5a30">—</span>'}</div>
        <div><div style="font-weight:600; color:#7a5a30; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Ennemis</div>${d.ennemis || '<span style="font-style:italic; color:#7a5a30">—</span>'}</div>
        <div><div style="font-weight:600; color:#7a5a30; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Serments</div>${d.serments || '<span style="font-style:italic; color:#7a5a30">—</span>'}</div>
      </div>

      <div class="sheet-section-title">Maison — Armoiries / Portrait / Devise</div>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; font-size:0.9rem; line-height:1.5">
        <div><div style="font-weight:600; color:#7a5a30; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Armoiries</div>${d.armoiries || '<span style="font-style:italic; color:#7a5a30">—</span>'}</div>
        <div><div style="font-weight:600; color:#7a5a30; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Portrait</div>${d.portrait || '<span style="font-style:italic; color:#7a5a30">—</span>'}</div>
        <div><div style="font-weight:600; color:#7a5a30; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px">Devise</div>${d.devises || '<span style="font-style:italic; color:#7a5a30">—</span>'}</div>
      </div>

      ${d.avantages.length > 0 ? `
        <div class="sheet-section-title">Avantages</div>
        <ul class="sheet-avantages-list" style="padding-left:24px; line-height:1.55; font-size:0.92rem; list-style:none">
          ${d.avantages.map(id => {
            const a = AVANTAGES.find(x => x.id === id);
            if (!a) return '';
            return `
              <li style="margin-bottom:8px">
                <div><strong>${a.nom}</strong> <em style="color:#7a5a30; font-size:0.85em">[${a.categorie}]</em></div>
                <div style="color:#3a2010; font-size:0.88em; margin-top:2px">${a.description}</div>
              </li>
            `;
          }).join('')}
        </ul>
      ` : ''}

      ${d.defauts.length > 0 ? `
        <div class="sheet-section-title">Défauts</div>
        <ul class="sheet-defauts-list" style="padding-left:24px; line-height:1.55; font-size:0.92rem; list-style:none">
          ${d.defauts.map(id => {
            const x = DEFAUTS.find(y => y.id === id);
            if (!x) return '';
            return `
              <li style="margin-bottom:8px">
                <div><strong>${x.nom}</strong> <em style="color:#7a5a30; font-size:0.85em">[+${x.rapporte_pd} PD]</em></div>
                <div style="color:#3a2010; font-size:0.88em; margin-top:2px">${x.description}</div>
              </li>
            `;
          }).join('')}
        </ul>
      ` : ''}
    `;

    cont.innerHTML = page1 + page2;
  },

  // Détail des qualités d'armes : pour chaque qualité unique apparaissant
  // sur les armes équipées, on affiche son nom + sa description.
  _renderQualitesArmes(d) {
    if (!d.armes.length) return '';
    // Collecter les qualités uniques (avec valeur si paramétrée)
    const vues = new Map(); // cle = "id" ou "id:valeur" pour différencier
    d.armes.forEach(id => {
      const a = ARMES.find(x => x.id === id);
      if (!a) return;
      a.qualites.forEach(q => {
        const cle = q.valeur !== undefined ? `${q.id}:${q.valeur}` : q.id;
        if (!vues.has(cle)) {
          const def = QUALITES[q.id];
          if (def) vues.set(cle, { def, valeur: q.valeur });
        }
      });
    });
    if (vues.size === 0) return '';
    const items = [...vues.values()].map(({ def, valeur }) => {
      const titre = valeur !== undefined ? `${def.nom} ${valeur}` : def.nom;
      return `
        <li style="margin-bottom:6px">
          <strong>${titre}</strong>
          <div style="color:#3a2010; font-size:0.88em; margin-top:2px">${def.description}</div>
        </li>
      `;
    }).join('');
    return `
      <div style="margin-top:10px; padding-top:8px; border-top:1px dashed #c0a060">
        <div style="font-size:0.78rem; color:#7a5a30; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px">Qualités d'armes en jeu</div>
        <ul class="sheet-qualites-list" style="padding-left:18px; list-style:none; font-size:0.9rem; line-height:1.4">
          ${items}
        </ul>
      </div>
    `;
  },

  _sheetField(label, val) {
    return `
      <div class="sheet-field">
        <span class="sf-label">${label}</span>
        <span class="sf-val">${val || ' '}</span>
      </div>
    `;
  },

  _sheetDerivedCard(lbl, val) {
    return `
      <div class="sheet-derived-card">
        <div class="sdc-val">${val}</div>
        <div class="sdc-lbl">${lbl}</div>
      </div>
    `;
  },

};

(function verifierIntegriteUI() {
  if (typeof UI.init !== 'function') {
    console.error('[ui.js] UI.init() manquant.');
  } else {
    console.log('[ui.js] Module UI chargé.');
  }
})();
