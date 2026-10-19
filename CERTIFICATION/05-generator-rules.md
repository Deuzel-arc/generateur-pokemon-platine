# Lot 05 — Règles du générateur et conformité du flux CI

**État : audit statique du code actuel ; tests navigateur et moteur final non exécutés.**

## Source examinée
- [Interface actuelle — index.html](../index.html)
- [Index de certification](./README.md)

## Règles contractuelles à implémenter et tester

### Composition
- L'équipe finale comporte exactement six espèces distinctes.
- Si un trio de starters est choisi, seules ses trois évolutions finales sont imposées ; les trois autres emplacements restent libres parmi les espèces autorisées des générations I à IV.
- « Aucun trio » laisse les six emplacements libres.
- Le nombre de légendaires/fabuleux doit correspondre exactement au choix explicite, sans ajout implicite.
- Queulorior est exclu.
- L'option « évolution maximale » n'accepte que des évolutions finales ou des espèces sans évolution.
- Le choix de Pokémon doit s'appuyer sur des données certifiées et une stratégie explicitement choisie, pas uniquement sur des tags ou scores aléatoires.

### Capacités illégales (CI)
- 0–24 % : mode CI automatique, avec repositionnement des deux curseurs lorsque la compétitivité change dans cette plage.
- 25–99 % : CI désactivées par défaut ; activation explicite requise, et les réglages de fréquence/incongruité doivent être résolus explicitement.
- 100 % : CI désactivées.
- La fréquence est une probabilité indépendante par emplacement parmi les 24 emplacements de capacité ; l'espérance vaut 24 × p. Le nombre effectif est aléatoire, sauf si une exigence distincte demande un compte exact.
- Une CI n'est éligible qu'après preuve qu'elle n'est accessible par aucune méthode officielle en génération IV pour l'espèce concernée. Une entrée incertaine ne doit jamais recevoir automatiquement l'étiquette [I].
- Si un candidat CI échoue aux critères, le remplacement doit préserver le nombre de tirages CI réussi demandé par l'algorithme.
- L'incongruité est un paramètre distinct de la légalité ; elle ne doit pas modifier le statut légal d'une capacité.

### Objets tenus
- Six objets tenus distincts sont requis pour une équipe de six Pokémon.
- Chaque objet doit exister dans les données de Platine et être tenable ; son effet de génération IV doit être vérifié.
- L'existence d'un objet dans un catalogue ne suffit pas à prouver sa validité.
- Les descriptions internes des baies restent masquées dans l'interface conformément à la demande.

## Constats statiques actuels (relecture du code après les correctifs d'interface)

1. **Objets : correctif d'interface présent.** `index.html` propose désormais de sélectionner jusqu'à six objets tenus distincts et bloque la validation si le nombre sélectionné n'est pas exactement six. Cela corrige l'ancien plafond de trois objets. En revanche, le contrôle confirme seulement six choix distincts dans la liste : il ne prouve pas encore que chacun est un objet tenable certifié pour la version cible ni que le moteur affecte correctement un objet à chacun des six Pokémon.
2. **CI : contrôle de résolution amélioré.** La validation calcule désormais un état `ciResolved` qui tient compte de l'initialisation automatique sous 25 %, ou des réglages manuels explicitement modifiés lorsque les CI sont activées à partir de 25 %. Ce contrôle doit encore être testé aux seuils 0, 24, 25, 99 et 100 et après chaque transition de mode.
3. **Seuil CI : libellé corrigé.** La note de l'interface indique désormais la plage automatique de 0 à 24 % inclus, cohérente avec la condition `c < 25`.
4. **Moteur d'équipe encore heuristique.** La fonction de composition utilise des scores/tags et une composante aléatoire ; elle ne constitue pas encore un score de synergie calculé à partir de learnsets certifiés, statistiques, talents et règles de combat double.
5. **Résultat non certifié.** Le résumé reste un aperçu heuristique ; les capacités, objets et données d'équipe ne sont pas tous reliés à une base exhaustive validée. Le contrôle de l'interface ne remplace pas les tests du moteur ni les tests dans Project PM.

## Cas de tests obligatoires

| ID | Entrée | Résultat attendu |
|---|---|---|
| GEN-01 | Trio Sinnoh | Torterra, Simiabraz et Pingoléon imposés une seule fois ; les trois autres espèces sont libres et distinctes. |
| GEN-02 | Aucun trio | Six espèces distinctes, aucune obligation de starter. |
| GEN-03 | Nombre de légendaires = 0/1/2/3 | Compte exact dans chacun des cas ; aucun dépassement silencieux. |
| GEN-04 | Évolution maximale | Aucun Pokémon non final avec évolution disponible, hors espèce sans évolution. |
| GEN-05 | Queulorior dans le pool source | Espèce toujours exclue. |
| GEN-06 | Objets tenus de l'équipe | Six objets uniques, validés comme tenables dans la version cible. |
| CI-01 | Compétitivité 0, 24, 25, 99, 100 | Mode automatique/manuelle/désactivé conforme aux seuils ci-dessus. |
| CI-02 | Déplacement compétitivité de 0 à 24 | Les deux curseurs automatiques se repositionnent selon la politique définie. |
| CI-03 | Compétitivité 25–99 sans confirmation des réglages | Génération bloquée avec un message explicite. |
| CI-04 | Compétitivité 100 | Aucune CI et aucun curseur CI actif. |
| CI-05 | Fréquence 0 % / 100 % | Respectivement 0 et 24 emplacements CI dans l'algorithme de génération final. |
| CI-06 | Capacité candidate au statut « à vérifier » | Jamais marquée [I] et jamais traitée comme CI certifiée. |
| CI-07 | CI rejetée au contrôle de cohérence | Remplacement par une autre CI vérifiée sans modifier le compte CI demandé. |

## Décision

**LOT NON CERTIFIÉ.** Les règles ci-dessus constituent le contrat fonctionnel de validation. Le code actuel ne satisfait pas encore l'ensemble de ces critères ; les tests doivent être automatisés et exécutés après raccordement des données certifiées.
