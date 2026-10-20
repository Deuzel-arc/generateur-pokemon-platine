# Moteur d'analyse automatique des synergies et stratégies
Version 1.0 — 2026-10-21
Statut : spécification obligatoire, à implémenter et tester. Ce document ne prétend pas que le moteur est déjà codé.

## Exigence centrale
Le générateur doit calculer lui-même les synergies et les stratégies, du niveau le plus simple au plus complexe, à partir de toutes les données ROM déjà extraites et de toutes celles qui seront extraites plus tard. Les synergies ne doivent pas dépendre uniquement de tags écrits à la main, d'une liste de combos prédéfinis ou de l'intuition du développeur. Les tags peuvent servir d'indices, jamais remplacer le calcul.

Le pipeline doit pouvoir être relancé sur l'ensemble du corpus canonique à chaque ajout/correction de données. Il doit enregistrer la version des données, les preuves utilisées, les résultats, les incertitudes et les tests.

## 1. Corpus d'entrée et périmètre
Analyser l'ensemble des données disponibles, sans limiter l'analyse aux 71 profils runtime actuels :
- les données brutes extraites des deux ROM identifiées par hash (CPUF Platine et CPUE Project PM);
- les profils candidats des 493 espèces standard I–IV et les profils en staging;
- les espèces, formes, types, statistiques, talents, capacités, catégories, puissance, précision, PP, priorité, effets et cibles, objets, baies, évolutions, méthodes d'apprentissage, météo, terrain et mécaniques qui auront été certifiés;
- les règles de combat double de génération IV et les différences Project PM confirmées;
- les connaissances canoniques vérifiées issues du registre de connaissances.
Ne pas assimiler une donnée extraite à une donnée comprise/certifiée. Les données CPUF et CPUE sont des sources distinctes; aucun rapprochement par ID numérique seul. Les données candidates ou incertaines peuvent produire des hypothèses exploratoires, mais pas des recommandations runtime présentées comme certaines.

## 2. Pipeline hiérarchique des synergies
Calculer les niveaux dans cet ordre, en gardant des liens entre eux.

### Niveau 0 — Validité et effets unitaires
Pour chaque espèce, talent, capacité et objet : identifier les effets certifiés, les conditions de déclenchement, les cibles, les restrictions, les risques et la provenance. Détecter les champs manquants et contradictions. Un effet inconnu ne peut pas être supposé.

### Niveau 1 — Synergies internes à un Pokémon
Calculer les interactions entre ses quatre capacités, talent, objet, nature/EV/IV et types : complémentarité de couverture, STAB, boost, coûts de tours, auto-dégâts, immunités, priorités, redondance, conditions d'activation et conflits. Tenir compte des mécaniques Platine/Gen IV, notamment catégorie physique/spéciale déterminée par le type.

### Niveau 2 — Synergies par paire de Pokémon
Évaluer toutes les paires admissibles, pas uniquement des duos pré-étiquetés : immunités croisées, couvertures des faiblesses, redirection, protection, attaques de zone et dégâts alliés, contrôle de vitesse, météo, soutien, boosts, soins, statut, priorité, complémentarité des rôles et incompatibilités. Les interactions doivent être évaluées dans les règles du combat double.

### Niveau 3 — Triples et noyaux stratégiques
Rechercher les chaînes d'interactions entre trois Pokémon : préparation puis exploitation, soutien puis sweep, contrôle de vitesse puis pression, météo et abusers, redirection et setup, statuts et exploitation, etc. Ne pas supposer que chaque paire positive produit un triple positif : recalculer les interactions et les conflits combinés.

### Niveau 4 — Équipe complète de six
Évaluer l'équipe comme système : condition de victoire, plan de jeu, redondances utiles ou nuisibles, couverture offensive/défensive, vulnérabilités communes, vitesse, ressources de tours, dépendances à une capacité/un Pokémon, réponses aux menaces, stabilité si un partenaire tombe K.O., synergies de réserve et flexibilité. Recalculer le score global plutôt que sommer naïvement les paires.

### Niveau 5 — Stratégies émergentes
Déduire des stratégies candidates depuis les interactions validées et les chaînes de dépendance. Pour chaque stratégie, documenter : prérequis, séquence de jeu, Pokémon/rôles requis, mécanisme, réponse adverse, risques, contre-jeu, conditions d'échec, niveau de confiance et exemples d'équipes. Une stratégie doit être démontrée par des mécaniques; un nom ou un tag n'est pas une preuve.

### Niveau 6 — Combinaisons multi-stratégies
Détecter les stratégies qui se renforcent, celles qui se concurrencent pour les mêmes tours/slots/objets et celles qui sont incompatibles. Évaluer les coûts d'opportunité et le nombre de tours requis. Une stratégie secondaire n'est ajoutée que si elle complète le plan principal sans le fragiliser de manière excessive.

## 3. Moteur de score explicable
Pour chaque relation ou stratégie, conserver un vecteur de dimensions séparées plutôt qu'une note opaque :
- gain offensif attendu et couverture;
- protection défensive et couverture des faiblesses;
- contrôle de vitesse et de priorité;
- contrôle de terrain/météo et compatibilité;
- soutien, redirection, statut, soin et contrôle adverse;
- fiabilité, coût en tours et dépendance aux conditions;
- redondance utile/inutile;
- contre-jeu adverse et fragilité;
- qualité/preuve des données.
Les pondérations doivent dépendre de l'orientation demandée (offensive, défensive, équilibrée), de la compétitivité et des stratégies choisies. Une préférence utilisateur peut modifier la fonction d'objectif, jamais les faits de mécanique.

