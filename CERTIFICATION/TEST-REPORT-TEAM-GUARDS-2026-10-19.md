# Rapport de tests automatisés — contrôles de conformité d'équipe

**Date : 2026-10-19**  
**Fichier contrôlé :** `index.html`, branche `main`  
**Blob SHA contrôlé :** `34aba6f5b8a69713f5319995e09004f9513f7a51`  
**Nature :** assertions automatisées sur les gardes de validation du code source ; aucun navigateur ni ROM n'a été exécuté.

## Résultat

**10/10 assertions passées.**

| ID | Assertion | Résultat |
|---|---|---|
| TEAM-01 | Bloque si moins de six Pokémon sont produits | PASS |
| TEAM-02 | Bloque si le nombre de légendaires/fabuleux diffère de la demande | PASS |
| TEAM-03 | Bloque si le trio choisi n'est pas entièrement présent | PASS |
| TEAM-04 | Bloque le mode évolution maximale tant que les métadonnées d'évolution manquent | PASS |
| TEAM-05 | La génération bloquée s'arrête avant l'affichage du nom de l'équipe | PASS |
| TEAM-06 | Le nombre de légendaires demandé reste explicitement mappé | PASS |
| TEAM-07 | Le contrôle exige toujours six objets sélectionnés | PASS |
| TEAM-08 | Le mode CI automatique conserve le seuil 0–24 % | PASS |
| TEAM-09 | Les deux réglages CI manuels doivent être modifiés explicitement | PASS |
| TEAM-10 | L'attribution d'objets conserve des cibles distinctes | PASS |

## Correctif testé dans cette étape

Le code bloque désormais la présentation d'une équipe si le nombre de Pokémon, le nombre de légendaires/fabuleux ou la présence du trio choisi ne respectent pas la demande. Le mode « évolution maximale » est également bloqué avec un message explicite, car le catalogue embarqué n'a pas les métadonnées nécessaires pour le garantir.

Cette décision évite de produire une équipe faussement annoncée comme conforme. Elle ne remplace pas l'ajout ultérieur de données d'évolution complètes.

## Limites

Les assertions contrôlent les gardes présentes dans le source, pas leur exécution réelle dans un navigateur. Les tests de parcours UI, les scénarios de génération aléatoire, les données de combat et les tests Project PM restent à faire.

**Décision :** les contrôles statiques de conformité d'équipe passent. Ne pas considérer la génération globale comme certifiée.
