# Audit de cohérence des révisions de référence ItemData — 2026-10-21

## But

Éviter de construire l'encodeur CPUF à partir de règles prises dans plusieurs révisions du dépôt canonique. Cet audit est une vérification de provenance; il ne certifie aucun octet reconstruit et ne fait pas progresser le pourcentage de l'étape 1 à lui seul.

## Comparaison reproductible des fichiers récupérés

Dépôt : `pret/pokeplatinum`.

| Fichier | Révision `06c6e9a0348da283be8d9225d0bec03c349ff5c2` | Révision `e038244ff792439e9200604736dc30eb38940bb3` | Résultat |
|---|---|---|---|
| `tools/dataproc/src/itemproc.c` | 17 314 caractères récupérés | 14 805 caractères récupérés | **Différent** |
| `include/item.h` | 8 905 caractères | 8 905 caractères | Identique |
| `include/constants/items.h` | 6 421 caractères | 6 421 caractères | Identique |
| `generated/item_hold_effects.txt` | 3 928 caractères | 3 928 caractères | Identique |
| `generated/pokemon_types.txt` | 224 caractères | 224 caractères | Identique |
| `res/items/data/potion.json` | 803 caractères | 803 caractères | Identique |
| `res/items/data/master_ball.json` | 810 caractères | 810 caractères | Identique |

Les comparaisons ont porté sur le contenu texte retourné par GitHub pour les chemins et SHA de révision indiqués. Les tailles égales sont corroborantes mais, à elles seules, ne prouvent pas l'identité; l'identité a été testée directement pour les six fichiers déclarés identiques.

## Conséquence

La spécification `CERTIFICATION/10-specification-encodeur-itemdata-cpuf-2026-10-21.md` citait la révision `e038244...` pour la logique du convertisseur, tandis que `data/gen4_item_id_reference.json` épingle `06c6e9a...` pour les symboles d'objets et les effets tenus. Les deux versions ne doivent pas être traitées comme une seule source cohérente tant que la logique du convertisseur n'est pas harmonisée.

Pour l'implémentation reproductible, utiliser une seule révision canonique épinglée pour `itemproc.c`, les définitions de structure, les tables d'énumération et les JSON d'objets. Le choix provisoire recommandé est `06c6e9a0348da283be8d9225d0bec03c349ff5c2`, car c'est la révision déjà inscrite dans la référence versionnée du dépôt. Avant la certification, vérifier que les 446 JSON sources correspondent bien à cette révision et documenter chaque exception.

## Statut et prochain contrôle

- Encodeur générique source JSON → 34 octets : **non implémenté**.
- Comparaison indépendante exhaustive des 446 objets CPUF : **non effectuée**.
- Certification Project PM/CPUE : **non effectuée**.
- Pourcentage de l'étape 1 : **35 %**, inchangé.
- Prochaine action : extraire la logique exacte de `proc_item` et `proc_params` de la révision épinglée, puis écrire l'encodeur avec tests unitaires ciblés avant de lancer la comparaison exhaustive.
