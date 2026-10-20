# Lot 02 — Inventaire des objets de Pokémon Platine

**État : inventaire source établi, effets et disponibilité non certifiés ligne par ligne.**  
**Périmètre :** code de référence de Pokémon Platine (décompilation pret/pokeplatinum). Cela ne certifie pas les différences de Project PM.

## Sources primaires

- [Liste générée des identifiants d'objets](https://github.com/pret/pokeplatinum/blob/main/generated/items.txt)
- [Liste générée des effets d'objets tenus](https://github.com/pret/pokeplatinum/blob/main/generated/item_hold_effects.txt)
- [Format des données d'objets](https://github.com/pret/pokeplatinum/blob/main/docs/datafiles/items.md)
- [Structure des données d'objets](https://github.com/pret/pokeplatinum/blob/main/include/item.h)

## Contrôle structurel reproductible

Le contrôle a été effectué sur les fichiers source bruts du dépôt de décompilation, en comptant les identifiants par ligne.

| Fichier | Lignes/identifiants comptés | Interprétation |
|---|---:|---|
| `generated/items.txt` | 469 | Inclut `ITEM_NONE`, des identifiants réservés `ITEM_UNUSED_*` et un marqueur final ; ce nombre ne doit pas être présenté comme le nombre d'objets utilisables. |
| Identifiants `ITEM_UNUSED_*` | 22 | Entrées réservées/bogus à ne pas exposer comme objets utilisables sans preuve spécifique. |
| `generated/item_hold_effects.txt` | 147 | Inclut `HOLD_EFFECT_NONE`; la présence d'un effet dans l'énumération ne prouve pas que chaque objet l'utilise correctement. |
| Format documenté | 1 schéma de données | Distingue notamment effet tenu, paramètre d'effet, effet de Dégommage, puissance/type de Don Naturel, utilisation et poche. |

Le comptage porte sur les fichiers source à l'URL ci-dessus et peut évoluer si la branche amont change. Il ne constitue pas une comparaison directe avec une extraction binaire d'une ROM commerciale.

## Réconciliation des IDs canoniques avec les archives extraites — 2026-10-20

Le nouveau fichier versionné [`data/gen4_item_id_reference.json`](../data/gen4_item_id_reference.json) conserve les symboles canoniques d'objets et les symboles d'effets tenus depuis la référence épinglée `pret/pokeplatinum` au commit `06c6e9a0348da283be8d9225d0bec03c349ff5c2`.

Constats structurels :

- La liste canonique contient 468 IDs logiques, de 0 à 467, puis le marqueur `MAX_ITEMS` à l'ID sentinelle 468.
- Les 22 slots réservés sont précisément les IDs 113–134 (`ITEM_UNUSED_113` à `ITEM_UNUSED_134`).
- Il reste donc 446 IDs canoniques non réservés, ce qui correspond au nombre de membres de `pl_item_data.narc` extrait pour Platine original.
- Le profil Project PM contient 470 entrées dans cette archive, soit 24 entrées de plus que le compte canonique non réservé.
- L'archive distincte `item_data.narc` contient 442 entrées dans les deux exports. Elle ne doit pas être confondue avec `pl_item_data.narc`.

**Limite bloquante :** l'égalité entre 446 IDs non réservés et 446 membres d'archive est une concordance de compte, pas une preuve d'ordre. La décompilation utilise `sItemArchiveIDs[item].dataID` pour convertir l'ID logique en index d'archive. Tant que cette table de correspondance n'est pas reconstruite ou vérifiée pour la ROM exacte, aucune entrée extraite ne doit être associée à un nom par simple position. Les 24 entrées supplémentaires de Project PM restent non identifiées et ne sont pas transférées vers Platine original.

Le validateur `scripts/validate-rom-audits.mjs` vérifie désormais les bornes et le nombre de slots inutilisés, ainsi que l'interdiction de traiter cette concordance de compte comme une preuve de mapping.

## Mapping candidat des IDs vers l'archive — contrôle par ancres

Quatre points d'ancrage issus des entrées brutes CPUF soutiennent la règle candidate « ID logique moins le nombre de slots réservés antérieurs » :

| ID logique | Symbole canonique | Index archive candidat | Prix source = prix brut |
|---:|---|---:|---:|
| 17 | `ITEM_POTION` | 17 | 300 |
| 80 | `ITEM_SUN_STONE` | 80 | 2 100 |
| 100 | `ITEM_CLAW_FOSSIL` | 100 | 1 000 |
| 112 | `ITEM_GRISEOUS_ORB` | 112 | 10 000 |
| 135 | `ITEM_ADAMANT_ORB` | 113 | 10 000 |
| 150 | `ITEM_CHESTO_BERRY` | 128 | 20 |
| 200 | `ITEM_CHILAN_BERRY` | 178 | 20 |
| 250 | `ITEM_DRAGON_FANG` | 228 | 100 |
| 300 | `ITEM_ZAP_PLATE` | 278 | 1 000 |
| 350 | `ITEM_TM23` | 328 | 3 000 |
| 400 | `ITEM_TM73` | 378 | 2 000 |
| 445 | `ITEM_OLD_ROD` | 423 | 0 |
| 467 | `ITEM_SECRET_KEY` | 445 | 0 |

Ces treize ancres couvrent des zones éloignées de la table, y compris avant et après les slots réservés 113–134. Les tests automatisés verrouillent les treize correspondances et la séquence sans trous des 446 index candidats.

**Statut maintenu : mapping candidat étayé, pas encore certification exhaustive.** Les ancres de prix ne suffisent pas à prouver la correspondance de chaque champ de chaque entrée, ni à transférer ce mapping à Project PM. La vérification doit comparer les 446 entrées CPUF et identifier séparément les 24 entrées CPUE supplémentaires.

## Champs à vérifier pour chaque objet

Le schéma de données de la décompilation sépare explicitement les propriétés suivantes. L'audit du générateur devra les comparer individuellement, sans déduire une propriété à partir du nom ou de la description :

- identifiant interne et nom français officiel ;
- présence effective dans les données de Platine et catégorie fonctionnelle ;
- prix et restrictions de vente/lancement lorsqu'applicables ;
- effet tenu (`holdEffect`) et paramètre associé (`effectParam`) ;
- effet de Dégommage et puissance de Dégommage ;
- type et puissance de Don Naturel pour les baies ;
- usage sur le terrain et en combat ;
- CT/CS enseignée, le cas échéant ;
- différence entre présence dans les données, obtention normale, événement et accès par triche.

## Règles anti-erreur pour le générateur

1. Ne pas afficher les identifiants `ITEM_UNUSED_*` comme choix ordinaires.
2. Ne pas confondre un objet présent dans la ROM avec un objet tenu en combat.
3. Ne pas supposer qu'un objet est tenable simplement parce qu'il existe dans le sac.
4. Ne pas supposer que tous les objets de la base sont obtenables normalement ; l'option de triche toutes-les-baies/tous-les-objets relève d'une règle séparée.
5. Pour les équipes, imposer six objets tenus distincts, chacun vérifié comme objet tenable et avec son effet de génération IV.
6. Les objets ajoutés/modifiés par Project PM doivent porter un statut séparé jusqu'à vérification dans la version précise du mod.

## Tests requis pour fermer le lot

- [ ] Construire la liste canonique des objets réellement présents et utilisables dans Platine, en excluant les sentinelles et identifiants inutilisés.
- [ ] Récupérer chaque entrée `res/items/data/<nom>/data.json` et comparer ID, nom, paramètres et effets.
- [ ] Établir la table des 562 candidats éventuels du générateur contre la liste canonique ; tout candidat sans correspondance est bloqué.
- [ ] Vérifier chaque objet tenu recommandé : effet exact en 4G, condition de déclenchement, paramètre, compatibilité avec les combats doubles et absence de doublon d'objet dans une équipe.
- [ ] Vérifier les noms français à partir d'une source de localisation cohérente.
- [ ] Séparer les règles Platine et Project PM et consigner les tests reproductibles du mod.

## Conclusion

**LOT NON CERTIFIÉ INTÉGRALEMENT.** La structure de référence et les identifiants sont accessibles et le contrôle structurel est effectué. Il reste à lier chaque objet à ses données exactes et à vérifier les effets et noms un par un avant d'autoriser la base à alimenter le générateur.


## Comparaison binaire CPUF / CPUE — 2026-10-20

Le rapport [data/project_pm_item_archive_diff.json](../data/project_pm_item_archive_diff.json) consigne une comparaison des membres bruts de pl_item_data.narc extraits des deux ROMs identifiées par leurs empreintes SHA-256.

- Les deux archives partagent les index 0–445 : **281 entrées identiques octet par octet et 165 entrées différentes**.
- Project PM possède **24 entrées supplémentaires aux index 446–469**. Le rapport conserve l’empreinte SHA-256 de chaque entrée supplémentaire sans lui inventer de nom.
- Cette comparaison établit une différence binaire concrète entre les profils. Elle montre aussi qu’il serait incorrect d’hériter automatiquement les prix, paramètres ou effets de Platine original pour les index modifiés de Project PM.
- Elle ne certifie toujours pas le nom canonique de chaque index partagé et ne suffit pas à reconstruire toute la table ID logique → index. La table item_data.narc (442 membres) reste une archive distincte.

Le validateur automatisé contrôle les nombres, la liste des index modifiés, les 24 empreintes, et les règles interdisant l’attribution de noms par position ou l’héritage d’effets entre ROMs.


## Vérification de l'algorithme de correspondance dans la source — 2026-10-20

La lecture du fichier `tools/dataproc/src/itemproc.c` au commit épinglé `06c6e9a0348da283be8d9225d0bec03c349ff5c2` permet de préciser la règle de construction de `sItemArchiveIDs` : le programme parcourt les IDs dans l'ordre, exclut les noms `ITEM_UNUSED_*` via `has_data`, puis attribue un `dataID` séquentiel à chaque entrée dont le fichier de données est effectivement chargé. La fonction `add_idmap` enregistre séparément l'ID logique et cet index de données.

Cela **confirme l'algorithme du mapping candidat dans le code source de référence** et explique le décalage de 22 positions après les IDs réservés. Cela ne prouve pas à lui seul que les 446 entrées binaires CPUF correspondent à tous les champs de cette source, et encore moins que les effets de Project PM sont identiques. Les 13 ancres de prix concordantes renforcent la cohérence du mapping; la comparaison exhaustive des 446 enregistrements reste nécessaire.


## Localisation des différences binaires dans les entrées d'objets — 2026-10-20

Une analyse octet par octet des 446 index partagés CPUF/CPUE a été ajoutée dans `data/project_pm_item_archive_diff.json`, en utilisant comme référence de structure `include/item.h` au commit épinglé `06c6e9a0348da283be8d9225d0bec03c349ff5c2`.

- Les 165 entrées déjà identifiées comme différentes ont été localisées précisément.
- Les octets 0–1, qui correspondent au prix dans la structure de référence, diffèrent sur 148 entrées (octet faible) et 83 entrées (octet fort). Ces comptes se chevauchent; ils ne représentent pas 231 objets distincts.
- L'octet 3 (`effectParam` dans la structure de référence) diffère sur 6 entrées.
- L'octet 10 (`fieldUseFunc`) diffère sur 11 entrées; l'octet 12 (`partyUse`) et l'octet 15 du bloc union de paramètres diffèrent également sur ces 11 entrées.
- D'autres différences touchent six octets du bloc union de paramètres, sur six entrées supplémentaires.
- Aucun changement n'a été observé à l'octet 2, qui correspond à `holdEffect` dans la structure source épinglée.

**Limite d'interprétation :** les offsets sont établis sur la structure de référence de Platine. Ils permettent de localiser les changements bruts, mais ne certifient pas que Project PM conserve exactement la même sémantique pour chaque champ. Le rapport et le validateur gardent cette réserve explicite.


## Synthèse décodée par champ CPUF / CPUE — 2026-10-20

Le rapport complémentaire [data/project_pm_item_field_diff_summary.json](../data/project_pm_item_field_diff_summary.json) décode les 34 octets de chaque enregistrement avant de regrouper les différences par champs de la structure de référence. Cette étape évite de confondre les offsets en octets avec les caractères d'une représentation hexadécimale.

- Prix (u16 little-endian, octets 0–1) : 148 entrées changent de valeur.
- holdEffect (octet 2) : aucune différence brute observée.
- effectParam (octet 3) : 6 entrées diffèrent.
- fieldUseFunc (octet 10) : 11 entrées diffèrent.
- partyUse (octet 12) : 11 entrées diffèrent.
- Bloc union (octets 14–33) : 17 entrées diffèrent.
- Les autres champs listés dans le rapport n'ont pas de différences sur les 446 index communs.

Les comptes de champs peuvent se chevaucher et ne s'additionnent donc pas pour obtenir le nombre d'entrées différentes. Le validateur vérifie maintenant également ce rapport et ses nombres-clés. Les noms et la sémantique des 24 entrées supplémentaires CPUE restent inconnus jusqu'à validation indépendante.


## Profil brut des 24 entrées supplémentaires CPUE — 2026-10-20

Le rapport [data/project_pm_extra_item_patterns.json](../data/project_pm_extra_item_patterns.json) décrit les patrons des 24 entrées appendues aux index 446–469, sans leur attribuer de noms.

- Les index 448–465 forment un groupe de 18 enregistrements au prix brut de 2 000. Tous leurs octets sont identiques sauf l'octet 3, qui prend successivement les valeurs 0 à 17.
- Les six autres entrées (446, 447, 466, 467, 468 et 469) ont des patrons bruts distincts, dont une entrée presque entièrement nulle à l'index 467.
- Le calcul a été revérifié directement sur les 34 octets des enregistrements : taille, nombre d'entrées, valeurs séquentielles de l'octet 3 et égalité de tous les autres octets du groupe sont cohérents.

C'est un **classement structurel seulement** : l'octet 3 n'est pas interprété comme un nom ou un effet sans code source ou test indépendant du mod. Le validateur automatise désormais les contrôles de ce rapport.


## Décodage des champs binaires — référence source épinglée

Une relecture ciblée de `include/item.h`, `docs/datafiles/items.md` et `tools/dataproc/src/itemproc.c` au commit source `06c6e9a0348da283be8d9225d0bec03c349ff5c2` confirme le schéma de référence des enregistrements `ItemData` de 34 octets :

| Offset(s) | Champ de référence | Décodage / précaution |
|---:|---|---|
| 0–1 | `price` | entier non signé 16 bits, little-endian |
| 2 | `holdEffect` | identifiant d'effet tenu; enum du code source épinglé |
| 3 | `effectParam` | paramètre générique; sa signification dépend de l'objet |
| 4 | `pluckEffect` | effet de Piqûre / Larcin selon les mécaniques Gen IV |
| 5 | `flingEffect` | effet associé à Dégommage |
| 6 | `flingPower` | puissance de Dégommage |
| 7 | `naturalGiftPower` | puissance de Don Naturel |
| 8–9 | champs compactés | type de Don Naturel et drapeaux/poche; bits à décoder, pas deux octets indépendants |
| 10 | `fieldUseFunc` | fonction d'utilisation hors combat |
| 11 | `battleUseCategory` | catégorie d'utilisation en combat |
| 12 | `partyUse` | données/indicateurs d'utilisation sur l'équipe |
| 13 | `padding_0D` | octet de remplissage dans la structure de référence |
| 14–33 | union de paramètres | paramètres spécifiques; interprétation conditionnée par le champ d'utilisation |

Ce tableau décrit **la structure de référence CPUF**, pas une garantie automatique que chaque champ CPUE conserve la même signification. Le constructeur source remplit les archives depuis les JSON individuels `res/items/data/*.json` et crée séparément la correspondance ID logique → index de données. Cette distinction confirme qu'une comparaison complète doit examiner les champs sérialisés et la table de correspondance, pas seulement les prix ni le nombre d'entrées.

### Résultat de cette passe

- Le schéma binaire de référence a été recoupé avec la documentation de format et le code du constructeur au commit épinglé.
- Les treize ancres déjà enregistrées restent des contrôles de prix uniquement; elles ne sont pas requalifiées en validation de tous les champs.
- La prochaine étape de certification reste une comparaison exhaustive CPUF contre les 446 sources JSON correspondantes, puis une analyse séparée CPUE. Aucune entrée supplémentaire Project PM n'est nommée à partir de sa position ou de son motif brut.
