# Spécification de reconstruction indépendante de ItemData — CPUF

Date de vérification : 2026-10-21  
Branche de travail : `feature/moteur-hybride-simulation-apprentissage`

## Portée

Cette note fixe les règles à reproduire avant d'implémenter l'encodeur source JSON -> 34 octets. Elle ne constitue ni un encodeur, ni une certification binaire. Le pourcentage de l'étape 1 ne doit pas augmenter sur la seule base de cette note.

## Sources canoniques inspectées

Dépôt de référence : `pret/pokeplatinum`, commit observé `e038244ff792439e9200604736dc30eb38940bb3` (branche `main`, 2026-10-20).

- `include/item.h` : structure C `ItemData` et `ItemPartyParam`.
- `tools/dataproc/src/itemproc.c` : conversion des propriétés JSON en structure binaire, règles de paramètres et cas spéciaux.
- `include/constants/items.h` : constantes des poches, catégories, fonctions d'utilisation, effets de Fling et de Picore.
- `generated/item_hold_effects.txt` : ordre des valeurs d'enum `ItemHoldEffect`.
- `res/items/data/potion.json` et `res/items/data/master_ball.json` : exemples de données sources.

Note : le commit actuellement consulté est une référence reproductible, mais il ne remplace pas la référence historique déjà inscrite dans `data/gen4_item_id_reference.json`. Avant de certifier, il faudra confirmer que les fichiers source de la version utilisée sont identiques à la révision de référence ciblée.

## Structure et champs

`ItemData` a une taille attendue de 34 octets dans l'archive CPUF :

- prix (u16), effet tenu (u8), paramètre d'effet (u8) ;
- effets Picore et Dégommage, puissance Dégommage, puissance Don Naturel ;
- bitfield u16 : type Don Naturel (5 bits), empêcher jeter (1), enregistrable (1), poche principale (4), poche de combat (5) ;
- fonction d'utilisation hors combat, catégorie d'utilisation en combat, indicateur d'utilisation sur le Pokémon, octet de remplissage ;
- union d'un octet pour le cas simple ou structure `ItemPartyParam` de 20 octets.

Les bitfields C et leur ordre doivent être reproduits explicitement et validés sur la cible de compilation/source ; ne pas supposer qu'une disposition JavaScript/JSON correspond directement à la mémoire C.

## Règles source établies dans `ProcItem`

1. Les propriétés ordinaires sont converties avec les tables enum des poches, catégories, effets, fonctions d'utilisation, types et capacités.
2. Si `naturalGiftType` est nul, la valeur encodée est `0x1F` ; sinon le type est résolu puis tronqué à 5 bits.
3. `fieldUseFunc == ITEM_USE_FUNC_NONE` : les objets de la poche Ball reçoivent un index incrémental dans l'octet simple ; les autres passent par `ProcParams`.
4. Les cannes à pêche reçoivent un index incrémental dans l'octet simple.
5. Le courrier reçoit un index incrémental dans l'octet simple.
6. Les CT/CS incrémentent une table de correspondance des capacités ; ne pas en déduire qu'elles encodent des paramètres de soin.
7. Les pierres évolutives passent par `ProcParams`, puis forcent le bit `evolve`.
8. Les baies ajoutent une entrée aux données de baies, puis passent par `ProcParams`.
9. Les autres objets passent par `ProcParams`.

## Règles source établies dans `ProcParams`

- Un objet `itemUseParams` de type objet active `partyUse`; une valeur nulle laisse ce chemin inactif.
- Les booléens et champs numériques sont convertis individuellement dans `ItemPartyParam`.
- `ppRestore` est dérivé de `ppRestored > 0 && !ppRestoreAll`.
- `hpRestore` est dérivé de `hpRestored > 0`.
- Les indicateurs de gain d'EV sont dérivés de la valeur correspondante non nulle.
- Les indicateurs de modification d'amitié sont dérivés de la valeur correspondante non nulle.
- `ppRestored` est masqué à 7 bits après conversion signée, règle qui doit être testée précisément.
- Les champs d'étapes utilisent 4 bits, et les étapes de critique 2 bits.

## Tests obligatoires avant certification

1. Construire les tables d'enum à partir des fichiers canoniques, sans valeurs inventées ni correspondance approximative.
2. Encoder séparément les champs scalaires, le bitfield u16, l'union et `ItemPartyParam`, avec remplissage explicite.
3. Comparer les 34 octets reconstruits aux octets de l'archive pour les 8 témoins existants.
4. Si les 8 témoins passent, comparer exhaustivement les 446 entrées CPUF.
5. En cas de divergence, rapporter l'index, l'ID logique, le nom, l'offset d'octet, la valeur attendue et la valeur reconstruite ; ne pas corriger par exception silencieuse.
6. Exécuter les tests du dépôt et conserver séparément les résultats CPUF et CPUE. La certification CPUF ne vaut pas pour Project PM/CPUE.

## État à ce jour

- Cohérence interne des deux exports JSON CPUF : 446/446 enregistrements comparés.
- Témoins existants comparés à l'export sauvegardé : 8/8.
- Reconstruction indépendante JSON source -> binaire : **non implémentée**.
- Comparaison indépendante des 446 enregistrements : **non effectuée**.
- Certification CPUE : **non effectuée**.
- Statut de l'étape 1 : 35 %, inchangé.
