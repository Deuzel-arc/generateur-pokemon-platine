# Checklist maîtresse — terminer le générateur Pokémon Platine

Mis à jour le 2026-10-21. Cette checklist est le registre de reprise du projet. Une tâche ne passe à terminée qu'après vérification et preuve. Priorité actuelle : finir le décryptage/audit des ROMs avant de développer le simulateur complet.

## A — Décryptage et audit ROM (priorité immédiate)
- [ ] Reprendre au dernier checkpoint réel : relire les rapports d'audit existants, identifier le dernier artefact vérifié et la prochaine étape inachevée.
- [ ] Inventorier tous les fichiers, archives, tables et champs extraits dans CPUF (Platine original) et CPUE (Project PM), avec SHA-256 et provenance.
- [ ] Décoder les données binaires encore non interprétées ; documenter format, offsets, tailles, index et références.
- [ ] Comparer les deux ROMs : identique, modifié, ajouté, supprimé, inconnu ; garder les profils CPUF et CPUE distincts.
- [ ] Résoudre ou isoler les types inconnus CPUE, dont l'ID brut 9 associé à Fée dans Project PM, et les identités sémantiques d'attaques non confirmées.
- [ ] Auditer espèces, stats, types, talents, évolutions, learnsets, attaques, objets/effets et ressources de combat pertinentes.
- [ ] Vérifier les références croisées, bornes d'ID, sentinelles, doublons, entrées réservées et intégrité structurelle des NARC.
- [ ] Conserver valeurs brutes, source et niveau de confiance ; séparer faits certifiés, hypothèses et particularités Project PM.
- [ ] Faire des contrôles indépendants/différentiels et tests de non-régression.
- [ ] Produire un rapport de couverture : extrait, décodé, interprété, certifié, inconnu/bloquant.
- [ ] Ne jamais promouvoir des données candidates au runtime avant certification.

## B — Base de référence stratégique
- [ ] Créer/valider une référence versionnée avec provenance, confiance et dépendances par champ et par ROM.
- [ ] Étendre la couverture runtime au-delà des 71 espèces actuelles à partir de données certifiées, jusqu'aux 493 espèces autorisées.
- [ ] Vérifier noms français, IDs canoniques 1–493, stats, types, talents, attaques et effets Gen IV.
- [ ] Certifier séparément les écarts Project PM ; ne pas transposer automatiquement les effets de Platine.
- [ ] Documenter les inconnues qui bloquent des recommandations.

