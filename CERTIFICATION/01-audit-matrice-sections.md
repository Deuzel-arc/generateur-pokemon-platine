# Étape 1 — Matrice d'audit de l'interface et critères d'acceptation

**Date :** 2026-10-20  
**Périmètre :** audit statique du dépôt et résultats CI déjà enregistrés.  
**Statut :** diagnostic corrigé dans la documentation ; étape non certifiée tant que les tests et la validation du contrat ne sont pas exécutés à nouveau.

## État de preuve

Le dernier workflow connu sur le commit `a8f53a4aeabff0ccebbe5b6a6ebbb22d34e08742` indique 22/22 assertions statiques et 6/6 scénarios navigateur réussis. Il ne couvre pas les bases complètes ni la viabilité stratégique. Après la modification de la documentation, une nouvelle exécution CI est nécessaire pour certifier le commit actuel.

## Matrice des neuf sections

| Section | Entrée utilisateur | Comportement attendu | État du code audité | Critère de test nécessaire |
|---|---|---|---|---|
| 1. Paramètres généraux | Niveau de compétitivité et évolution maximale | Le niveau modifie réellement la sélection et la robustesse ; l'évolution maximale ne laisse passer que les formes finales | Heuristique ; mode évolution maximale bloqué faute de métadonnées | À compétitivité faible/moyenne/forte, vérifier les axes de score et les résultats ; évolution max vérifiée sur espèces évolutives et non évolutives |
| 2. Trio de starters | Aucun/Kanto/Johto/Hoenn/Sinnoh | Si trio choisi, ses trois évolutions finales sont imposées ; les trois autres places restent libres en 1G–4G | Garde présente ; pool de données incomplet | Test de chaque trio, aucun doublon, liberté des trois autres places |
| 3. Légendaires et fabuleux | 0/1/2/3 | Respecter exactement le compte choisi selon une classification documentée | Garde présente ; classification exhaustive non certifiée | Tests positifs/négatifs pour chaque compte et cas frontière légendaire/fabuleux |
| 4. Orientation | Offensive/défensive/équilibrée | Influence le profil global et les rôles, sans réduire l'analyse aux seules statistiques de base | Influence heuristique | Tests montrant un changement mesurable de score/rôles, avec équipe et graine contrôlées |
| 5. Stratégies | Jusqu'à trois axes | Une condition de victoire et des rôles compatibles sont construits autour des axes sélectionnés | Tags/score heuristiques, pas de moteur de movesets complet | Pour chaque axe, vérifier une stratégie cohérente et l'absence de conflits majeurs |
| 6. Capacités illégales | Activation, fréquence, incongruité, influence stratégique | Séparer légalité, fréquence probabiliste, incongruité et rôle stratégique ; respecter les règles de seuil convenues | Certains contrôles d'interface sont testés ; données CI incomplètes | Tests aux seuils 0/24/25/99/100, fréquence sur 24 slots, preuve d'illégalité par espèce |
| 7. Objets tenus | 0–2 objets imposés | Conserver les objets imposés et attribuer six objets distincts, vérifiés et utiles | Attribution unique testée ; catalogue et effets pas tous certifiés | Catalogue validé, effets 4G, compatibilité et affectation distincte aux six membres |
| 8. Stratégie secondaire | Aucune ou une option secondaire | L'intégrer seulement si elle complète la stratégie principale et les paramètres | Influence heuristique | Tests de complémentarité et de rejet des combinaisons incompatibles |
| 9. Remarques supplémentaires | Texte libre facultatif | Interpréter uniquement les contraintes reconnues ; signaler celles qui sont ambiguës ou impossibles | Comportement et couverture à caractériser | Cas de contraintes explicites, ambiguës, contradictoires et sans effet stratégique |

## Critères globaux bloquants

- [ ] 493 espèces de la génération I–IV couvertes par des données sourcées.
- [ ] Capacités et données de combat de génération IV exhaustives pour le périmètre déclaré.
- [ ] Apprentissages officiels par espèce et méthode ; inconnus conservés comme inconnus.
- [ ] Talents, évolutions, formes, classification légendaire/fabuleuse vérifiés.
- [ ] Objets/baies avec identifiant, effet, version, preuve et statut de validation.
- [ ] Données de Platine original séparées des overrides Project PM.
- [ ] Validateur indépendant du score stratégique pour les contraintes dures.
- [ ] Calculs de combat 4G couverts par des cas de référence.
- [ ] Recherche de plusieurs équipes complètes et explication des critères de score.
- [ ] Génération CI conforme aux trois curseurs et traçabilité des choix/rejets.
- [ ] Rapport de stratégie et infographie conformes au contrat de conception.
- [ ] Tests statiques, unitaires, navigateur, données et déploiement exécutés sur le commit candidat.

## Politique « bloquer plutôt que deviner »

Une donnée inconnue ne doit pas être transformée en donnée négative ou positive par défaut. Si la légalité d'une capacité, l'effet d'un objet, le statut d'évolution finale ou une différence Project PM ne peut pas être vérifié, le moteur doit soit exclure l'option du résultat certifié, soit afficher explicitement l'incertitude et empêcher toute revendication de certification complète.

## Définition de progression

Une étape est certifiée seulement si ses livrables sont versionnés, les critères d'acceptation sont couverts par des tests reproductibles et les limites restantes sont explicites. La progression globale demeure à 0/13 tant qu'aucune étape n'a satisfait intégralement sa porte de validation.
