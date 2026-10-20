# Certification exhaustive des données et mécaniques

**Statut global : EN COURS — aucune certification intégrale revendiquée.**

## Règle fondamentale
Deux cibles séparées : (A) Pokémon Platine original, génération IV ; (B) ROM Project PM, version exacte à identifier. Les changements du mod ne sont jamais inférés depuis Platine. Les informations sans preuve primaire restent marquées « documentaire » ou « à tester ».

## Échelle de preuve
- **A — Source primaire** : données/scripts de décompilation de Pokémon Platine ou données extraites d'une ROM dont le hash et la région sont consignés.
- **B — Test reproductible** : version/hash de ROM, état initial, procédure, résultat attendu et résultat observé.
- **C — Sources secondaires concordantes** : Poképédia, Pokébip, Pokémon Trash, Bulbapedia ; utile pour recouper mais pas suffisant seul pour une certification mécanique.
- **D — Non résolu** : conflit, absence de source primaire ou test manquant. Ne pas injecter comme donnée certifiée.

## Lots de contrôle obligatoires
1. Baies : 64 noms/IDs, effets, seuils, saveurs/confusion, conditions, disponibilité et baies événementielles.
2. Objets : ID, nom français, effet 4G, objet tenu ou non, obtention normale distincte de la présence dans les données.
3. Espèces : 493 entrées, noms, formes, types, stats de base, poids/taille, sexe, capture, reproduction et compatibilités.
4. Types : matrice de dégâts 4G, catégories physiques/spéciales par type, immunités, priorités, changements Project PM.
5. Capacités : identifiants, noms, type, catégorie 4G, puissance, précision, PP, priorité, cible, effets, taux, dégâts et restrictions.
6. Apprentissage : niveaux, CT/CS, reproduction, tuteurs, maîtres, formes, évolution et exceptions.
7. Talents : noms français, effets 4G, espèces compatibles, talents cachés/post-4G éventuellement présents dans le mod.
8. Évolutions et reproduction : méthode, niveau, objet, bonheur, lieu/heure, échange, compatibilité et conditions d'œuf.
9. Calculs : stats niveau 100, IV/EV, natures, arrondis, dégâts, STAB, critiques, précision/esquive, statuts et changements de stats.
10. Combat double : cibles, redirections, climat, priorité, capacités de soutien, effets de terrain, interactions objets/talents, ordre des actions et arrondis.
11. Générateur : contraintes d'équipe, starters, légendaires, exclusions, évolutions finales, doublons de type, objets uniques, génération aléatoire des CI, seuils et remplacements.
12. Interface : chaque contrôle relié à une règle testée, valeurs par défaut explicites, résultat et données cohérents.
13. Non-régression : validations de schémas, tests unitaires, tests de génération, tests navigateur mobile/desktop et site déployé.

## Sources primaires de départ
- Décompilation de Pokémon Platine : https://github.com/pret/pokeplatinum
- README de la décompilation et hashes de ROM supportées : https://github.com/pret/pokeplatinum/blob/main/README.md
- Références secondaires pour recoupement : https://www.pokepedia.fr/Liste_des_Baies et https://www.pokemontrash.com/platine/liste-baies

## Critères de validation
Chaque enregistrement doit inclure identifiant, nom officiel, jeu/version, source et emplacement précis, effet/valeurs, statut de preuve, test reproductible et notes d'exception. Le lot est « certifié » seulement lorsque toutes les lignes sont contrôlées, les différences documentées et les tests passent. Une compilation réussie ou une page wiki seule ne certifie pas l'exactitude du jeu.

## Lots de travail enregistrés
- [Lot 01 — Audit des baies](./01-berries.md) : effets repérés dans les scripts de Platine, niveaux de preuve et contrôles restant à effectuer. Statut : **partiel, non certifié intégralement**.
- [Lot 02 — Inventaire des objets](./02-items.md) : comptage structurel des identifiants et schéma primaire des objets ; effets et noms restent à vérifier ligne par ligne. Statut : **inventaire établi, non certifié intégralement**.
- [Lot 03 — Espèces, capacités et talents](./03-species-moves-abilities.md) : contrôle des inventaires source et des marqueurs techniques ; vérification ligne par ligne encore ouverte. Statut : **structure contrôlée, non certifié intégralement**.
- [Lot 04 — Types, statistiques et interface](./04-types-stats-ui.md) : bornes structurelles 4G et écarts/risques repérés dans l'interface actuelle. Statut : **audit statique partiel, non certifié**.
- [Lot 05 — Règles du générateur et CI](./05-generator-rules.md) : contrat fonctionnel et cas de tests pour composition, objets tenus et capacités illégales. Statut : **audit statique, non certifié**.
- [Rapport de tests automatisés du 19/10/2026](./TEST-REPORT-2026-10-19.md) : état le plus récent, 16/16 assertions statiques et 5/5 scénarios navigateur réussis dans GitHub Actions ; cela ne certifie pas les données ni le moteur stratégique.

