# Étape 2 — Registre des sources, versions et provenance

**Mis à jour : 2026-10-20**  
**Statut : EN COURS — sources de référence identifiées, cible Project PM non épinglée, pipeline d'import non encore validé.**

## 1. Référence Platine (jeu de base)

| Élément | Valeur | Usage autorisé |
|---|---|---|
| Dépôt primaire | [pret/pokeplatinum](https://github.com/pret/pokeplatinum) | Décompilation et données techniques du jeu Pokémon Platine |
| Commit consulté | [`06c6e9a0348da283be8d9225d0bec03c349ff5c2`](https://github.com/pret/pokeplatinum/commit/06c6e9a0348da283be8d9225d0bec03c349ff5c2) | Référence immuable pour cette inspection |
| Date du commit consulté | 2026-10-19 17:31 UTC | Métadonnée de provenance |
| Identifiants espèces | [generated/species.txt](https://github.com/pret/pokeplatinum/blob/06c6e9a0348da283be8d9225d0bec03c349ff5c2/generated/species.txt) | Identifiants techniques ; ne suffit pas pour les noms français, types et stats |
| Identifiants capacités | [generated/moves.txt](https://github.com/pret/pokeplatinum/blob/06c6e9a0348da283be8d9225d0bec03c349ff5c2/generated/moves.txt) | Identifiants techniques ; ne suffit pas pour tous les effets |
| Identifiants talents | [generated/abilities.txt](https://github.com/pret/pokeplatinum/blob/06c6e9a0348da283be8d9225d0bec03c349ff5c2/generated/abilities.txt) | Identifiants techniques |
| Format des données de capacité | [docs/datafiles/moves.md](https://github.com/pret/pokeplatinum/blob/06c6e9a0348da283be8d9225d0bec03c349ff5c2/docs/datafiles/moves.md) | Interprétation des structures de données |
| Branche consultée | `main` au commit indiqué ci-dessus | Toute mise à jour doit repinner un SHA et repasser les validations |

**Limite :** la décompilation est une source primaire technique, mais ne fournit pas nécessairement tous les noms français officiels, les méthodes d'apprentissage présentées par une encyclopédie, ni les différences du mod. Aucun champ ne sera déclaré certifié à partir du seul identifiant.

## 2. Référence Project PM — BLOQUANT

Le dépôt du générateur ne permet pas encore d'établir de façon fiable :
- le dépôt source officiel du mod ;
- sa version ou son commit exact ;
- la région/région de ROM et son révision ;
- les modifications propres aux espèces, capacités, types, talents, apprentissages, objets et mécaniques ;
- un hash de ROM légalement fourni par l'utilisateur ou une version de référence reproductible.

**Règle :** ne pas traiter les données de Platine comme si elles étaient automatiquement celles de Project PM. En attendant l'identification exacte du mod, les données de base doivent porter `source=platinum-base` et les valeurs Project PM `unknown`, jamais être déduites par défaut.

## 3. Modèle de provenance exigé par champ

Chaque donnée importée doit comporter au minimum :
- `entity_type` et `entity_id` : type d'entité et identifiant stable ;
- `field` et `value` : champ et valeur ;
- `game_version` : `platinum-base` ou identifiant Project PM explicitement épinglé ;
- `source_url` et `source_revision` : source et commit/version exacts ;
- `evidence_kind` : `primary-source`, `official-reference`, `verified-test` ou `unverified` ;
- `status` : `verified`, `partial`, `unknown` ou `conflict` ;
- `notes` : méthode, hypothèses et conflits.

Une source identifie la provenance, mais ne rend pas automatiquement la donnée vérifiée. Les contradictions doivent être conservées et résolues explicitement.

## 4. Séparation des données de base et du mod

Pipeline cible :

1. Importer les données de Platine dans un jeu de référence immuable.
2. Normaliser les identifiants et les champs sans perdre les valeurs brutes.
3. Importer séparément les différences Project PM une fois la version identifiée.
4. Fusionner à l'exécution par règles explicites, en conservant la provenance de chaque champ.
5. Valider schéma, cardinalité, références étrangères, doublons, valeurs autorisées et écarts attendus.
6. Générer un rapport des champs inconnus/conflits ; bloquer la certification si un champ requis manque.
7. Produire des artefacts reproductibles et un résumé de versions/hash à chaque import.

## 5. Critères de sortie de l'étape 2

- [x] Source primaire de Platine identifiée et commit consulté épinglé.
- [x] Politique explicite empêchant de confondre Platine et Project PM.
- [x] Modèle de provenance et statuts de confiance définis.
- [ ] Source officielle et version exacte de Project PM confirmées.
- [ ] Région/révision de la ROM cible confirmée.
- [ ] Schéma de données validé par un exemple importé de chaque domaine.
- [ ] Pipeline d'import reproductible, avec contrôle d'intégrité automatisé.
- [ ] Tests négatifs prouvant qu'une source manquante ou un champ inconnu ne peut pas être certifié.
- [ ] Tests exécutés sur le commit candidat et résultats consignés.

L'étape 2 ne sera pas marquée terminée avant que tous les critères restants soient satisfaits.
