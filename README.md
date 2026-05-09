# Le Trône de Fer — Créateur de Personnage

Application web pour créer et gérer des fiches de personnage du jeu de rôle *Le Trône de Fer* (Green Ronin / Edge Studio), conformément aux règles officielles.

## Fonctionnalités

- **Éditeur complet** en 7 onglets : Identité, Compétences, Spécialités, Attributs (avantages/défauts), Équipement, Stats Dérivées, Fiche Finale
- **Calculs automatiques** : défense intrigue/combat, santé, sang-froid, lésions, blessures, déplacement
- **Bibliothèque de personnages** avec sauvegarde locale, renommage, duplication, export/import JSON
- **Fiche imprimable** prête pour PDF (Ctrl+P)

## Lancer en local

Aucune installation nécessaire — c'est une app statique HTML/CSS/JS.

1. Cloner le repo :
   ```bash
   git clone https://github.com/<user>/got-perso.git
   cd got-perso
   ```
2. Ouvrir `index.html` dans un navigateur moderne
   *(ou servir le dossier avec `python -m http.server 8000` puis aller sur http://localhost:8000)*

## Structure du projet

```
got-perso/
├── index.html              ← Point d'entrée de l'app
├── css/
│   └── style.css           ← Styles globaux + impression
├── js/
│   ├── calculs.js          ← Toutes les formules officielles (santé, défenses, etc.)
│   ├── state.js            ← État central + persistance localStorage + bibliothèque
│   ├── ui.js               ← Rendu DOM + listeners
│   └── main.js             ← Bootstrap + module Biblio (drawer, export/import)
└── data/
    ├── ages.js             ← Tranches d'âge et budgets XP/PS
    ├── armes.js            ← Table 9-3 : armes et caractéristiques
    ├── armures.js          ← Table 9-2 : armures (VA/Malus/Encombrement)
    ├── boucliers.js        ← Boucliers + bonus défensif
    ├── qualites.js         ← Qualités d'armes (Allonge, Puissante, etc.)
    ├── competences.js      ← 19 compétences + descriptions
    ├── avantages.js        ← Liste officielle des avantages
    ├── defauts.js          ← Liste officielle des défauts
    ├── concept.js          ← Tables aléatoires 3-3 à 3-7 (histoire, objectif, etc.)
    ├── lesions.js          ← Calcul des Max Lésions/Blessures
    └── deplacement.js      ← Table 9-1 : déplacement selon Athlétisme
```

## Stockage des personnages

Les personnages sauvegardés sont stockés dans le **localStorage du navigateur**. Conséquences :

- ✅ Aucun serveur, fonctionne hors ligne, gratuit
- ⚠️ Les données sont liées à ton navigateur. Vider le cache ou changer d'ordi = perte
- → Utilise **📤 Exporter tout** régulièrement pour avoir une sauvegarde sur ton disque

Pour partager une fiche avec un autre joueur : exporte ta bibliothèque, envoie-lui le `.json`, il l'importe dans la sienne.

## Crédits

- Règles : *A Song of Ice and Fire Roleplaying* © Green Ronin Publishing 2009 — édition française *Le Trône de Fer JdR* © Edge Studio
- Code : projet personnel, sans affiliation à l'éditeur

Cette application ne distribue **aucun contenu sous copyright** : il s'agit uniquement d'un outil pour faciliter la tenue d'une fiche de personnage. Le livre des règles n'est pas inclus.

## Licence

Code sous licence MIT (à voir : à confirmer avec l'auteur).
