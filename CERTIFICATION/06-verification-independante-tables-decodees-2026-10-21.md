# Vérification indépendante des tables décodées — reprise du 21 octobre 2026

**Statut :** contrôle structurel indépendant réussi sur l'export JSON disponible ; aucune certification sémantique supplémentaire n'est revendiquée.
**Fichier inspecté :** `rom_battle_database.json` (bibliothèque ChatGPT, export extrait des ROMs).
**SHA-256 du JSON inspecté :** `eba0d4f71b26d3d190d53c0e3da8b11d7c18f08089a712e381d1087261a14e78`.
**Taille :** 2 718 509 octets.
**ROM CPUF :** `1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8`.
**ROM CPUE :** `435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1`.

## Contrôles relancés sur le JSON réel

| Table | CPUF | CPUE | Résultat |
|---|---:|---:|---|
| Espèces exportées, IDs internes | 508 (0–507) | 509 (0–508) | IDs uniques, aucun doublon |
| Enregistrements de capacités | 471 (0–470) | 472 (0–471) | IDs uniques, aucun doublon |
| Objets exportés | 446 (0–445) | 470 (0–469) | IDs uniques, aucun doublon |
| Tables d'apprentissage | 508 espèces | 509 espèces | IDs d'espèces uniques |
| Tables d'évolution | 508 espèces | 509 espèces | IDs d'espèces uniques |
| Lignes avec six statistiques numériques entre 0 et 255 | 0 invalides | 0 invalides | Contrôle de forme réussi |
| Lignes avec exactement deux champs de type | 0 invalides | 0 invalides | Contrôle de forme réussi |
| Tables d'apprentissage sans terminateur détecté | 0 | 0 | Tous les terminateurs signalés présents |
| Références d'attaques hors de la table extraite | 0 | 0 | Aucune sur les références lisibles |

## Contrôle spécifique des 493 espèces standard

| Mesure | CPUF | CPUE |
|---|---:|---:|
| Espèces standard 1–493 avec une ligne d'apprentissage | 493/493 | 493/493 |
| Entrées d'apprentissage par niveau dans ces 493 lignes | 6 598 | 8 590 |
| Références aux IDs de capacité 468 ou plus | 0 | 56 |

Les 56 références CPUE hors de la plage canonique Gen IV se répartissent comme suit : ID 468 = 38, ID 469 = 10, ID 470 = 5, ID 471 = 3. Elles concernent les quatre entrées supplémentaires de la table Project PM. Elles doivent rester explicitement identifiées et ne pas recevoir un nom canonique sur la seule base de leur ID.

Le nombre total d'entrées d'apprentissage sur toutes les lignes exportées est plus élevé (6 753 CPUF et 8 760 CPUE), car les exports incluent aussi des lignes d'espèces/formes spéciales hors des IDs standard 1–493. Il n'y a donc pas contradiction avec les totaux limités au roster standard.

## Ce que ce contrôle prouve — et ne prouve pas

**Prouvé sur le JSON inspecté :**
- les IDs internes des tables vérifiées sont uniques et continus ;
- les formes de lignes de statistiques et de types respectent les contrôles structurels ci-dessus ;
- toutes les lignes d'apprentissage possèdent un terminateur signalé et aucune référence lisible ne sort de la table extraite ;
- les totaux des 493 espèces standard et l'usage des quatre IDs de capacité CPUE supplémentaires sont reproductibles à partir de l'export.

**Non prouvé :**
- que chaque ID interne est correctement associé à une espèce nationale ou à un nom français ;
- que tous les champs extraits ont la bonne sémantique ;
- que les méthodes d'évolution sont toutes interprétées correctement ;
- que les effets de capacités et d'objets Project PM reproduisent leur comportement en combat ;
- que le JSON correspond à la version exacte de toute autre copie de ROM ou à un audit plus ancien.

## Prochaine action prioritaire

1. Réconcilier les empreintes des ROMs et les overrides historiques avant de transférer des conclusions entre audits.
2. Confirmer la source/version exacte de Project PM ; le registre actuel indique que cette provenance n'est pas encore établie.
3. Reprendre les mappings sémantiques les plus bloquants : capacités CPUE 468–471, huit capacités de type brut 9, types des espèces, méthodes d'évolution et effets tenus des objets.
4. Comparer les enregistrements aux sources primaires épinglées champ par champ et conserver les incertitudes.
5. N'élargir le roster runtime qu'avec des profils dont les champs nécessaires sont validés.

## Validation du dépôt

Le workflow GitHub Actions consulté pour le commit `ad180cc8aec4c538d7daa7b79ec935d90ac01a32` a terminé avec succès : [Quality checks, run 39521092946](https://github.com/Deuzel-arc/generateur-pokemon-platine/actions/runs/39521092946). Ce succès valide la suite du dépôt pour ce commit ; il ne constitue pas à lui seul une certification sémantique des ROMs.
