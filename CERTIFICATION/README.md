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

## Premier contrôle : baies
La source secondaire Pokémon Trash liste les baies numérotées 1 à 64 et distingue les baies de résistance, les baies de statistiques, Micle/Chérim et les baies Jaboca/Pommo. Le tableau de travail précédemment sauvegardé contient des seuils et descriptions qui ne sont pas tous certifiés. La liste complète doit être reconstruite à partir des données/scripts de Platine et comparée ligne par ligne avant d'être utilisée par le moteur.
Source de recoupement : https://www.pokemontrash.com/platine/liste-baies
Source de recoupement : https://www.pokepedia.fr/Liste_des_Baies

## Journal
- 2026-10-19 — Création du plan de certification et de l'échelle de preuve. Aucun lot n'est déclaré certifié à cette date.
