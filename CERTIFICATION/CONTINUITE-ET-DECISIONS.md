# Continuité du générateur Pokémon Platine / Project PM
Mise à jour : 2026-10-21. Lire ce document au début de toute reprise, puis consulter les audits détaillés liés.

## Contrat de l'équipe
- Doubles 2v2, niveau 100, six espèces distinctes, générations I–IV uniquement (IDs standards 1–493).
- Queulorior toujours exclu.
- Trio de starters choisi : imposer uniquement ses trois évolutions finales ; les trois autres places restent libres parmi toutes les espèces I–IV. Aucun trio : six places libres.
- Respecter exactement le nombre de légendaires/fabuleux choisi, sans ajout implicite. Classification exhaustive encore à certifier.
- Évolution maximale : uniquement formes finales ou espèces sans évolution, après validation des chaînes.
- Éviter les types répétés quand cela ne nuit pas à la stratégie. Équilibrer compétitivité, originalité et plaisir ; les deux Pokémon hors starters/légendaires doivent être des choix solides.
- Ne pas recycler systématiquement les mêmes espèces ; construire et analyser les six Pokémon avant l'aperçu. Après l'aperçu : détails, régénération avec les mêmes paramètres, ou nouvelle équipe. Infographie seulement après la fiche complète.
- Garder les neuf sections et l'apparence bleu ardoise/bleu glacier validées ; pas de refonte sans accord.

## Neuf sections
1. Compétitivité et évolution maximale.
2. Trio de starters : aucun/Kanto/Johto/Hoenn/Sinnoh.
3. Nombre exact de légendaires/fabuleux.
4. Orientation offensive/défensive/équilibrée.
5. Jusqu'à trois stratégies principales.
6. Capacités illégales (CI) : activation, fréquence, incongruité, influence stratégique.
7. De 0 à 2 objets imposés ; six objets finaux distincts, objets imposés affectés à des Pokémon différents. Exclure les baies qui ne font que modifier Don Naturel ; limiter suggestions de baies à 0–2 et masquer leurs descriptions internes.
8. Stratégie secondaire : aucune ou une, seulement si compatible.
9. Remarques libres : interpréter les contraintes explicites ; signaler ambiguïtés/contradictions au lieu de deviner.

## CI — définition et comportement
CI = capacité existant en génération IV, mais inaccessible à l'espèce par toute méthode officielle de génération IV, ajoutée via PKHeX. Une capacité absente du moveset par niveau n'est pas automatiquement une CI.
- Vérifier niveau, CT/CS, reproduction, tuteurs et toutes autres méthodes officielles pertinentes. Ne jamais étiqueter [I] sans preuve.
- Fréquence = probabilité indépendante par slot parmi les 24 slots de capacité de l'équipe ; le nombre final est aléatoire sauf exigence distincte de compte exact.
- Incongruité et légalité sont deux dimensions séparées.
- Si une CI candidate est rejetée par cohérence, retenter une CI vérifiée sans perdre le quota de tirages réussis requis.
- 0–24 % compétitivité : fréquence/incongruité automatiques mais modifiables ; repositionnement automatique des deux curseurs dans cette plage.
- 25–99 % : CI désactivées par défaut ; activation explicite et réglages manuels explicites nécessaires.
- 100 % : CI désactivées, curseurs verrouillés/réinitialisés.
- Tester 0/24/25/99/100, les changements de mode, fréquence 0/100 %, CI inconnue et remplacement d'une CI rejetée.
- CI/personnalisations doivent rester cohérentes avec la biologie et le type, et être distinguées du légal officiel.

