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

| ID logique | Symbole canonique | Index archive candidat | Prix lu dans l'entrée brute |
|---:|---|---:|---:|
| 1 | `ITEM_MASTER_BALL` | 1 | 0 |
| 2 | `ITEM_ULTRA_BALL` | 2 | 1 200 |
| 135 | `ITEM_ADAMANT_ORB` | 113 | 10 000 |
| 136 | `ITEM_LUSTROUS_ORB` | 114 | 10 000 |

Ces ancres traversent la plage des IDs réservés 113–134 et sont cohérentes avec la table candidate de `data/gen4_item_id_reference.json`. Les tests automatisés verrouillent les quatre ancres et la séquence sans trous des 446 index candidats.

**Statut maintenu : mapping candidat étayé, pas encore certification exhaustive.** Les ancres ne suffisent pas à prouver la correspondance de chaque entrée, ni à transférer ce mapping à Project PM. La vérification doit comparer les 446 entrées CPUF et identifier séparément les 24 entrées CPUE supplémentaires.

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