Les filtres durs passent avant le score : six espèces distinctes, générations autorisées, Queulorior exclu, trio de starters imposé, compte exact de légendaires/fabuleux, évolution maximale, objets distincts et règles CI. Aucun score ne peut compenser une violation dure.

## 4. CI dans la découverte des stratégies
Les capacités illégales sont un espace de recherche distinct, pas un raccourci qui contourne les règles :
- détecter les stratégies possibles avec les capacités officielles certifiées;
- rechercher ensuite les CI fondatrices qui ouvrent un concept stratégique nouveau, les CI synergiques qui améliorent une interaction et les CI complémentaires qui résolvent un besoin;
- évaluer leurs effets sur les niveaux 1 à 6 et reclasser les stratégies si une CI change réellement le plan de jeu;
- vérifier l'illégalité par toutes les méthodes officielles pertinentes de la génération IV pour l'espèce et la ROM/périmètre choisi;
- garder séparés légalité, incongruité, utilité stratégique et fréquence de tirage;
- une CI rejetée doit être remplacée selon la règle de tirage sans être déclarée valide par simple score;
- les stratégies qui n'existent que grâce à une CI doivent être signalées comme telles et ne jamais être présentées comme légales officiellement.

## 5. Analyse exhaustive et incrémentale des données ROM
À chaque nouvelle extraction, correction ou certification :
1. normaliser et dédupliquer les entités et effets;
2. recalculer les dépendances touchées (espèce, capacité, talent, objet, mécanique);
3. relancer l'analyse locale concernée puis les niveaux supérieurs impactés;
4. recalculer périodiquement le corpus complet pour éviter les résultats périmés;
5. comparer les résultats avant/après, expliquer les changements de synergie/stratégie et préserver l'historique;
6. mettre en quarantaine les résultats dépendant de données contestées;
7. produire un rapport de couverture : entités analysées, données inconnues, combinaisons évaluées, synergies trouvées, stratégies candidates, erreurs et limites.

L'analyse doit couvrir toutes les entités extraites, y compris celles pas encore intégrées au runtime. Le moteur de recommandation n'utilise que les résultats certifiés pour la ROM et le niveau de preuve requis; les résultats exploratoires sont conservés pour guider la certification.

## 6. Découverte automatique et maîtrise de l'explosion combinatoire
- Énumérer exactement les interactions simples et les paires dans la mesure où les effets certifiés le permettent.
- Pour les triples, noyaux et équipes complètes, utiliser une recherche progressive avec élagage explicable, bornes et diversité; ne pas prétendre avoir testé toutes les combinaisons si ce n'est pas le cas.
- Prioriser les candidats prometteurs sans éliminer prématurément les synergies atypiques ou fondées sur CI.
- Conserver la méthode de recherche, la couverture explorée et les candidats écartés avec leur raison.
- Éviter les biais de popularité : la rareté d'un Pokémon ou d'une stratégie n'est pas un malus en soi.
- Ne jamais utiliser le même effet deux fois dans le score si cela double-compte le même avantage.
- Distinguer synergie réelle, simple coexistence, redondance et conflit.

## 7. Tests obligatoires
- Données officielles et CPUE isolées; aucun mélange silencieux de sémantique entre ROM.
- Effets inconnus ou incomplets : aucun bonus mécanique inventé.
- Exemple unitaire, paire positive, paire négative, triple émergent et équipe cohérente.
- Interaction à dégâts alliés, immunités, portée/cible, priorité, météo et contrôle de vitesse en double.
- Stratégie principale et secondaire compatibles, concurrentes ou incompatibles.
- Orientation offensive/défensive/équilibrée modifiant effectivement le classement.
- CI fondatrice, synergique, complémentaire, rejetée et absence de candidat certifié.
- Données ajoutées/modifiées qui entraînent un recalcul traçable.
- Non-régression, déterminisme avec seed fixe et reproductibilité des explications.
- Vérification que les 493 espèces candidates sont prises en compte dans l'analyse de données, sans prétendre qu'elles sont toutes déjà certifiées runtime.

## 8. Sorties attendues
Chaque résultat calculé doit fournir :
- entités concernées et type de relation;
- mécanique et conditions qui la justifient;
- bénéfices, coûts, risques et contre-jeu;
- score vectoriel et pondérations utilisées;
- provenance et statut de certification de chaque prémisse;
- version du corpus et de l'algorithme;
- tests associés et limites;
- caractère officiel, Project PM ou CI/PKHeX.
Le générateur doit pouvoir expliquer en langage joueur pourquoi un duo, un trio, une stratégie ou une équipe a été retenu, et quelles données justifient ce choix.

## 9. Critère de réussite
Le moteur est considéré implémenté seulement lorsque le code calcule effectivement ces niveaux, les résultats sont traçables et les tests passent. Le fait que la spécification soit sauvegardée ne prouve ni l'implémentation ni la couverture complète. Les progrès doivent être annoncés séparément pour extraction, certification des données, analyse des synergies, intégration runtime et tests.
