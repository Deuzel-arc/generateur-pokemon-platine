# Lot 01 — Baies (audit de certification)

**État du lot : PARTIEL — ne pas considérer les 64 baies comme certifiées.**  
**Cible :** Pokémon Platine original (4G). Project PM reste une cible distincte, non testée faute de ROM/version/hash et d'environnement d'exécution accessibles ici.

## Sources primaires consultées

- Décompilation de référence : [pret/pokeplatinum — battle_lib.c](https://github.com/pret/pokeplatinum/blob/main/src/battle/battle_lib.c)
- Liste des identifiants d'objets : [generated/items.txt](https://github.com/pret/pokeplatinum/blob/main/generated/items.txt)
- Schéma des données d'objets/baies : [docs/datafiles/items.md](https://github.com/pret/pokeplatinum/blob/main/docs/datafiles/items.md)

Les sources ci-dessus décrivent la base de code de Platine. Elles ne prouvent pas que Project PM utilise les mêmes scripts.

## Règles de preuve

- **Primaire — script/donnée source** : comportement explicitement visible dans la décompilation.
- **Secondaire — documentation** : nom/description recoupés dans des références publiques, sans preuve d'exécution.
- **À tester** : nécessite une exécution reproductible dans le jeu ou le mod.
- Une entrée de la base tactique n'est pas automatiquement une entrée certifiée. La base tactique actuelle contient un sous-ensemble, pas les 64 baies.

## Effets directement repérés dans les scripts de Platine

| Groupe / baie | Effet attendu en Platine | Éléments de script à contrôler | État |
|---|---|---|---|
| Baie Sitrus | Restaure 25 % des PV max lorsque les PV sont à la moitié ou moins | `HOLD_EFFECT_HP_PCT_RESTORE`, paramètre 25, seuil `curHP <= maxHP / 2` | Source primaire repérée |
| Baies Figuy, Wiki, Mago, Gowav et autres baies à saveur | Soin de 1/8 des PV max au seuil prévu, avec confusion possible selon l'affinité de nature/saveur | Effets `HOLD_EFFECT_HP_RESTORE_SPICY/DRY/SWEET/BITTER/SOUR`, paramètre 8, test d'affinité de saveur | Source primaire repérée ; tableau baie/nature à valider intégralement |
| Baies de statistiques en situation critique | Augmentent le stade d'une statistique quand le seuil est atteint ; l'effet précis varie selon la baie | Effets `HOLD_EFFECT_PINCH_*`, seuil usuel basé sur 1/4 ; vérifier chaque paramètre et exception | Source primaire repérée ; certification par baie incomplète |
| Baie Frista (Starf) | Augmente de deux crans une statistique de combat choisie aléatoirement si possible | `HOLD_EFFECT_PINCH_RANDOM_UP`, paramètre 4 | Source primaire repérée |
| Baie Micle | Améliore la précision de la prochaine capacité selon le script de l'effet | `HOLD_EFFECT_PINCH_ACC_UP`, paramètre 4 | Source primaire repérée |
| Baie Chérim (Custap) | Peut faire agir plus tôt lorsque les PV atteignent le seuil critique | `HOLD_EFFECT_PINCH_PRIORITY`, paramètre 4 | Source primaire repérée |
| Baie Enigma | Restaure 1/4 des PV max après une attaque super efficace, dans les conditions prévues par le script | `HOLD_EFFECT_HP_RESTORE_SE`, paramètre 4 | Source primaire repérée |
| Baie Jaboca | Inflige des dégâts en riposte à l'attaquant d'une attaque physique, selon le script | `HOLD_EFFECT_RECOIL_PHYSICAL`, paramètre 8 | Source primaire repérée |
| Baie Pommo (Rowap) | Inflige des dégâts en riposte à l'attaquant d'une attaque spéciale, selon le script | `HOLD_EFFECT_RECOIL_SPECIAL`, paramètre 8 | Source primaire repérée |
| Baie Oran | Restaure 10 PV | `HOLD_EFFECT_HP_RESTORE`, paramètre 10 | Donnée primaire repérée ; condition exacte à confirmer dans le script consommateur |
| Baie Mepo (Leppa) | Restaure 10 PP à une capacité | `HOLD_EFFECT_PP_RESTORE`, paramètre 10 | Donnée primaire repérée ; ciblage/condition à confirmer |
| Baie Prine (Lum) | Guérit un problème de statut et la confusion selon les règles de l'objet | `HOLD_EFFECT_STATUS_RESTORE` | Effet identifié ; scénarios complets à tester |
| Baie Kika (Persim) | Guérit la confusion | `HOLD_EFFECT_CONFUSE_RESTORE` | Effet identifié ; scénarios complets à tester |
| Baies de résistance (ex. Occa, Chilan) | Réduisent une attaque du type correspondant dans les conditions du script | `HOLD_EFFECT_WEAKEN_SE_FIRE`, `HOLD_EFFECT_WEAKEN_NORMAL` et variantes | Famille repérée ; tableau complet des types et paramètres à vérifier |

**Important :** « source primaire repérée » signifie que le mécanisme correspondant est présent dans la décompilation consultée. Ce n'est pas encore une certification exhaustive de tous les seuils, exceptions, noms français, numéros d'ID et conditions de consommation.

## Contrôles encore nécessaires pour clôturer le lot

- [ ] Établir la table canonique des 64 baies avec ID Platine, nom français et nom interne.
- [ ] Rattacher chaque baie à son entrée de données et son effet tenu/consommé.
- [ ] Vérifier toutes les puissances et tous les types de Don Naturel.
- [ ] Vérifier Dégommage, Croissance, récolte et données de culture lorsqu'applicables.
- [ ] Vérifier les effets par nature et saveur pour chacune des baies concernées.
- [ ] Vérifier seuils, exceptions, priorités de déclenchement et interaction avec Gloutonnerie.
- [ ] Séparer les baies présentes dans les données, obtenables normalement, événementielles et uniquement accessibles par modification.
- [ ] Tester les mêmes scénarios dans une version identifiée de Project PM ; consigner version/hash, procédure, résultat attendu et résultat observé.
- [ ] Vérifier que l'interface ne révèle pas les descriptions internes des effets de baies, conformément au cahier des charges.

## Statut de la base interne actuelle

`data/berries_gen4.json` est une base tactique partielle. Chaque entrée doit garder son statut individuel. Ne pas afficher les effets des baies dans l'interface. Ne pas transformer un statut « documentaire » ou « à tester » en « vérifié » sans preuve.

## Décision de certification

**LOT NON CERTIFIÉ INTÉGRALEMENT.** Plusieurs familles d'effets ont été repérées dans les sources primaires, mais le recensement complet des 64 baies et les tests Project PM restent ouverts.