## Algorithme : filtres durs puis stratégie
Filtres durs avant tout score : six espèces distinctes, générations autorisées, Queulorior exclu, trio imposé, compte exact de légendaires/fabuleux, évolution maximale, fiabilité suffisante des données, objets distincts, politique CI respectée. Un score ne peut jamais compenser une violation dure.
Ensuite, évaluer l'équipe complète et ses six sets : stats niveau 100, types/faiblesses/immunités, talents vérifiés, attaques réellement disponibles, objets, priorités/vitesse, portée et cibles en doubles, attaques de zone, Abri/protection, redirection, météo/terrain, contrôle de vitesse, synergies et conflits entre partenaires, condition de victoire, menaces/contres et plan de jeu. Orientation et stratégies choisies doivent influer mesurablement sur la sélection. Tags/hasard seuls ne suffisent pas. Ne jamais inventer un talent.

## Fiche et infographie finale
Pour chaque Pokémon : rôle, talent, objet, nature, EV/IV, quatre capacités avec type/catégorie/puissance/précision et explication. Inclure synergies, menaces/contres, guide de jeu ≤4 étapes, jusqu'à quatre duos complémentaires. Au total, maximum deux alternatives : une capacité et un objet. Infographie portrait 9:16 lisible sur téléphone, fond sobre, grille claire ; panneau bas gauche pour les duos, bas droit pour les alternatives ; remplacer le tableau récapitulatif par le guide de quatre étapes.

## Données et provenance
CPUF Platine original SHA-256: 1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8
CPUE Project PM SHA-256: 435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1
Ne jamais fusionner par ID numérique sans identité indépendante. Séparer données CPUF et overrides CPUE. Distinguer extraction brute, identité, interprétation et certification runtime. Mécaniques ciblées : Platine/génération IV, catégorie physique/spéciale déterminée par type ; changements CPUE nécessitent preuves propres au mod. Inconnu reste inconnu ; données extraites ne signifient pas effets compris/testés.

## État connu
- Catalogue candidat : 493 espèces ; runtime : 71 ; 422 absentes du runtime.
- `data/rom_roster_profiles_candidate_493.json` : candidat complet non intégré.
- `data/rom_roster_missing_species_staging.json` : 422 profils préparés, explicitement non intégrés.
- Évolutions recensées : 246 entrées CPUF, 247 CPUE ; méthode CPUE 27 observée deux fois, sémantique non certifiée.
- Apprentissages niveau : 6 598 entrées CPUF et 8 590 CPUE ; zéro référence invalide dans les exports audités.
- CPUE : IDs de type brut 9 sur 31 espèces (37 occurrences de slots) et 8 attaques (66, 140, 186, 204, 236, 295, 296, 461). Effets de combat de ces attaques CPUE non certifiés.
- Objets, talents, capacités, évolutions et classifications légendaires/fabuleuses ne sont pas tous certifiés ligne par ligne.
- Les garde-fous sont dans `scripts/validate-rom-audits.mjs`. Ne jamais déclarer les tests réussis sans résultat CI récent.

## Priorités
1. Intégrer progressivement les 422 profils au runtime, sans inventer métadonnées stratégiques.
2. Certifier attaques, apprentissages, talents, objets et évolutions.
3. Vérifier les CI par espèce et par toutes les méthodes officielles.
4. Construire l'algorithme stratégique avec filtres durs, scoring traçable et synergies de doubles.
5. Exécuter tests statiques, audits ROM, navigateur et `npm test`; corriger toute régression.
6. Garder les pourcentages par chantier, basés sur preuves ; ne pas prétendre à un travail en arrière-plan.

## Documents détaillés à consulter
- `CERTIFICATION/ROADMAP-13-ETAPES.md`
- `CERTIFICATION/05-generator-rules.md`
- `CERTIFICATION/03-species-moves-abilities.md`
- `CERTIFICATION/01-audit-matrice-sections.md`
- `docs/ACCELERATION_TOOLING.md`
- `data/generator_optimization_gap_audit.json`
- `data/rom_roster_missing_species_staging.json`

Règle de reprise : ne pas demander à l'utilisateur de répéter ces contraintes. Relire ce document et les audits concernés, vérifier les derniers commits/tests et signaler les manques précis plutôt que deviner.
