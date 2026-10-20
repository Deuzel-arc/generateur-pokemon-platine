# État du décodage des ROMs — mise à jour 2026-10-20

## Versions examinées

Les deux archives fournies dans la conversation ont été extraites et relues localement. Codes internes vérifiés : CPUF (original) et CPUE (Project PM), taille 134 217 728 octets chacune.

| Profil | SHA-256 calculé sur le fichier .nds extrait |
|---|---|
| Platine original | `1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8` |
| Project PM | `435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1` |

**Important :** ces empreintes ne correspondent pas aux empreintes consignées dans l'audit antérieur. Les résultats d'extraction présents ici se rapportent aux octets des fichiers `.nds` extraits des ZIP actuellement joints. Ne pas fusionner automatiquement les deux séries d'empreintes.

## Extraction réellement effectuée

Pour chaque ROM : système de fichiers NitroFS parcouru, archives NARC reconnues et indexées, données principales transformées en JSON. La base complète exportée est conservée dans la bibliothèque ChatGPT sous `/Audit_ROM_Pokemon_Platine/rom_battle_database.json`; l'archive des tables séparées est `rom_decoded_core_tables.zip`.

| Table | Original | Project PM | Niveau de décodage |
|---|---:|---:|---|
| Entrées espèces | 508 | 509 | Statistiques, types, taux de capture, EV, objets tenus, groupes d'œufs, talents, croissance et bits CT/CS décodés |
| Capacités | 471 | 472 | Identifiants, effet, catégorie, puissance, type, précision, PP, cible, priorité, drapeaux |
| Apprentissages par niveau | 508 | 509 | Niveaux et identifiants d'attaques décodés |
| Évolutions | 508 | 509 | Champs méthode/paramètre/cible extraits; interprétation des méthodes encore à certifier |
| Objets | 446 | 470 | Champs bruts conservés; sémantique des effets pas encore certifiée |
| Baies | 64 | 64 | Entrées brutes conservées; liaison complète aux noms/effets à terminer |
| Archives de rencontres | 183 | 187 | Entrées brutes conservées, pas encore entièrement décodées en zones/slots |
| Données dresseurs | 928 | 973 | Entrées brutes conservées, structure à décoder |
| Pokémon des dresseurs | 928 | 1945 | Entrées brutes conservées, structure à décoder |

## Limites et anomalies à résoudre

- Ce n'est **pas** encore un décodage exhaustif de tous les scripts, textes, événements, cartes, graphismes et sons.
- Les données d'objets, rencontres et dresseurs sont présentes mais ne doivent pas être traitées comme sémantiquement certifiées.
- Un conflit doit être résolu avant d'intégrer le type secondaire de Dracaufeu de Project PM : l'override vérifié enregistré auparavant indique Ténèbres, tandis que l'extraction directe des octets de l'archive personnelle de la ROM jointe décode l'ID de type 16 en Dragon selon la table de types employée. Les deux empreintes de ROM ne concordent pas non plus avec l'audit précédent. Ne pas remplacer l'override actif avant réconciliation de la version exacte et du mapping des types.
- La base extraite n'est pas encore chargée dynamiquement par la page GitHub Pages. Le roster stratégique de `index.html` reste partiel; les données brutes extraites ne signifient pas que l'algorithme les exploite déjà.

## Prochaines étapes

1. Réconcilier les empreintes et les versions exactes des ROM.
2. Valider les identifiants des types, talents et méthodes d'évolution contre les structures Gen IV.
3. Décoder sémantiquement objets, baies, rencontres et équipes de dresseurs.
4. Produire un catalogue espèce/attaque/objet normalisé pour le navigateur.
5. Intégrer ce catalogue au générateur avec tests automatisés sur les deux profils.
6. Vérifier l'interface et les tests statiques/navigateur après chaque changement.