## État actuel vérifié — 2026-10-20

### Dernier contrôle automatisé connu
Le workflow GitHub Actions du commit `a8f53a4aeabff0ccebbe5b6a6ebbb22d34e08742` a réussi :
- **22/22 assertions statiques** ;
- **6/6 scénarios navigateur** ;
- audit npm : **0 vulnérabilité** ;
- déploiement : réussi.

Exécution de vérification : https://github.com/Deuzel-arc/generateur-pokemon-platine/actions/runs/39343839128
Exécution de déploiement : https://github.com/Deuzel-arc/generateur-pokemon-platine/actions/runs/39343838918

Ces résultats attestent uniquement les contrôles réellement présents dans les tests. Ils ne certifient ni l'exhaustivité des données, ni la légalité des capacités par espèce, ni la viabilité compétitive, ni la conformité de Project PM.

### État fonctionnel confirmé dans le code
1. **Neuf sections d'interface** : présentes dans `index.html`.
2. **Contraintes de composition** : des gardes vérifient six Pokémon, le nombre de légendaires/fabuleux et le trio choisi. Le catalogue n'étant pas exhaustif, ces gardes ne suffisent pas à certifier toutes les compositions.
3. **Évolution maximale** : génération volontairement bloquée tant que les métadonnées d'évolution ne sont pas disponibles.
4. **Objets imposés** : 0 à 2 objets sélectionnables ; les tests navigateur contrôlent leur conservation et l'attribution de six objets distincts. Les effets et la légalité de l'ensemble du catalogue ne sont pas certifiés.
5. **Capacités illégales (CI)** : tests d'interface pour la désactivation à 100 % et la résolution des curseurs manuels. Le catalogue des CI par espèce n'est pas exhaustif.
6. **Moteur de composition** : aperçu heuristique, avec scores/tags et aléatoire ; non certifié comme moteur stratégique de combats doubles.

### Anomalies et travaux bloquants
- Catalogue d'espèces incomplet par rapport aux 493 espèces de la génération I à IV.
- Absence d'un catalogue exhaustif des capacités, de leurs données de combat et de leurs méthodes d'apprentissage par espèce.
- Absence de métadonnées d'évolution exhaustives ; le mode évolution maximale doit rester bloqué.
- Objets et baies non tous certifiés ligne par ligne ; ne pas présenter un effet comme vérifié sans provenance.
- Pas de calculateur complet de dégâts/mécaniques de combat double 4G validé contre des cas de référence.
- Les données de Platine original et les différences de Project PM ne sont pas encore séparées et certifiées de bout en bout.
- La documentation de certification doit être tenue à jour à chaque changement ; les anciens rapports ne remplacent pas le résultat du dernier workflow.

## Premier contrôle : baies
La source secondaire Pokémon Trash liste les baies numérotées 1 à 64 et distingue les baies de résistance, les baies de statistiques, Micle/Chérim et les baies Jaboca/Pommo. Le tableau de travail précédemment sauvegardé contient des seuils et descriptions qui ne sont pas tous certifiés. La liste complète doit être reconstruite à partir des données/scripts de Platine et comparée ligne par ligne avant d'être utilisée par le moteur.
Source de recoupement : https://www.pokemontrash.com/platine/liste-baies
Source de recoupement : https://www.pokepedia.fr/Liste_des_Baies

## Correctif appliqué
- 2026-10-19 — Le libellé de la note CI dans `index.html` a été corrigé : la plage automatique affichée est désormais **0–24 % inclus**, en cohérence avec la condition déjà présente dans le code (`c < 25`). Ce correctif ne résout pas les autres anomalies du moteur et ne vaut pas certification fonctionnelle complète.

## Journal
- 2026-10-19 — `index.html` : ajout de gardes bloquantes si l'équipe est incomplète, si le nombre de légendaires/fabuleux demandé n'est pas respecté, si le trio imposé manque, ou si « évolution maximale » est activé sans métadonnées suffisantes. Assertions statiques : 10/10 réussies ; pas encore de test navigateur.
- 2026-10-19 — `index.html` : suppression de l'exclusion globale des starters hors trio choisi dans le pool des trois places libres ; affectation des six objets aux six Pokémon par cibles distinctes. Vérification finale : tests statiques 16/16 et tests navigateur 5/5 réussis sur GitHub Actions, commit `eab9e66ccffaf6318bb6d717cbd46ed2ede06fc3`.
- 2026-10-19 — Création du plan de certification et de l'échelle de preuve. Aucun lot n'est déclaré certifié à cette date.
