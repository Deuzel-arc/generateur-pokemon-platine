# État de l'extraction des ROMs

Dernière mise à jour : 2026-10-20

## Versions suivies

- Pokémon Platine original (FR) — code CPUF — SHA-256 `c589cc9c80edc7d735500650104ceb229ed37b24e041d2156bb2a0645a93562a`
- Pokémon Platine multijoueur (Project PM) — code CPUE — SHA-256 `78b95905031e0524942ac079afe2d444a6bcfb47aae7a07106800c5591d970f7`

## Fichiers du dépôt

- `rom_overrides.json` : différences décodées consignées à ce jour.
- `berries_gen4.json` : données de baies de génération IV.
- Les rapports de certification dans `CERTIFICATION/` définissent les exigences de validation.

## État de complétude — ne pas confondre extraction binaire et décodage sémantique

| Domaine | État | Critère de fin |
|---|---|---|
| Inventaire des fichiers internes | Inventorié dans l'audit sauvegardé | Empreintes et chemins conservés |
| Données personnelles des espèces | Partiel | Toutes les espèces/formes, types, statistiques, talents, captures et autres champs décodés et comparés |
| Capacités | Partiel | Table entière décodée : type, catégorie Gen IV, puissance, précision, PP, priorité, cible, effets et drapeaux |
| Apprentissages | Non exhaustif | Tous les learnsets, CT/CS, reproduction, tuteurs et méthodes spécifiques aux deux ROMs |
| Évolutions | Non exhaustif | Espèce source, méthode, niveau/objet/condition et cible |
| Objets et baies | Partiel | Toutes les entrées, effets, paramètres et noms reliés aux identifiants |
| Rencontres sauvages | Non exhaustif | Toutes les zones, slots, taux, niveaux et variations |
| Dresseurs et combats | Non exhaustif | Équipes, niveaux, objets, capacités et scripts utiles |
| Types et règles de combat | Partiel | Tableau d'efficacité et chaque différence de mécanique confirmés |
| Ressources graphiques, audio et scripts | Inventaire/différences, non décodé sémantiquement | Classer les différences et documenter leur impact éventuel |
| Intégration au générateur | Partielle | Chargement validé par profil, aucune donnée inconnue certifiée, tests de non-régression |

## Règles de provenance

- Une différence binaire n'est pas automatiquement une différence de gameplay : elle doit être décodée avec le bon format et les bons identifiants.
- Une entrée non décodée doit rester `unknown` / `unverified`, jamais être devinée.
- Les données de Platine original et de Project PM restent séparées.
- Les données confirmées par l'utilisateur mais non décodées depuis la ROM doivent porter une provenance distincte.
- Les fichiers de ROM eux-mêmes ne sont pas distribués dans ce dépôt ; seuls les métadonnées, résultats transformés et différences nécessaires sont conservés.

## Prochaine tranche de travail

Décoder intégralement les tables de données personnelles et de capacités, puis les tables d'apprentissage et d'évolution. Ne pas annoncer l'exhaustivité tant que des compteurs de couverture et des tests de correspondance d'identifiants n'ont pas été ajoutés.
