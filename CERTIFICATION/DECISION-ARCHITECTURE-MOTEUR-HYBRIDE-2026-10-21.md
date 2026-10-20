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

- Le générateur actuel est décrit par la certification du dépôt comme un aperçu heuristique fondé sur des scores/tags et de l’aléatoire, et non comme un moteur stratégique certifié de combats doubles.
- Les tests existants contrôlent des contraintes d’interface et l’intégrité de certains audits ; ils ne démontrent pas la fidélité d’une simulation de combat.
- Les documents spécifient déjà les paliers de synergie, les preuves, les statuts d’incertitude et les besoins d’optimisation, mais une spécification n’est pas une implémentation.
- Les données candidates peuvent guider l’analyse exploratoire ; elles ne doivent pas alimenter sans garde-fou les recommandations présentées comme certifiées.

### À construire

1. Inventaire unifié des faits exploitables avec provenance par ROM, champ, statut et dépendances.
2. Recherche hybride de candidats, d’abord avec filtres durs, puis scores explicables et recherche hiérarchique.
3. Moteur de règles de combat Gen IV et adaptateurs spécifiques à Project PM, séparés par profils de règles.
4. Simulateur déterministe/reproductible avec graine, journaux d’événements, limite de tours et statut explicite des mécaniques non supportées.
5. Tests différentiels sur cas de référence pour les statistiques, dégâts, précision, priorités, effets, cibles et interactions doubles.
6. Registre d’expériences persistantes, déduplication sémantique contrôlée et analyse des résultats positifs/négatifs.
7. Optimiseur de paramètres à garde-fous, évalué sur des équipes/adversaires de validation distincts des données d’optimisation.
8. Explications de synergies et stratégies issues de preuves et de résultats simulés.
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

Cette branche ajoute les contrats d’architecture et le schéma de mémoire comme fondations non runtime. Elle ne prétend pas ajouter un simulateur complet ni un apprentissage adaptatif opérationnel. Les données ROM existantes ne sont pas modifiées.
