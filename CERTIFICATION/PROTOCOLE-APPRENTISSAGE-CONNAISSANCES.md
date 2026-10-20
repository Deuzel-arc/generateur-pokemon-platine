# Protocole d'amélioration continue des connaissances Pokémon
Version: 1.0 — 2026-10-21

## Objectif
Chaque discussion Pokémon utile doit pouvoir améliorer le référentiel, les règles et les tests du générateur. Une information répétée n'est pas une preuve; une hypothèse n'est pas une donnée certifiée. Rien ne doit être intégré au moteur simplement parce que cela a été dit en conversation.

## Boucle obligatoire à chaque reprise et après toute discussion pertinente
1. Extraire les faits, préférences, contraintes, hypothèses, corrections et questions ouvertes concernant Pokémon, les ROM, les stratégies, les CI ou le générateur.
2. Normaliser chaque entrée sous un identifiant stable et une formulation canonique. Reconnaître les noms français/anglais, alias, variantes orthographiques et synonymes.
3. Dédupliquer uniquement les éléments de même sens et de même portée. Garder les sources et les nuances. Un conflit n'est jamais un doublon à supprimer.
4. Vérifier selon la nature de l'information:
   - identité/octet du jeu modifié: ROM exacte, hash, extraction reproductible;
   - règles officielles de Platine: référence fiable et mécanique de génération IV;
   - particularités Project PM: preuve CPUE ou test du mod;
   - comportement du générateur: code et tests exécutés;
   - préférence utilisateur: enregistrer fidèlement comme exigence de conception.
5. Donner un statut explicite: propose, à vérifier, corroboré, certifié, contesté ou rejeté. Enregistrer confiance, provenance, périmètre, date et méthode de vérification.
6. Séparer explicitement Pokémon Platine officiel, Project PM, personnalisation PKHeX/CI et préférences de conception. Ne jamais fusionner des données CPUF/CPUE sur la seule base d'un ID numérique.
7. Transformer les connaissances validées en données canoniques, règles de sélection/scoring ou tests automatisés. Chaque règle qui affecte la génération doit avoir un exemple reproductible et, si possible, un test d'influence.
8. Valider les doublons, les références, les contraintes, les interactions stratégiques et les non-régressions. Une modification n'est « intégrée » que si le code ou les données ont été effectivement modifiés; elle n'est « testée » que si un résultat de test est disponible.
9. Mettre à jour le cahier des charges, le registre des connaissances, les audits et le rapport d'avancement. Lister les changements, les preuves, les incertitudes, les tests réellement exécutés et les prochaines étapes.

## Schéma minimal d'une connaissance
- id stable
- affirmation canonique
- domaine: officiel Platine / CPUF / CPUE-Project PM / CI-PKHeX / stratégie / UI-préférence
- statut et niveau de confiance
- source et preuve exacte
- périmètre (jeu, ROM, génération, conditions)
- alias et doublons fusionnés
- contradictions liées
- date et méthode de vérification
- runtime_eligible: false tant que non certifié
- test ou exemple reproductible pour toute règle algorithmique

## Règles d'arbitrage
- Les extractions et tests reproductibles de la ROM exacte priment pour les octets et particularités du mod.
- Les références fiables de génération IV priment pour les règles officielles de Platine; ne pas importer des mécaniques modernes.
- Le code et les tests effectifs priment pour dire ce que le générateur fait réellement.
- Les consignes explicites de l'utilisateur priment pour les préférences de conception, sans transformer une préférence en fait Pokémon.
- En cas de conflit de preuves, conserver les deux points de vue et bloquer la certification jusqu'à résolution.
- Les connaissances non vérifiées guident les recherches, mais restent hors du moteur runtime.
- Ne jamais prétendre à un apprentissage ou à un travail en arrière-plan entre deux tours.

## Intégration avec le système CI et les stratégies
Les CI sont évaluées dans le contexte de l'équipe et des rôles stratégiques, pas ajoutées aveuglément à la fin. Le référentiel doit distinguer une CI fondatrice qui peut définir un concept stratégique, une CI synergique qui améliore une interaction entre partenaires et une CI complémentaire qui comble un besoin. Les tirages de fréquence, l'admissibilité légale et le score stratégique sont trois mécanismes distincts. Le score ne peut jamais contourner les contraintes dures ni les preuves d'illégalité. Le nombre de tentatives et le nombre de CI validées doivent être suivis séparément.

## Résultat attendu
Chaque conversation pertinente doit améliorer le référentiel ou clarifier une question ouverte, éviter les doublons, préserver l'historique des désaccords et ajouter des tests lorsque le comportement du moteur change. Le générateur ne consomme que les données certifiées pour la ROM et le périmètre sélectionnés.
