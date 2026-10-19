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
