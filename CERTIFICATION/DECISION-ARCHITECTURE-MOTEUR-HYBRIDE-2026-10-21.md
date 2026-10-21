# Décision d’architecture — moteur hybride, simulation et apprentissage

Date : 2026-10-21
Statut : décision de conception acceptée ; implémentation complète non revendiquée.
Branche de travail : `feature/moteur-hybride-simulation-apprentissage`

## Décision retenue

- **Recherche : moteur hybride.** Filtres durs déterministes, génération de candidats, recherche combinatoire hiérarchique et optimisation des candidats admissibles.
- **Simulation : cible complète.** La cible est une simulation des combats doubles de niveau 100 conforme à la génération IV et aux écarts Project PM certifiés. L’exécution doit progresser par lots de mécaniques validées ; aucun moteur partiel ne doit être présenté comme une simulation complète.
- **Apprentissage : optimisation avancée.** L’optimisation ajuste les paramètres de notation uniquement à partir d’expériences reproductibles, de métriques de validation et de comparaisons avec un jeu de référence. Elle ne peut pas changer les faits de la ROM ni transformer une hypothèse en fait certifié.
- **Mémoire : expériences utiles complètes.** Enregistrer réussites, échecs, matchs non concluants, contexte, versions, graine aléatoire, scores, raisons, limites et conclusions. Dédupliquer les expériences strictement identiques sans effacer les contradictions ni les échecs informatifs.

## Audit initial : implémenté, partiel, manquant

### Présent dans le dépôt

- Interface web et règles de configuration dans `index.html`.
- Garde-fous de composition et contrôles pour les objets imposés et les paramètres de capacités illégales.
- Référentiels et audits ROM distincts pour CPUF (Platine original) et CPUE (Project PM), avec des statuts de confiance.
- Catalogue runtime de 71 espèces sur 493 canoniques ; profils candidats pour 493 espèces et données en staging, explicitement non intégrés/certifiés.
- Scripts d’audit et de validation, tests statiques et tests navigateur.
- Documents de conception pour le calcul des synergies et l’amélioration continue.

### Présent mais limité

- Le générateur runtime existant reste un aperçu heuristique fondé sur des scores/tags et de l’aléatoire ; il n’est pas encore relié au nouveau module de recherche.
- Un module expérimental `src/strategy/hybrid-engine.mjs` existe désormais : filtres de contraintes dures, score décomposé, traitement explicite des entrées non certifiées, recherche combinatoire reproductible et optimisation de poids avec garde-fou de validation. Il accepte les synergies et matrices de types comme preuves injectées ; il ne les invente pas et ne simule pas les combats.
- Un module `src/strategy/experience-store.mjs` permet de persister des expériences via un adaptateur `getItem/setItem`, de dédupliquer les exécutions identiques et de conserver les résultats contradictoires, défaites et combats incomplets. Il n’est pas encore connecté à l’interface ni à un simulateur.
- Un schéma versionné et des tests de contrat couvrent ces interfaces. Les tests unitaires sont ajoutés à `npm test`; la validation complète CI reste nécessaire.
- Les données candidates restent séparées des recommandations runtime certifiées.

### À construire

1. Inventaire unifié des faits exploitables avec provenance par ROM, champ, statut et dépendances.
2. Connexion du moteur hybride à une source de profils dont les champs stratégiques sont effectivement certifiés, puis à l’interface sans promouvoir les profils candidats.
3. Moteur de règles de combat Gen IV et adaptateurs spécifiques à Project PM, séparés par profils de règles.
4. Simulateur déterministe/reproductible avec graine, journaux d’événements, limite de tours et statut explicite des mécaniques non supportées.
5. Tests différentiels sur cas de référence pour les statistiques, dégâts, précision, priorités, effets, cibles et interactions doubles.
6. Connexion du registre d’expériences au simulateur et à la recherche, avec identifiants de données et de versions.
7. Optimiseur de paramètres évalué sur des équipes/adversaires de validation distincts des données d’optimisation.
8. Découverte et explication des synergies et stratégies issues de preuves et, plus tard, de résultats simulés.
9. Tableau de couverture indiquant les mécaniques certifiées, partiellement simulées, inconnues ou bloquantes.

## Ordre de réalisation

### Phase 0 — Sécurité des données et contrats

- Ne pas remplacer les fichiers existants ni promouvoir automatiquement les profils candidats.
- Définir les schémas d’expérience et les interfaces du moteur.
- Maintenir les jeux de données CPUF et CPUE distincts.
- Toute mécanique inconnue bloque les conclusions qui en dépendent ou réduit explicitement leur confiance.

### Phase 1 — Moteur de recherche hybride sans prétention de simulation

- Vérifier les contraintes dures avant tout score.
- Pré-calculer les attributs certifiés, les synergies individuelles puis les paires.
- Étendre aux noyaux, équipes complètes et interactions multi-stratégies uniquement lorsque les entrées requises sont certifiées.
- Produire des explications, des scores décomposés et les preuves utilisées.

### Phase 2 — Simulation par tranches validées

- Commencer par les calculs purs de statistiques et dégâts, puis ajouter ordre des actions, précision, priorités, statuts, objets, talents, cibles et effets doubles.
- Valider chaque tranche sur des cas de référence.
- Ne déclarer « simulation complète » qu’après couverture de toutes les mécaniques nécessaires au périmètre choisi et réussite des tests différentiels.
- Si une interaction CPUE n’est pas connue, marquer le combat comme incomplet ou exploratoire plutôt que d’inventer le comportement.

### Phase 3 — Mémoire et optimisation avancée

- Enregistrer les expériences complètes avec versions et reproductibilité.
- Évaluer les résultats contre plusieurs styles d’adversaires et plusieurs seeds.
- Séparer données d’optimisation et jeu de validation pour éviter le surapprentissage.
- Ajuster uniquement les poids de scoring ou paramètres explicitement autorisés ; garder un historique et permettre de revenir à une version antérieure.
- Accepter une amélioration seulement si elle dépasse une baseline sur le jeu de validation, sans régression de contraintes dures ou de confiance des données.

### Phase 4 — Intégration runtime et CI

- Intégrer par petits lots isolés.
- Ajouter tests unitaires, tests de propriétés, tests de non-régression et scénarios navigateur.
- Exécuter toute la suite et vérifier le déploiement avant de déclarer une étape terminée.
- Publier les taux de couverture séparément : données ROM, mécaniques simulées, espèces utilisables, stratégies évaluées et tests passés.

## Critères de réussite

- Zéro fusion CPUF/CPUE basée uniquement sur un identifiant numérique.
- Zéro effet inconnu inventé.
- Toutes les contraintes dures sont bloquantes et testées.
- Une simulation est reproductible depuis sa graine et ses versions de données/moteur.
- Les résultats incluent victoires, défaites, matchs non concluants et limites de couverture.
- L’apprentissage ne promeut aucune donnée factuelle et n’ajuste aucun paramètre sans comparaison de validation.
- Les expériences utiles sont persistées et dédupliquées sans supprimer les conflits.
- La couverture de simulation est mesurée par mécanique, pas déclarée « complète » par simple présence d’un module.

## État de cette modification

Cette branche ajoute les contrats d’architecture, un premier moteur de recherche/scoring expérimental, un registre d’expériences par adaptateur et leurs tests. Elle ne prétend pas ajouter un simulateur complet, une intégration runtime au générateur ou un apprentissage adaptatif opérationnel. Les données ROM existantes ne sont pas modifiées. La CI doit réussir avant toute intégration.
