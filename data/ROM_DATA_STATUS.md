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

## Vérification automatisée — 2026-10-20

- Le workflow `Generator checks` a réussi sur le commit `01006997e7e8ff83565f9f04c6b2e080479f0ef2`, après mise à jour des tests navigateur pour vérifier le profil à travers le résumé généré plutôt que via un élément d'interface supprimé.
- Les tests de provenance du manifeste et des overrides vérifiés passent également dans le workflow de ce commit.
- Les modifications ultérieures retirent un bonus de compatibilité d'objet fondé sur le type Ténèbres non réconcilié; le workflow correspondant a réussi pour le déploiement mais son job de tests a précédemment échoué sur l'ancien test navigateur. Le test navigateur a ensuite été corrigé et le workflow de commit `01006997e7e8ff83565f9f04c6b2e080479f0ef2` a passé les tests.
- Le commit `4c44c0dcb86d98b35dfa2e12d2e339324b347957` contient la suppression du bonus restant; une nouvelle exécution de tests de bout en bout sur le HEAD actuel est nécessaire avant de certifier l'état final.

## Avancement estimatif (non mesuré automatiquement)

- Décodage sémantique des deux ROM : 25 %.
- Enrichissement validé de la base : 28 %.
- Intégration réelle au générateur : 14 %.

Ces chiffres ne représentent pas la proportion de toutes les ressources internes décodées; ils expriment l'avancement du périmètre utile au générateur. Le catalogue reste partiellement décodé et n'est pas encore chargé dynamiquement par `index.html`.


## Intégration partielle des profils d'espèces — 2026-10-20

- Ajout de `data/rom_roster_profiles.json` : statistiques de base et types décodés pour les 70 espèces du roster actuel, avec overrides Project PM séparés.
- Les 70 profils sont intégrés au calcul du roster dans `index.html` : les types et les statistiques d'attaque/défense alimentent désormais le score selon le profil choisi.
- Le mapping des types de valeur 9 dans Project PM n'est pas certifié de façon globale. Les espèces dont le type décodé reste `Inconnu` gardent leur type de référence original, sauf Gardevoir et Togekiss dont le type Fée est confirmé par le contexte du hack. À ne pas présenter comme une table de types complètement validée.
- Empreintes des ROM actuellement utilisées par les exports : original `1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8`; Project PM `435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1`. Elles diffèrent des empreintes de l'ancien fichier d'overrides, qui doit être considéré comme un audit antérieur distinct jusqu'à réconciliation.
- Le catalogue complet des attaques et apprentissages n'est pas encore intégré au générateur; cette étape porte sur les profils de base du roster uniquement.
