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
