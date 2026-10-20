# Algorithme de découverte des synergies et stratégies Pokémon
Version: 1.0 — 2026-10-21
Statut: spécification de conception; non certifiée comme implémentée.

## Exigence centrale
Le générateur doit calculer lui-même les synergies et stratégies à partir de l'ensemble des données disponibles et certifiées extraites de CPUF (Pokémon Platine original) et CPUE (Project PM), ainsi que des données déjà présentes dans le projet. Il ne doit pas dépendre d'une liste fermée de compositions préfabriquées ou de tags saisis manuellement. Les stratégies connues servent d'hypothèses/étiquettes de départ et de tests, pas de limites à la découverte.

## Pipeline de calcul, du simple au complexe
1. **Inventaire et normalisation** : espèces, statistiques, types, talents, capacités, catégories de dégâts de génération IV, puissance/précision/PP/priorité, cibles/portée, effets, objets, évolutions, météo et autres mécaniques disponibles. Conserver la provenance et le périmètre de chaque donnée. CPUF et CPUE sont deux jeux de données distincts; un ID identique n'établit pas une identité.
2. **Validation des données** : contrôler les références, les valeurs, les champs manquants, les doublons, les contradictions et la confiance. Les données non certifiées peuvent générer des hypothèses, mais pas justifier une recommandation finale comme un fait. Ne jamais inventer un effet ou un talent.
3. **Synergies de niveau 1 — individuelles** : valeur d'une capacité, d'un talent, d'un objet ou d'une caractéristique pour un rôle; couverture, faiblesses, résistances/immunités, vitesse, priorité, puissance, fiabilité et contraintes de l'espèce.
4. **Niveau 2 — paires** : complémentarité offensive/défensive, couverture mutuelle des faiblesses, enchaînements de capacités, redirection/protection, contrôle de vitesse, météo, immunités utiles, capacités de zone et risques de toucher le partenaire. Calculer aussi les conflits et contre-synergies.
5. **Niveau 3 — noyaux de 3+ Pokémon** : rechercher des interactions qui n'existent pas dans les paires seules, chaînes de soutien, conditions de victoire, rôles complémentaires et réponses aux contres. Mesurer l'apport marginal de chaque membre.
6. **Niveau 4 — stratégie d'équipe** : combiner les noyaux et les rôles pour former des plans offensifs, défensifs ou équilibrés; stratégies principales et secondaires; plan de jeu et réponses aux menaces. Évaluer les synergies et conflits globaux, pas seulement la somme de scores individuels.
7. **Niveau 5 — recherche de compositions** : générer plusieurs équipes candidates, respecter d'abord tous les filtres durs, puis comparer leurs scores stratégiques et leur diversité. Éviter de recycler toujours les mêmes espèces et mesurer la redondance entre résultats.
8. **Niveau 6 — CI intégrées à la recherche** : évaluer les capacités illégales vérifiées comme des candidats stratégiques dans le processus de construction. Distinguer : CI fondatrice (définit une ligne stratégique), CI synergique (renforce une interaction) et CI complémentaire (comble un besoin). La fréquence détermine les tentatives selon la règle du projet; le filtre d'incongruité règle le degré d'originalité admissible. L'illégalité doit être prouvée séparément du score. Une CI refusée doit être remplacée selon la politique de quota sans contourner les contraintes dures.
9. **Niveau 7 — vérification et présentation** : vérifier l'équipe complète, les quatre capacités par Pokémon, les mécaniques de doubles, les objets distincts, les contraintes de génération/trio/légendaires/évolution, la fiabilité des données, les contres et le plan de jeu. Ne présenter comme certifiées que les affirmations appuyées par des données certifiées.

## Fonctions d'évaluation
Le score doit être décomposé en facteurs explicables, au minimum :
- conformité aux contraintes dures (échec bloquant, jamais compensé par un score);
- synergie offensive et couverture;
- robustesse défensive et gestion des faiblesses;
- interactions spécifiques au combat double;
- rôles, condition de victoire et capacité à concrétiser le plan;
- réponses aux menaces et contres connus;
- conflits, redondances et coûts d'opportunité;
- adéquation à l'orientation et aux stratégies choisies;
- cohérence des CI et niveau d'incertitude des données;
- diversité et originalité entre équipes générées.
Les poids doivent être documentés et testés. Un tag de stratégie seul, ou le hasard seul, ne suffit pas à justifier une équipe.

## Découverte et explication
Pour chaque synergie ou stratégie calculée, conserver :
- les éléments impliqués et les interactions précises;
- les conditions nécessaires et les contreparties/conflits;
- les preuves de mécaniques et leur provenance CPUF/CPUE/officielle;
- le score décomposé et l'apport marginal;
- le statut (hypothèse, corroborée, certifiée, contestée);
- un exemple reproductible et un test lorsque cela devient une règle du moteur.
Le générateur doit pouvoir expliquer en langage simple pourquoi deux Pokémon fonctionnent ensemble, comment une stratégie gagne, ses limites et comment l'adversaire peut la contrer.

## Traitement de toutes les données ROM
Le pipeline doit parcourir toutes les données extraites, déjà auditées ou extraites à l'avenir, pas uniquement le roster runtime actuel. Il doit tenir un inventaire de couverture par fichier, champ et entité. Une donnée brute n'est exploitable stratégiquement qu'après identification et validation de sa sémantique. Les 493 profils candidats et les 422 profils en staging ne doivent pas être considérés comme intégrés/certifiés par le seul fait qu'ils existent.
À chaque nouvel import ou modification ROM : revalider les dépendances, recalculer les relations touchées, exécuter les tests et signaler les synergies/stratégies dont le statut a changé.

## Performance et précision
Utiliser un calcul par couches : pré-calcul des propriétés individuelles, index des paires, exploration ciblée des groupes, puis évaluation des équipes complètes. Éviter l'explosion combinatoire grâce à l'élagage des candidats qui échouent aux filtres durs, à des bornes supérieures de score, à la mémorisation des résultats et à la mise à jour incrémentale lorsque seules quelques données changent. Toute optimisation doit préserver l'exactitude et être testée contre un calcul de référence sur des petits jeux de données.

## Tests obligatoires
- données incomplètes/inconnues : ne pas inventer les effets et diminuer la confiance;
- CPUF et CPUE avec IDs identiques mais sémantiques différentes : ne pas fusionner;
- synergie individuelle, paire, trio et équipe complète : résultats explicables;
- contre-synergies et redondances : détectées et pénalisées;
- stratégies choisies et orientation : changent effectivement le classement des équipes;
- CI fondatrice/synergique/complémentaire : rôles distincts, légalité vérifiée;
- contraintes dures violées : équipe rejetée quel que soit le score;
- nouveaux profils ou mécaniques importés : dépendances recalculées;
- diversité : éviter une répétition excessive de mêmes espèces/archétypes;
- non-régression et comparaison du moteur optimisé au moteur de référence.

## Limites et critère d'achèvement
Cette spécification ne prouve pas que le moteur est déjà codé. Une étape est terminée uniquement quand les données concernées sont identifiées et certifiées, l'algorithme est implémenté, les tests correspondants sont exécutés et leurs résultats sont sauvegardés. Toute partie non couverte doit rester explicitement en attente.