## C — Générateur et moteur hybride
- [ ] Tester contraintes dures : 6 Pokémon, générations I–IV, doubles 2v2, niveau 100, exactement 1 légendaire/fabuleux selon les règles du projet, espèces uniques.
- [ ] Trio choisi = seulement ses trois évolutions finales imposées ; les trois autres membres restent libres Gen I–IV. « Aucun trio » = six places libres.
- [ ] Remplacer l'interdiction générale de Queulorior par une règle anti-exploitation : ne pas le laisser dominer artificiellement la recherche uniquement parce qu'il peut apprendre un très grand nombre de capacités. Évaluer son inclusion selon les règles compétitives et les options choisies ; si une option utilisateur l'exclut, cette exclusion devient une contrainte dure.
- [ ] Connecter le moteur hybride à des données certifiées et à l'interface sans utiliser de profils candidats.
- [ ] Appliquer une recherche en deux phases aux options choisies : (1) explorer systématiquement l'espace des combinaisons compatibles avec tous les paramètres, avec des méthodes exactes et des élagages sûrs ; (2) seulement si aucune solution admissible n'existe, lancer une recherche de solutions de repli minimisant les écarts aux paramètres. Ne jamais présenter une recherche interrompue ou limitée comme une preuve qu'aucune solution n'existe.
- [ ] Autoriser l'algorithme à détecter et corriger ses propres incohérences de code, de données dérivées ou de raisonnement, avec tests de non-régression et journal des changements ; interdire toute auto-correction silencieuse qui altérerait les options utilisateur, les données ROM certifiées ou les règles du profil actif.
- [ ] Calculer automatiquement les synergies du plus simple au plus complexe : individu, paires, noyaux, équipe complète, interactions stratégiques ; conserver preuves, conditions et limites de confiance.
- [ ] Découvrir et comparer des stratégies réellement employées en compétition Gen IV à partir de sources vérifiables, puis explorer de nouvelles variantes par recherche et simulation sans confondre stratégies attestées et stratégies découvertes.
- [ ] Évaluer couverture offensive/défensive, rôles, vitesse, résistances/faiblesses et interactions doubles sur données vérifiées.
- [ ] Expliquer scores, preuves, incertitudes et raisons d'exclusion.
- [ ] Générer des sets crédibles en compétition de quatrième génération à partir de stratégies et sets attestés quand ils sont disponibles ; autoriser Abri aussi souvent que les rôles, les données compétitives et les résultats le justifient. Ne pas le forcer partout ni le pénaliser arbitrairement ; interdire uniquement les doublons de capacités sur un même Pokémon et respecter toutes les options sélectionnées.
- [ ] Vérifier existence et effets Gen IV des objets ; signaler les incertitudes.
- [ ] Supprimer le terme ambigu « capacités personnalisées » : le générateur peut proposer des capacités illégales au regard de l'apprentissage normal, en nombre et selon les choix de l'utilisateur. Il doit les identifier clairement comme illégales/à attribuer manuellement ; l'utilisateur les attribuera dans PKHeX avant les combats réels. Vérifier cohérence biologique, règles Gen IV/Project PM et options sélectionnées, sans prétendre que ces capacités sont légalement apprises dans le jeu.
- [ ] Tester qualité, diversité, reproductibilité et performances.

## D — Simulateur de combat
- [ ] Définir des profils distincts : Platine Gen IV, Project PM, configuration personnalisée si nécessaire.
- [ ] Construire une matrice de couverture des mécaniques et implémenter par lots validés.
- [ ] Valider stats/dégâts, ordre d'action, précision, priorités, immunités, STAB, critiques, aléatoire, statuts, boosts, talents, objets, cibles et effets doubles.
- [ ] Ajouter terrain, météo, pièges, protection, redirection, multi-cibles et autres mécaniques nécessaires au périmètre.
- [ ] Journaliser seed, versions, événements, actions, dégâts et fin de combat.
- [ ] Si une mécanique requise n'est pas supportée, renvoyer incomplet/unsupported plutôt que d'inventer.
- [ ] Ajouter tests différentiels et non-régression pour chaque mécanique.
- [ ] Ne déclarer le simulateur complet qu'après validation de toutes les mécaniques requises.

## E — Mémoire et optimisation
- [ ] Relier registre d'expériences, recherche et simulateur.
- [ ] Persister victoires, défaites, égalités, incomplets et erreurs avec seed, règles, adversaire, équipe, versions, snapshot de données, métriques et conclusions.
- [ ] Dédupliquer les expériences identiques sans écraser les contradictions ni les échecs informatifs.
- [ ] Éviter les répétitions inutiles, sauf confirmation d'anomalie ou nouvelle version.
- [ ] Définir adversaires/styles variés et jeu de validation distinct des données d'optimisation.
- [ ] Modifier seulement les paramètres autorisés ; garder historique et baseline.
- [ ] Accepter une amélioration seulement si elle progresse sur validation sans violer les contraintes dures.
- [ ] L'apprentissage ne change jamais les faits de ROM, ne transforme jamais une hypothèse en fait certifié et ne peut jamais outrepasser les options sélectionnées par l'utilisateur.
- [ ] Permettre l'autocorrection contrôlée du code et des incohérences internes : diagnostic, reproduction, correction minimale, tests ciblés, suite complète et retour arrière en cas d'échec. L'algorithme doit signaler les problèmes qu'il ne peut pas corriger avec certitude au lieu d'inventer une correction.

