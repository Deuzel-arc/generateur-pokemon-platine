# Fondation du simulateur de combat — 21 octobre 2026

**État :** primitive de calcul et contrat de refus explicite ajoutés ; simulateur complet non implémenté.
**Branche :** `feature/moteur-hybride-simulation-apprentissage`.

## Ce qui existe désormais

- `src/strategy/battle-simulator.mjs` expose `calculateGen4BaseDamage`, qui calcule le terme déterministe de dégâts de génération IV avant les modificateurs.
- `inspectSimulationReadiness` expose les mécaniques réellement implémentées, celles qui restent non supportées et les noms inconnus.
- `simulateBattle` renvoie volontairement `status: "incomplete"`, sans vainqueur ni résultat, tant que la simulation complète n'existe pas.
- `tests/battle-simulator.test.mjs` vérifie des cas numériques, les entrées invalides et le refus d'inventer un résultat.
- Le test est intégré à `npm test`.

## Périmètre exact de la formule

La fonction implémente uniquement :

`floor(floor((floor(2 × niveau / 5) + 2) × puissance × attaque / défense) / 50) + 2`

Les statistiques d'attaque et de défense doivent être fournies comme statistiques de combat déjà calculées et adaptées à la catégorie physique/spéciale. La fonction ne calcule pas les statistiques finales d'un Pokémon.

## Mécaniques qui ne sont pas encore simulées

- STAB, efficacité et immunités des types ;
- variations aléatoires de dégâts, coups critiques et arrondis complets des modificateurs ;
- talents, objets tenus, météo, statuts et changements de statistiques ;
- priorité, ordre des tours, choix de cibles, attaques de zone et interactions doubles 2 contre 2 ;
- effets secondaires, changements de Pokémon, PP, précision et esquive ;
- divergences de Project PM, sauf celles qui auront été documentées et testées séparément.

**Règle de sûreté :** aucun résultat de combat ne doit être utilisé pour noter une équipe tant que toutes les mécaniques nécessaires au scénario n'ont pas une implémentation vérifiée. Les données non certifiées ne deviennent pas fiables parce qu'elles sont fournies au simulateur.

## Suite immédiate

1. Obtenir des fixtures de référence reproductibles pour la formule et ses modificateurs Gen IV.
2. Implémenter les statistiques de combat avec nature, IV, EV et étages de statistiques en tests séparés.
3. Ajouter les modificateurs de dégâts un par un, avec cas de référence et règles d'arrondi.
4. Implémenter la séquence des tours et les cibles doubles, avant de prétendre simuler une bataille complète.
5. Connecter la simulation à la mémoire d'expériences et au moteur hybride uniquement après validation.

La CI précédente a réussi sur le commit `e8953277dbae3fc953e45589f498fe85609f76ee`. La CI de cette nouvelle fondation doit encore être consultée avant de déclarer le nouveau HEAD validé.
