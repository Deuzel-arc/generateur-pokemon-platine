# Rapport de tests automatisés — contrôle statique du générateur

**Date : 2026-10-19**  
**Fichier contrôlé :** `index.html` sur `main`  
**Blob SHA contrôlé :** `0b74e2e0cdb56e3858772d3857fe2ce12c83a150`  
**Nature :** assertions automatisées sur les invariants présents dans le source ; ce n'est pas une exécution dans un vrai navigateur.

## Résultat

**10/10 assertions passées.**

| ID | Assertion | Résultat |
|---|---|---|
| T-01 | La validation exige exactement six objets sélectionnés | PASS |
| T-02 | Le libellé de l'interface autorise jusqu'à six objets tenus | PASS |
| T-03 | L'attribution des objets utilise un ensemble de cibles uniques | PASS |
| T-04 | Le pool ne supprime plus globalement les starters des autres trios | PASS |
| T-05 | Le mode automatique CI utilise le seuil `c < 25` (0–24 %) | PASS |
| T-06 | Les réglages manuels CI nécessitent la modification explicite des deux curseurs | PASS |
| T-07 | À 100 %, les CI sont désactivées | PASS |
| T-08 | La validation bloque si les réglages CI ne sont pas résolus | PASS |
| T-09 | Le résumé avertit que la composition actuelle est heuristique | PASS |
| T-10 | L'interface du sélecteur n'affiche pas de description d'effet interne des baies | PASS |

## Limites importantes

Ces tests sont des vérifications automatiques de présence/absence de motifs dans le code source. Ils ne démontrent pas que les fonctions s'exécutent correctement en navigateur, que les six cibles d'objets sont toujours disponibles pour toute équipe possible, que le nombre de légendaires est exact dans tous les cas, ni que les CI sont tirées selon la probabilité demandée.

## Tests encore nécessaires avant d'élargir le périmètre

- [ ] Tests fonctionnels en navigateur sur les seuils de compétitivité 0, 24, 25, 99 et 100.
- [ ] Tests de composition pour chaque trio, « aucun trio », chaque compte de légendaires et l'option évolution maximale.
- [ ] Vérifier par assertions que les six objets attribués ciblent six Pokémon distincts.
- [ ] Tests de non-régression pour les espèces exclues et les générations autorisées.
- [ ] Tests des capacités et du moteur de synergie une fois les données connectées.

**Décision :** les invariants statiques contrôlés passent. On peut considérer le lot de tests statiques comme exécuté, mais pas comme une certification fonctionnelle complète.


## Exécution réelle dans GitHub Actions — correction d'une erreur de syntaxe

Un test de compilation JavaScript a d'abord échoué : le gestionnaire du bouton de validation déclarait deux fois `const out` dans la même portée (`Identifier 'out' has already been declared`). Cette erreur empêchait l'exécution de tout le script dans le navigateur.

**Correction :** suppression de la seconde déclaration et réutilisation de la variable déjà déclarée. Commit du correctif : `520bde8a6c4d502945403486ecfa403626217919`.

**Nouvelle exécution GitHub Actions : 16/16 PASS**, dont la compilation du JavaScript inline. [Voir l'exécution](https://github.com/Deuzel-arc/generateur-pokemon-platine/actions/runs/39318763959).

La première exécution a échoué sur cette erreur ; elle n'est pas effacée du suivi. Le résultat validé est celui de la seconde exécution. Ces assertions compilent le script et contrôlent des invariants textuels ; elles ne remplacent pas les tests d'interaction en navigateur.


## Tests fonctionnels navigateur — résultat confirmé

**Exécution GitHub Actions :** [39320049769](https://github.com/Deuzel-arc/generateur-pokemon-platine/actions/runs/39320049769)  
**Conclusion :** `success` — tests statiques et navigateur terminés avec succès.

- Assertions statiques : **16/16 PASS**.
- Scénarios Playwright : **5/5 PASS**.
- Aucune erreur JavaScript pendant les interactions testées.

### Défauts trouvés dans le parcours de validation

1. Le test navigateur a d'abord révélé que la validation continuait d'afficher le message demandant six objets après leur sélection. Le diagnostic renforcé a permis de mettre en évidence une affectation à une constante de résumé déjà déclarée.
2. Le code a été corrigé pour réutiliser directement la variable existante, sans la réaffecter.
3. Après correction, le parcours complet testé passe : sélection des six objets, validation, réglage à 100 % de compétitivité et contrôle du parcours manuel des CI à 25 %.

### Portée et limites

Ces résultats valident seulement les scénarios énumérés ci-dessus. Les parcours de composition de tous les trios, les comptes de légendaires, le mode évolution maximale, les distributions aléatoires de CI, la légalité réelle des données de combat et les essais avec la ROM Project PM restent à tester.
