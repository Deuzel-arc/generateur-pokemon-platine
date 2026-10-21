# Vérification source → binaire de huit objets témoins CPUF

**Date :** 21 octobre 2026  
**Profil ROM :** Platine original, code CPUF  
**SHA-256 ROM associé à l'export :** `1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8`  
**Source canonique :** `pret/pokeplatinum`, commit épinglé `06c6e9a0348da283be8d9225d0bec03c349ff5c2`  
**Statut :** `partial_anchor_validation_only` — aucune certification exhaustive des 446 objets.

## Méthode

Les champs des fichiers JSON canoniques listés ci-dessous ont été relus, puis encodés indépendamment selon la structure `ItemData` de `include/item.h` et la logique `proc_item` / `proc_params` de `tools/dataproc/src/itemproc.c`. Les énumérations utilisées ont été vérifiées dans les fichiers générés canoniques, notamment `generated/items.txt`, `generated/item_hold_effects.txt`, et les constantes de poche / catégorie / fonction dans `include/constants/items.h`.

Pour chaque témoin, les 34 octets reconstruits ont été comparés à l'enregistrement brut de `pl_item_data.narc` conservé dans l'export ROM. La comparaison a porté sur la totalité de l'enregistrement, pas uniquement le prix. Le prototype indépendant a confirmé les huit égalités ci-dessous.

## Résultats

| ID logique | Objet canonique | Index d'archive | Fichier source | Octets reconstruits (hex) | Octets ROM (hex) | Résultat |
|---:|---|---:|---|---|---|---|
| 1 | `ITEM_MASTER_BALL` | 1 | `res/items/data/master_ball.json` | `00000000000000001f09000100000000000000000000000000000000000000000000` | `00000000000000001f09000100000000000000000000000000000000000000000000` | Identiques, 34/34 |
| 2 | `ITEM_ULTRA_BALL` | 2 | `res/items/data/ultra_ball.json` | `b0040000000000001f09000100000100000000000000000000000000000000000000` | `b0040000000000001f09000100000100000000000000000000000000000000000000` | Identiques, 34/34 |
| 17 | `ITEM_POTION` | 17 | `res/items/data/potion.json` | `2c01001400001e009f20010201000000000000040000000000000014000000000000` | `2c01001400001e009f20010201000000000000040000000000000014000000000000` | Identiques, 34/34 |
| 135 | `ITEM_ADAMANT_ORB` | 113 | `res/items/data/adamant_orb.json` | `1027031400003c001f00000000000000000000000000000000000000000000000000` | `1027031400003c001f00000000000000000000000000000000000000000000000000` | Identiques, 34/34 |
| 250 | `ITEM_DRAGON_FANG` | 228 | `res/items/data/dragon_fang.json` | `64005514000046001f00000000000000000000000000000000000000000000000000` | `64005514000046001f00000000000000000000000000000000000000000000000000` | Identiques, 34/34 |
| 300 | `ITEM_ZAP_PLATE` | 278 | `res/items/data/zap_plate.json` | `e803801400005a001f00000000000000000000000000000000000000000000000000` | `e803801400005a001f00000000000000000000000000000000000000000000000000` | Identiques, 34/34 |
| 350 | `ITEM_TM23` | 328 | `res/items/data/tm23.json` | `b80b0000000000009f01060000000000000000000000000000000000000000000000` | `b80b0000000000009f01060000000000000000000000000000000000000000000000` | Identiques, 34/34 |
| 467 | `ITEM_SECRET_KEY` | 445 | `res/items/data/secret_key.json` | `0000000000000000bf03000000000000000000000000000000000000000000000000` | `0000000000000000bf03000000000000000000000000000000000000000000000000` | Identiques, 34/34 |

**Bilan du lot témoin :** 8/8 enregistrements concordants, 272 octets sur 272 concordants, 0 différence observée.

## Ce que cette preuve établit

- La structure binaire de référence permet de reconstruire correctement ces huit cas témoins à partir des champs canoniques.
- Le calcul de l'index d'archive candidat fonctionne pour les ID situés avant, après et dans la zone qui suit les 22 IDs réservés.
- Les cas testés couvrent des objets simples, une Poké Ball avec index de sous-table, un objet de soin avec paramètres de partie, un objet tenu, une CT et un objet-clé.

## Limites et travaux encore requis

- Ce contrôle **ne couvre que 8 des 446 enregistrements CPUF**. Il ne remplace pas la reconstruction exhaustive de tous les champs et de tous les bitfields pour les 446 fichiers source.
- Le prototype a été exécuté comme vérification indépendante ciblée; il n'est pas encore un outil générique intégré au dépôt ni un test automatisé reproductible du projet.
- Il reste à gérer tous les cas spéciaux de `proc_item` et `proc_params`, y compris les paramètres complets des objets de partie, les baies, les cannes, le courrier et les CT/CS, puis à comparer les 446 enregistrements.
- Les 470 entrées CPUE doivent être auditées séparément. Les 446 premiers index diffèrent parfois de CPUF et les 24 entrées supplémentaires restent sans nom certifié; aucun nom ni effet ne doit leur être attribué par position.
- Une égalité binaire avec la source canonique ne certifie pas, à elle seule, le comportement de Project PM.

## Décision

Conserver le mapping complet des objets comme **candidat**. Ce lot améliore la preuve de cohérence du mapping, mais l'étape 1 reste ouverte. Aucune donnée d'objet ne doit être déclarée exhaustivement certifiée avant le comparateur source → binaire des 446 enregistrements CPUF et l'audit distinct CPUE.