## F — Interface, tests et livraison
- [ ] Intégrer moteur, simulateur et mémoire sans casser les fonctions existantes.
- [ ] Montrer règles, stratégie, synergies, confiance des données et limites.
- [ ] Tester mobile/ordinateur, erreurs, états vides, performance et accessibilité.
- [ ] Faire passer tests locaux/CI après changements et corriger les régressions.
- [ ] Vérifier GitHub Pages en production, pas seulement le dépôt.
- [ ] Mettre à jour README, documentation, architecture et instructions de reprise.
- [ ] Faire la revue finale de toutes les contraintes ; demander l'accord de l'utilisateur avant fusion/publication finale.

## Point de reprise obligatoire
À chaque reprise : (1) vérifier l'état de la CI de la branche de travail, (2) consulter les rapports/checkpoints de décryptage, (3) reprendre la première case non terminée de A, (4) communiquer les progrès réellement vérifiés, tâche courante, obstacle et prochaine étape. Ne pas inventer de pourcentage global ; annoncer les pourcentages uniquement avec un dénominateur explicite.

## Critères de clôture
Ne déclarer le générateur terminé que lorsque les tâches bloquantes sont vérifiées, la couverture restante est documentée, tests et déploiement passent, les données candidates ne sont pas présentées comme certifiées et les limites restantes ont été explicitement acceptées.

## Clarifications fonctionnelles prioritaires (2026-10-21)

- **Queulorior :** l'ancienne exclusion était une protection contre l'exploitation artificielle de son vaste movepool, pas une règle compétitive immuable. Le traitement doit être fondé sur les options utilisateur et l'équilibre de recherche. Toute option explicite d'exclusion reste absolue.
- **Abri :** ne jamais bannir ou pénaliser cette capacité simplement parce qu'elle est fréquente. En doubles Gen IV, son utilisation peut être optimale et doit émerger des sets compétitifs attestés, des rôles et des résultats. Éviter seulement la distribution automatique sans justification.
- **Capacités illégales :** ce sont des capacités non accessibles par l'apprentissage normal, sélectionnées par le générateur selon les options choisies puis attribuées manuellement par l'utilisateur via PKHeX pour les essais en jeu. Ne pas les appeler « capacités personnalisées » et ne pas prétendre que le générateur modifie directement la ROM ou la sauvegarde.
- **Autocorrection :** l'algorithme peut diagnostiquer et corriger ses propres incohérences de code, de validation ou de données dérivées. Toute correction doit être traçable, testée et réversible ; elle ne peut jamais changer silencieusement une option choisie, une règle active ou un fait certifié.
- **Priorité des options et recherche de repli :** les choix explicites de l'utilisateur (trio, légendaire, quantité et choix des capacités illégales, règles, objets, contraintes de composition et autres paramètres exposés) sont prioritaires. Le moteur cherche d'abord des solutions qui respectent intégralement ces choix. Il doit explorer systématiquement les possibilités compatibles, en indiquant honnêtement si la recherche est exhaustive ou interrompue. Uniquement si l'absence de solution compatible est démontrée, il peut proposer une solution de repli qui minimise les changements. Chaque écart doit être explicitement listé, justifié et présenté comme une proposition nécessitant l'accord de l'utilisateur ; les paramètres d'origine ne sont jamais modifiés en silence. Si l'exhaustivité ne peut être établie, le moteur doit dire « aucune solution trouvée dans la recherche effectuée », et non « aucune solution n'existe ».
- **Classement des replis :** minimiser d'abord le nombre de paramètres modifiés, puis l'importance des paramètres selon une hiérarchie définie et visible ; ne jamais relâcher automatiquement une contrainte déclarée absolument obligatoire. Présenter plusieurs alternatives proches si elles existent, avec les compromis précis, pour laisser l'utilisateur décider.
