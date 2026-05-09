// === Point d'entrée de l'application ===
//
// Orchestre le démarrage : initialise l'état, restaure une session
// éventuelle depuis localStorage, branche l'UI, lance le premier rendu.

(function bootstrap() {

  // Déclaration en avance pour que `start()` puisse référencer Biblio
  // même si le DOM est déjà chargé au moment où le script tourne.
  let Biblio; // sera défini en bas du fichier

  // L'événement DOMContentLoaded garantit que tous les éléments
  // existent dans le DOM avant que UI.init() les cherche.
  function start() {
    // 1. Vérifier que les modules attendus sont chargés
    if (typeof State === 'undefined' || typeof UI === 'undefined') {
      console.error('[main.js] State ou UI non chargés. Vérifie l\'ordre des <script> dans index.html.');
      return;
    }

    // 2. Initialiser l'état (par défaut : vierge)
    State.init();

    // 3. Tenter de restaurer une session précédente
    const restaure = State.charger();
    if (restaure) {
      console.log('[main.js] Personnage précédent restauré depuis localStorage.');
    }

    // 4. Initialiser l'interface (event listeners + premier rendu)
    UI.init();

    // 5. Brancher l'UI sur les notifications de State
    State.subscribe(() => UI.render());

    // 6. Brancher la bibliothèque de personnages (panneau coulissant + boutons)
    Biblio.init();

    console.log('[main.js] Application prête.');
  }


  // =============================================================
  // Module Biblio — gestion de la sauvegarde multi-personnages
  // =============================================================
  // Ce module branche tous les éléments UI liés à la bibliothèque :
  //  - les 3 boutons du header (Enregistrer, Bibliothèque, Nouveau)
  //  - le panneau coulissant (drawer) et son overlay
  //  - les actions par entrée (Charger / Renommer / Dupliquer / Supprimer)
  //  - l'export et l'import globaux
  //
  // Il s'appuie entièrement sur State.* pour la persistance — il ne
  // touche jamais directement à localStorage.
  Biblio = {

    // -----------------------------------------------------------
    // Initialisation : branche tous les listeners
    // -----------------------------------------------------------
    init() {
      // Boutons d'action header
      document.getElementById('btn-enregistrer').addEventListener('click', () => this.enregistrer());
      document.getElementById('btn-biblio').addEventListener('click',      () => this.ouvrir());
      document.getElementById('btn-nouveau').addEventListener('click',     () => this.nouveau());

      // Fermeture du drawer (croix + clic sur overlay)
      document.getElementById('drawer-close').addEventListener('click',   () => this.fermer());
      document.getElementById('drawer-overlay').addEventListener('click', () => this.fermer());

      // Boutons du footer du drawer
      document.getElementById('btn-exporter-tout').addEventListener('click', () => this.exporterTout());
      document.getElementById('btn-importer').addEventListener('click',      () => {
        document.getElementById('input-import').click(); // déclenche le sélecteur de fichier
      });
      document.getElementById('input-import').addEventListener('change', (e) => this.importerFichier(e));

      // Touche Échap : ferme le drawer s'il est ouvert (UX clavier)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const drawer = document.getElementById('drawer-biblio');
          if (drawer && !drawer.hidden) this.fermer();
        }
      });
    },

    // -----------------------------------------------------------
    // Bouton "Enregistrer" : sauve le perso courant dans la biblio
    // -----------------------------------------------------------
    // Si on a chargé un perso existant (idCourant non null) → mise à jour
    // silencieuse. Sinon → demande un nom (par défaut le champ "nom" du perso).
    enregistrer() {
      let nom;
      const idCourant = State.getIdCourant();

      if (idCourant !== null) {
        // Mise à jour silencieuse
        State.sauverDansBiblio(null); // null = garde le nom existant
        this._toast('💾 Personnage mis à jour dans la bibliothèque.');
      } else {
        // Nouvelle entrée : demande un nom
        const nomDefaut = State.data?.nom?.trim() || 'Sans nom';
        nom = prompt('Nom de la sauvegarde :', nomDefaut);
        if (nom === null) return; // utilisateur a annulé
        nom = nom.trim() || 'Sans nom';
        State.sauverDansBiblio(nom);
        this._toast(`💾 « ${nom} » ajouté à la bibliothèque.`);
      }

      this._rendreListe(); // rafraîchit le panneau s'il est ouvert
    },

    // -----------------------------------------------------------
    // Bouton "Nouveau" : remet l'éditeur à zéro sans toucher à la biblio
    // -----------------------------------------------------------
    nouveau() {
      // Confirmation pour éviter de perdre le travail en cours par erreur
      if (!confirm('Démarrer un nouveau personnage ? Le travail en cours sera perdu (sauf si déjà enregistré dans la bibliothèque).')) return;
      State.nouveauPersonnage();
      this._toast('✨ Nouveau personnage initialisé.');
    },

    // -----------------------------------------------------------
    // Ouverture / fermeture du drawer (avec animation)
    // -----------------------------------------------------------
    ouvrir() {
      const drawer  = document.getElementById('drawer-biblio');
      const overlay = document.getElementById('drawer-overlay');
      drawer.hidden = false;
      overlay.hidden = false;
      // Force un reflow pour que le navigateur enregistre l'état "fermé"
      // avant d'appliquer la classe is-open → la transition CSS se déclenche
      void drawer.offsetWidth;
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      this._rendreListe();
    },

    fermer() {
      const drawer  = document.getElementById('drawer-biblio');
      const overlay = document.getElementById('drawer-overlay');
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      // Re-cache après la durée de transition (cohérent avec le CSS : 280ms)
      setTimeout(() => {
        drawer.hidden = true;
        overlay.hidden = true;
      }, 300);
    },

    // -----------------------------------------------------------
    // Rendu de la liste des personnages dans le drawer
    // -----------------------------------------------------------
    _rendreListe() {
      const conteneur = document.getElementById('biblio-list');
      const empty     = document.getElementById('biblio-empty');
      const liste     = State.listerBiblio();

      // Vide le conteneur (on retire aussi les listeners attachés en délégation
      // car on remplace les enfants — pas de fuite mémoire)
      conteneur.innerHTML = '';

      if (liste.length === 0) {
        empty.hidden = false;
        return;
      }
      empty.hidden = true;

      // Tri : plus récent en premier
      liste.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const idCourant = State.getIdCourant();

      liste.forEach(p => {
        const item = document.createElement('div');
        item.className = 'biblio-item' + (p.id === idCourant ? ' is-current' : '');

        // Date lisible (jj/mm/aaaa hh:mm)
        const dateLisible = p.date
          ? new Date(p.date).toLocaleDateString('fr-FR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
          : '';

        item.innerHTML = `
          <h3 class="biblio-item-name"></h3>
          <div class="biblio-item-date">${dateLisible}${p.id === idCourant ? ' · <em>en cours</em>' : ''}</div>
          <div class="biblio-item-actions">
            <button class="btn btn-gold btn-sm" data-act="charger">📂 Charger</button>
            <button class="btn btn-gold btn-sm" data-act="renommer">✏️ Renommer</button>
            <button class="btn btn-gold btn-sm" data-act="dupliquer">📋 Dupliquer</button>
            <button class="btn btn-gold btn-sm" data-act="supprimer">🗑️ Supprimer</button>
          </div>
        `;
        // Sécurité XSS : on insère le nom en textContent (jamais en innerHTML)
        // pour éviter qu'un nom contenant <script> ne s'exécute.
        item.querySelector('.biblio-item-name').textContent = p.nom;

        // Délégation : un seul listener pour les 4 boutons
        item.querySelector('.biblio-item-actions').addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-act]');
          if (!btn) return;
          this._executerActionItem(btn.dataset.act, p);
        });

        conteneur.appendChild(item);
      });
    },

    /**
     * Exécute l'action choisie sur une entrée de la liste.
     * @param {string} action 'charger' | 'renommer' | 'dupliquer' | 'supprimer'
     * @param {object} p L'entrée { id, nom, date }
     */
    _executerActionItem(action, p) {
      switch (action) {
        case 'charger':
          State.chargerDepuisBiblio(p.id);
          this._toast(`📂 « ${p.nom} » chargé.`);
          this.fermer();
          break;
        case 'renommer': {
          const nouveau = prompt('Nouveau nom :', p.nom);
          if (nouveau !== null && nouveau.trim() !== '') {
            State.renommerDansBiblio(p.id, nouveau.trim());
            this._rendreListe();
          }
          break;
        }
        case 'dupliquer':
          State.dupliquerDansBiblio(p.id);
          this._rendreListe();
          this._toast(`📋 « ${p.nom} » dupliqué.`);
          break;
        case 'supprimer':
          if (confirm(`Supprimer définitivement « ${p.nom} » ?\nCette action est irréversible.`)) {
            State.supprimerDeBiblio(p.id);
            this._rendreListe();
            this._toast(`🗑️ « ${p.nom} » supprimé.`);
          }
          break;
      }
    },

    // -----------------------------------------------------------
    // Export global : un seul fichier JSON contenant toute la biblio
    // -----------------------------------------------------------
    exporterTout() {
      const json = State.exporterBiblio();
      // Nom de fichier horodaté pour distinguer plusieurs sauvegardes
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      this._telechargerFichier(`got-perso-biblio-${stamp}.json`, json);
      this._toast('📤 Bibliothèque téléchargée.');
    },

    // -----------------------------------------------------------
    // Import global : lit un fichier JSON et fusionne avec la biblio
    // -----------------------------------------------------------
    importerFichier(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Garde-fou taille : un fichier > 5 Mo n'est sûrement pas une biblio légitime
      if (file.size > 5 * 1024 * 1024) {
        alert('Fichier trop volumineux (> 5 Mo). Importation annulée.');
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const json = ev.target.result;
        // Stratégie : toujours FUSIONNER (plus sûr que remplacer).
        // L'utilisateur peut supprimer les doublons manuellement après coup.
        const result = State.importerBiblio(json, false);
        if (result.ok) {
          this._toast(`📥 ${result.message}`);
          this._rendreListe();
        } else {
          alert('❌ Import échoué : ' + result.message);
        }
        // Reset l'input pour permettre de réimporter le même fichier
        event.target.value = '';
      };
      reader.onerror = () => {
        alert('❌ Erreur de lecture du fichier.');
        event.target.value = '';
      };
      reader.readAsText(file);
    },

    // -----------------------------------------------------------
    // Utilitaire : télécharger un fichier texte côté navigateur
    // -----------------------------------------------------------
    _telechargerFichier(nom, contenu) {
      const blob = new Blob([contenu], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = nom;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Libère l'URL pour ne pas garder de référence en mémoire
      URL.revokeObjectURL(url);
    },

    // -----------------------------------------------------------
    // Mini "toast" de confirmation, en haut à droite.
    // Évite les alert() bloquants pour les actions réussies.
    // -----------------------------------------------------------
    _toast(message) {
      let toast = document.getElementById('biblio-toast');
      if (!toast) {
        // Création paresseuse au premier appel
        toast = document.createElement('div');
        toast.id = 'biblio-toast';
        Object.assign(toast.style, {
          position:    'fixed',
          top:         '20px',
          right:       '20px',
          background:  'rgba(20, 16, 10, 0.95)',
          color:       '#e8c97c',
          border:      '1px solid #c9a84c',
          borderRadius: '4px',
          padding:     '10px 16px',
          fontFamily:  "'EB Garamond', serif",
          fontSize:    '0.9rem',
          zIndex:      '1100',
          opacity:     '0',
          transition:  'opacity 200ms ease',
          pointerEvents: 'none',
          maxWidth:    '320px',
        });
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      // Reflow + opacity 1 pour fade-in
      void toast.offsetWidth;
      toast.style.opacity = '1';
      // Disparait après 2,5s
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
      }, 2500);
    },
  };

  // -----------------------------------------------------------
  // Lancement final : maintenant que Biblio est défini, on peut
  // démarrer l'app (start() appelle Biblio.init()).
  // -----------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
