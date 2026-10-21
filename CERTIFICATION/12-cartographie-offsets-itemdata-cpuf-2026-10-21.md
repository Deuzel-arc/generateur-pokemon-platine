# Cartographie des offsets ItemData — CPUF — 2026-10-21

## Portée

Cette cartographie est dérivée de `include/item.h` et de `tools/dataproc/src/itemproc.c` au commit épinglé `06c6e9a0348da283be8d9225d0bec03c349ff5c2` de `pret/pokeplatinum`. Elle ne remplace pas une comparaison des octets reconstruits avec l'archive CPUF.

## Zones vérifiables sans supposer l'ordre des bitfields C

La structure `ItemData` déclare les champs suivants dans cet ordre source :

| Offset attendu | Taille | Champ | État |
|---:|---:|---|---|
| 0 | 2 | `price` | u16, ordre little-endian à confirmer sur témoin |
| 2 | 1 | `holdEffect` | enum u8 |
| 3 | 1 | `effectParam` | u8 |
| 4 | 1 | `pluckEffect` | enum u8 |
| 5 | 1 | `flingEffect` | enum u8 |
| 6 | 1 | `flingPower` | u8 |
| 7 | 1 | `naturalGiftPower` | u8 |
| 8–9 | 2 | bitfield u16 | champs : naturalGiftType(5), preventToss(1), canRegister(1), fieldPocket(4), battlePocket(5) ; disposition des bits à vérifier sur données |
| 10 | 1 | `fieldUseFunc` | enum u8 |
| 11 | 1 | `battleUseCategory` | enum u8 |
| 12 | 1 | `partyUse` | bool/u8 |
| 13 | 1 | `padding_0D` | remplissage |
| 14–33 | 20 | union `dummy` / `partyUseParam` | taille totale attendue de 34 octets ; contenu structuré non encore reconstruit indépendamment |

Les offsets 0–13 sont une cartographie structurelle attendue, pas une preuve de disposition compilée. L'alignement et le bitfield doivent être confirmés avec les octets réels. En particulier, il ne faut pas déduire l'ordre des bits du seul ordre des membres C.

## Règles de conversion confirmées dans `proc_item`

- `naturalGiftType == null` est converti en valeur `0x1F` dans le champ de 5 bits.
- `fieldUseFunc == ITEM_USE_FUNC_NONE` : les objets de poche Ball utilisent un compteur `dummy`; sinon `proc_params` est appelé.
- Les trois cannes à pêche utilisent un compteur `dummy`.
- Le courrier utilise un compteur `dummy` et produit une entrée de liste dédiée.
- Les CT/CS alimentent une table de correspondance de capacités, pas la structure party-param.
- Les pierres évolutives passent par `proc_params`, puis activent explicitement `evolve`.
- Les baies alimentent la liste des baies puis passent par `proc_params`.
- Les autres objets passent par `proc_params`.

## Règles de conversion confirmées dans `proc_params`

- `itemUseParams: null` laisse `partyUse` inactif ; un objet active `partyUse`.
- `ppRestored` est lu comme valeur signée 8 bits, puis masqué à 7 bits.
- `ppRestore` est dérivé de `ppRestored > 0 && !restorePPAllMoves`.
- `hpRestore` est dérivé de `hpRestored > 0`.
- Les indicateurs EV et amitié sont calculés à partir de valeurs non nulles.
- Les champs `atkStages`, `defStages`, `spatkStages`, `spdefStages`, `speedStages`, `accStages` utilisent 4 bits ; `critStages` utilise 2 bits.

## Tests nécessaires avant toute progression de certification

1. Produire des témoins indépendants à partir de JSON source et de la révision épinglée.
2. Vérifier les offsets 0–13 et les valeurs little-endian contre les témoins binaires.
3. Déterminer l'encodage réel des bitfields et de `ItemPartyParam` avec comparaison octet par octet.
4. Tester les cas spéciaux (Ball, canne, courrier, CT/CS, pierre évolutive, baie).
5. Comparer les 8 témoins, puis les 446 entrées CPUF.
6. Ne pas augmenter le pourcentage sur la base de cette seule cartographie.

## État

- Cartographie source des champs : documentée.
- Encodeur indépendant JSON source → 34 octets : non implémenté.
- Comparaison indépendante des 446 objets : non effectuée.
- Certification CPUE / Project PM : non effectuée.
- Étape 1 : 35 %, inchangé.
