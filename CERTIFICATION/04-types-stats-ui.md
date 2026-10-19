# Lot 04 — Matrice des types, statistiques et logique d'interface

**État : audit statique partiel.** Le moteur de combat complet et la ROM Project PM n'ont pas été exécutés. Les défauts d'interface ci-dessous sont observables dans le fichier `index.html` actuel et doivent être traités comme des anomalies de conformité.

## Sources de référence

- [Identifiants de types de Pokémon Platine](https://github.com/pret/pokeplatinum/blob/main/generated/pokemon_types.txt)
- [Identifiants des statistiques](https://github.com/pret/pokeplatinum/blob/main/generated/pokemon_stats.txt)
- [Constantes Pokémon et limites IV/EV](https://github.com/pret/pokeplatinum/blob/main/include/constants/pokemon.h)
- [Décompilation de Pokémon Platine](https://github.com/pret/pokeplatinum)

## 1. Contrôle structurel des types et statistiques

La table de types générée contient 18 types de base de Platine, suivis de `NUM_POKEMON_TYPES`. La table des statistiques contient PV, Attaque, Défense, Vitesse, Attaque Spéciale et Défense Spéciale, puis `STAT_MAX`.

Les constantes de Platine exposent notamment :
- IV maximum par statistique : 31 ;
- EV maximum par statistique : 255 ;
- plafond d'EV cumulé : 510 ;
- taille d'équipe : 6 Pokémon.

Cela fixe des bornes de validation utiles. La présence des 18 types de base ne représente pas les modifications de types de Project PM, qui doivent rester dans une couche d'override séparée.

## 2. Anomalies visibles dans l'interface actuelle

Source examinée : `index.html` sur la branche `main`.

| ID | Constat dans le code actuel | Risque | Correction requise |
|---|---|---|---|
| UI-01 | La section objets dit « Sélectionne de 0 à 3 objets » et le gestionnaire refuse une sélection au-delà de 3. | Contradiction avec la règle de configuration de l'équipe qui exige six objets tenus distincts. | Le modèle doit produire six objets tenus uniques pour les six Pokémon, ou expliciter une étape d'affectation qui garantit ces six objets. |
| UI-02 | Le catalogue d'objets est une liste codée en dur comprenant des objets dont la légalité, l'effet 4G ou le statut d'objet tenu n'est pas certifié dans le générateur. | Un objet incorrect ou non tenable peut être proposé à une équipe. | Ne proposer que des objets de la base canonique validée ; conserver un statut de preuve et une règle d'exclusion des candidats non vérifiés. |
| UI-03 | La note des capacités illégales dit que les réglages automatiques se repositionnent lors des déplacements du curseur de compétitivité « entre 0 et 20 % ». | Incohérence avec la règle fonctionnelle convenue : zone automatique 0–24 %. | Remplacer le seuil codé en dur par une constante unique partagée entre logique, libellés et tests : 0–24 inclus. |
| UI-04 | Le code de validation calcule le mode CI par `c < 25`, mais `ciSettingsResolved` vaut `c >= 25` sans vérifier que les réglages manuels ont réellement été explicitement résolus. | Une configuration peut être présentée comme résolue alors que la règle produit exige de bloquer la génération si les réglages automatiques/manuels ne le sont pas. | Implémenter un état explicite de résolution et bloquer la génération si la configuration n'est pas résolue. |
| UI-05 | Le résumé de validation annonce un aperçu fondé sur un catalogue embarqué et précise qu'il ne s'agit pas du moteur stratégique complet. | L'aperçu peut être pris pour une équipe certifiée, alors que les movesets, objets et règles sont incomplets. | Garder cet avertissement visible jusqu'à la connexion du moteur certifié ; ne pas présenter l'aperçu comme résultat final. |
| UI-06 | La fonction de sélection d'équipe choisit les espèces à partir de scores heuristiques et de tags embarqués, et ajoute un terme aléatoire. | La stratégie et la synergie sont approximatives, non calculées à partir des learnsets, rôles réels et interactions double combat. | Ne pas considérer cette sélection comme un générateur compétitif final. Brancher les données certifiées et un score de synergie vérifiable. |

## 3. Règles de calcul à vérifier

Pour chaque statistique et chaque calcul de combat :
- [ ] Formules niveau 100 avec IV, EV et nature ; plafonds et arrondis de génération IV.
- [ ] Distinction des statistiques physiques/spéciales par type en génération IV, et non par type d'une génération ultérieure.
- [ ] STAB, efficacité de type, immunités, critiques, variation aléatoire et arrondis.
- [ ] Précision, esquive, priorités, statut, météo et capacités à plusieurs frappes.
- [ ] Calculs de dégâts en combat double, y compris les modificateurs propres aux attaques de zone.
- [ ] Interactions avec talents, objets tenus, redirection, Abri et ordre des actions.
- [ ] Vérification que les modifications de types ou de règles propres à Project PM sont des overrides explicites et testés.

## 4. Tests de non-régression à ajouter

1. Les EV ne dépassent ni 255 par statistique ni 510 au total.
2. Chaque équipe finale contient exactement six espèces distinctes.
3. Chaque équipe finale possède six objets tenus distincts, tous vérifiés comme tenables en Platine/Project PM selon la cible choisie.
4. Les capacités sont évaluées selon les règles de génération IV et les CI sont marquées seulement après validation documentaire.
5. La zone de compétitivité 0–24 active le comportement automatique CI ; 25–99 exige l'activation explicite ; 100 désactive les CI.
6. Les modifications du curseur de compétitivité dans 0–24 repositionnent les deux curseurs automatiques selon les règles définies.
7. À partir de 25 %, les valeurs manuelles sont conservées et la génération est bloquée si la résolution n'est pas explicite.
8. Les écarts de type Project PM ne modifient pas silencieusement la matrice canonique de Platine.
9. Le résumé distingue un aperçu heuristique d'une équipe certifiée.

## Conclusion

**LOT NON CERTIFIÉ.** Les bornes structurelles de référence sont identifiées et six écarts/risques de conformité de l'interface actuelle sont documentés. Les formules complètes et les mécaniques Project PM doivent être testées avant toute certification de combat.
