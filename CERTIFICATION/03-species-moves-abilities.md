# Lot 03 — Inventaires source : espèces, capacités et talents

**État : contrôle structurel effectué ; certification ligne par ligne incomplète.**  
**Référence :** décompilation de Pokémon Platine, génération IV. Project PM doit être comparé séparément.

## Sources primaires

- [Identifiants d'espèces](https://github.com/pret/pokeplatinum/blob/main/generated/species.txt)
- [Identifiants de capacités](https://github.com/pret/pokeplatinum/blob/main/generated/moves.txt)
- [Identifiants de talents](https://github.com/pret/pokeplatinum/blob/main/generated/abilities.txt)
- [Documentation des données de capacités](https://github.com/pret/pokeplatinum/blob/main/docs/datafiles/moves.md)
- [Décompilation complète](https://github.com/pret/pokeplatinum)

## Résultats du contrôle structurel

Les nombres ci-dessous proviennent d'un comptage des lignes des fichiers générés de la branche source consultée. Les marqueurs techniques ne sont pas des espèces/capacités/talents jouables.

| Domaine | Lignes source | Exclusions connues | Entrées principales attendues |
|---|---:|---|---:|
| Espèces | 496 | `SPECIES_NONE`, `SPECIES_EGG`, `SPECIES_BAD_EGG` | 493 espèces |
| Capacités | 469 | `MOVE_NONE`, marqueur terminal `MAX_MOVES` | 467 capacités listées dans cette table |
| Talents | 124 | `ABILITY_NONE` | 123 talents |

Ces totaux valident la structure générale des identifiants, pas l'exactitude des valeurs de chaque fiche. Le nombre d'entrées d'une table générée ne prouve pas à lui seul que le générateur possède la même liste ni qu'il affiche les bons noms français.

## Contrôles obligatoires des espèces

Pour chacune des 493 espèces :
- [ ] identifiant stable et nom français officiel ;
- [ ] formes distinctes et traitement des formes de Platine ;
- [ ] types de référence Platine et surcharge Project PM explicite ;
- [ ] six statistiques de base, poids/taille, taux de capture et sexe ;
- [ ] capacités spéciales, talents et compatibilité officielle ;
- [ ] méthode d'évolution et stade évolutif ;
- [ ] reproduction, groupe d'œufs, cycles et exceptions ;
- [ ] exclusion des entrées techniques et des espèces post-4G ;
- [ ] validation des modifications annoncées dans Project PM par comparaison directe.

## Contrôles obligatoires des capacités

Pour chacune des 467 entrées de capacité de la table :
- [ ] nom français et identifiant ;
- [ ] type et catégorie physique/spéciale/statut selon les règles de génération IV ;
- [ ] puissance, précision, PP, priorité et portée/cible ;
- [ ] effet primaire, taux d'effet secondaire et effets de terrain ;
- [ ] dégâts, arrondis, multi-coups, critiques et interactions en combat double ;
- [ ] restrictions de cible et interaction avec Abri/protection, immunités et talents ;
- [ ] statut d'existence en 4G et statut dans Project PM ;
- [ ] validation des capacités dites illégales : ne pas les étiqueter `[I]` sans preuve qu'elles ne sont accessibles par aucune méthode officielle à cette espèce en génération IV.

## Contrôles obligatoires des talents

Pour chacun des 123 talents :
- [ ] nom français officiel et identifiant ;
- [ ] effet exact en génération IV, y compris déclenchement et exceptions ;
- [ ] espèces qui peuvent officiellement l'avoir en 4G ;
- [ ] distinction entre talent normal, talent caché post-4G et modification propre au mod ;
- [ ] interdiction d'attribuer un talent à une espèce si aucune source ne confirme qu'elle le possède, même si PKHeX permet de l'écrire.

## Anomalies déjà signalées dans l'audit antérieur

Les valeurs suivantes ont été signalées comme suspectes dans une version de travail du générateur et doivent être comparées aux entrées de données sources exactes avant correction ou clôture :

- Surf : puissance de référence 95 ; une valeur 90 serait erronée.
- Hydrocanon : puissance de référence 120 ; une valeur 110 serait erronée.
- Blizzard : puissance de référence 120 ; une valeur 110 serait erronée.
- Balle Graine : puissance par frappe de référence 10 ; ne pas confondre avec le total variable des dégâts multi-coups.

Ces lignes constituent une liste d'anomalies candidates à revalider, pas une preuve que les fichiers du générateur actuel contiennent encore ces erreurs.

## Portes de validation avant intégration au moteur

1. Chaque fiche de données doit pointer vers une source primaire précise et un statut de preuve.
2. Les données canoniques de Platine doivent être conservées séparément des surcharges Project PM.
3. Les écarts doivent être explicites ; aucune valeur manquante ne doit être remplacée par une supposition.
4. Des tests automatisés doivent détecter les identifiants inconnus, doublons, statistiques manquantes, valeurs hors bornes et noms vides.
5. Les tests de combat doivent couvrir les interactions critiques et les cas de combat double, pas seulement les valeurs de fiche.

## Conclusion

**LOT NON CERTIFIÉ INTÉGRALEMENT.** Les trois inventaires source ont été comptés et leurs marqueurs techniques identifiés. La vérification des 493 espèces, 467 capacités et 123 talents, ainsi que la comparaison avec Project PM, reste à réaliser ligne par ligne.
