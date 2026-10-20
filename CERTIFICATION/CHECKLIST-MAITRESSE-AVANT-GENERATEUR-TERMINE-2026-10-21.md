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
- [ ] Exclure Queulorior.
- [ ] Connecter le moteur hybride à des données certifiées et à l'interface sans utiliser de profils candidats.
- [ ] Calculer les synergies du plus simple au plus complexe : individu, paires, noyaux, équipe complète, interactions stratégiques.
- [ ] Évaluer couverture offensive/défensive, rôles, vitesse, résistances/faiblesses et interactions doubles sur données vérifiées.
- [ ] Expliquer scores, preuves, incertitudes et raisons d'exclusion.
- [ ] Varier les sets, éviter Abri systématique et les capacités dupliquées sur un même Pokémon.
- [ ] Vérifier existence et effets Gen IV des objets ; signaler les incertitudes.
- [ ] Encadrer les capacités personnalisées PKHeX par les règles choisies et leur cohérence.
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
- [ ] L'apprentissage ne change jamais les faits de ROM et ne transforme jamais une hypothèse en fait certifié.

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
