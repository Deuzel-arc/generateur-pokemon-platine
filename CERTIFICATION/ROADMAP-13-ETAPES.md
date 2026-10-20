# Feuille de route complète — générateur d'équipes Pokémon Platine / Project PM

**Référence de progression :** 13 étapes suivies avec critères d'acceptation vérifiables. À la demande de l'utilisateur, les lots indépendants avancent en parallèle et le travail continue sans solliciter une validation entre chaque étape. Une étape n'est déclarée terminée que lorsque ses livrables existent, ses tests passent et ses limites sont documentées. En cas de conflit de données ou de test en échec, corriger et revérifier avant d'intégrer les données concernées ; ne demander une précision que si un blocage important ne peut pas être résolu sans l'utilisateur.

## Objectif final

Créer six Pokémon de niveau 100 pour les combats doubles 2 contre 2, selon les contraintes des neuf sections de l'interface. Le moteur doit produire une équipe valide, cohérente et stratégiquement viable à partir de données traçables, expliquer les choix, fournir les sets complets, puis générer une infographie portrait 9:16 fidèle au design bleu ardoise / bleu glacier précédemment validé. Ne jamais présenter une équipe comme certifiée si une contrainte n'a pas été vérifiée.

## Contrat de conception non négociable

- Conserver les neuf sections, l'ordre, le style bleu ardoise / glacier, les cadres, boutons, cases, espacements et libellés déjà validés ; toute refonte visuelle doit être explicitement approuvée.
- Format de jeu : combats doubles 2v2, niveau 100 ; équipe de six Pokémon.
- Espèces permises : générations I à IV uniquement. Un trio choisi impose exactement ses trois évolutions finales ; les trois places restantes restent libres parmi toutes les espèces autorisées des générations I à IV. « Aucun trio » rend les six places libres.
- Nombre de légendaires/fabuleux demandé strictement respecté. Exclure Queulorior/Smeargle.
- Éviter les types répétés quand cela ne nuit pas au plan tactique ; toute répétition intentionnelle doit être justifiée.
- Favoriser un équilibre entre compétitivité, originalité et plaisir de jeu, plutôt que maximiser un seul axe. Les deux Pokémon hors starters et hors légendaires doivent être des choix solides et reconnus.
- Les capacités et talents doivent être légaux dans la génération IV, sauf règles de capacités illégales explicitement choisies ; une capacité illégale signifie ici une capacité impossible à obtenir par une méthode officielle de génération IV pour l'espèce concernée. Les talents ne sont jamais attribués arbitrairement.
- Les capacités personnalisées via PKHeX peuvent être envisagées uniquement si elles restent cohérentes avec la biologie et le type du Pokémon et sont clairement distinguées du légal.
- Utiliser les mécaniques de Pokémon Platine / génération IV, y compris catégories physiques/spéciales basées sur le type. Les différences Project PM doivent être documentées espèce par espèce à partir de données ou tests propres au mod.
- Les six objets tenus de l'équipe finale sont distincts et compatibles avec les espèces. La section 7 propose des objets ; l'utilisateur peut en imposer 0, 1 ou 2. Chaque objet imposé doit être attribué à un Pokémon distinct ; le moteur choisit les autres objets. Exclure les baies qui ne font que modifier Don Naturel. Les suggestions de baies sont limitées à 0–2 et les effets internes ne sont pas exposés dans l'interface.
- Capacités illégales : à 0–24 % de compétitivité, les curseurs fréquence et incongruité sont réglés automatiquement mais restent manipulables ; à 25–99 %, elles sont désactivées par défaut et, si activées, les deux curseurs doivent être réglés explicitement ; à 100 %, elles sont désactivées et les curseurs verrouillés/réinitialisés. La fréquence est une probabilité par emplacement de capacité, avec 24 emplacements pour six Pokémon ; l'incongruité est une dimension distincte. Le nombre final peut donc varier aléatoirement. Si un candidat est rejeté par les filtres, le moteur doit retenter sans perdre silencieusement le quota prévu lorsque le mode exige un compte exact.
- Le résultat final comprend : équipe vérifiée, rôle de chaque Pokémon, talent, objet, nature, EV/IV, quatre capacités avec type/catégorie/puissance/précision et explication, synergies individuelles et collectives, plan de jeu en quatre étapes maximum, duos complémentaires (jusqu'à quatre) et au plus deux alternatives au total (une alternative d'objet et une de capacité pour l'équipe).
- Infographie finale : portrait 9:16 lisible sur téléphone, fond sobre, grille et texte lisibles, peu de pictogrammes, visuels variés ; panneau inférieur gauche avec jusqu'à quatre duos complémentaires et explications concises ; panneau inférieur droit pour les alternatives (maximum une alternative d'objet et une de capacité) ; remplacer le tableau récapitulatif des six Pokémon par un guide stratégique de quatre étapes maximum. Pour chaque capacité, afficher type, catégorie, puissance et précision. Inclure stratégie, synergie, talents, objets et recommandations EV/IV.
- Toute modification de code doit être suivie de tests automatisés avant de considérer le changement comme validé. Les lots indépendants peuvent avancer simultanément, en préservant la provenance des données et en évitant les écritures concurrentes sur un même fichier. Communiquer le pourcentage de progression et les preuves à chaque point de contrôle ; ne pas interrompre le travail pour demander une autorisation à chaque étape.

## Les 13 étapes — portes de validation

### Étape 1 — Spécification, audit de départ et définition des critères
**But :** fixer le contrat fonctionnel, distinguer ce qui existe de ce qui est seulement prévu et créer un registre vérifiable.
**Travail :** relire l'interface et les documents de certification ; cartographier les neuf sections vers les paramètres d'algorithme ; noter les anomalies connues, dont les tests navigateur actuellement en échec et les noms/espèces qui doivent être vérifiés ; définir les règles de « bloquer plutôt que deviner ».
**Livrables :** cette feuille de route ; matrice section → état → contrainte → test ; instantané du résultat des tests de départ.
**Acceptation :** chaque paramètre de l'interface possède une définition sans ambiguïté, un comportement attendu et au moins un cas de test ; les anomalies de départ sont listées ; pas de contradiction entre la feuille de route et le README de certification.

### Étape 2 — Sources de référence, version du jeu et pipeline de données
**But :** bâtir une provenance fiable pour Pokémon Platine original et Project PM sans mélanger leurs données.
**Travail :** définir la version/région de référence et, si disponibles, les hashes ROM ; établir les sources primaires (scripts/données de décompilation et données extraites) ; documenter les écarts Project PM ; définir les schémas JSON, identifiants stables, provenance par champ, statut de preuve et validations automatiques.
**Livrables :** registre de sources, schémas versionnés, pipeline reproductible et rapport de différences.
**Acceptation :** aucune donnée marquée certifiée sans source/identifiant précis ; données de base et overrides Project PM séparés ; contrôles de schéma automatisés.

### Étape 3 — Catalogue exhaustif des espèces et noms français
**But :** fournir les 493 espèces de la 1G–4G, formes pertinentes et métadonnées nécessaires à la sélection.
**Travail :** noms français officiels, ID, types, stats de base, formes, statut légendaire/fabuleux, évolution finale, sexe/reproduction si utiles, exclusions, différences Project PM vérifiées. Construire une validation qui empêche les noms anglais dans l'interface.
**Livrables :** catalogue espèce complet, overrides Project PM, tests de couverture et de noms.
**Acceptation :** 493 espèces attendues couvertes pour le jeu de base, exclusions documentées, pas de doublon d'ID/nom ; tous les noms affichés sont français ; différences Project PM sourcées/testées ou explicitement inconnues.

### Étape 4 — Capacités, apprentissage et talents
**But :** établir les options de movesets et talents utilisables par chaque espèce.
**Travail :** catalogue de capacités (noms FR, ID, type, catégorie 4G, puissance, précision, PP, priorité, cible, effets/taux), apprentissage par niveau, CT/CS, reproduction, tuteurs et autres méthodes officielles ; talents, effets 4G et compatibilités par espèce. Distinguer légal 4G, override Project PM et capacité illégale choisie.
**Livrables :** bases versionnées des capacités, apprentissages et talents ; validateurs de légalité ; rapports de couverture.
**Acceptation :** le moteur ne peut proposer un move/talent non documenté sans le marquer comme non certifié ; aucun talent caché/postérieur n'est inventé ; chaque set est vérifiable par espèce et méthode.

### Étape 5 — Objets, baies et effets de génération IV
**But :** construire un catalogue d'objets tenus exacts, distincts et compatibles.
**Travail :** ID et noms FR, effet Platine, cible/conditions, possibilité d'être tenu, obtention séparée de la présence dans les données ; baies, déclencheurs et exceptions ; liste autorisée pour le générateur, exclusions de Don Naturel et règle de 0–2 baies suggérées.
**Livrables :** catalogue d'objets/baies, provenance, tests d'effets et de compatibilité.
**Acceptation :** chaque objet de sortie existe dans le jeu cible et son effet est celui de la 4G ; six objets distincts ; 0–2 objets imposés respectés et affectés à des Pokémon distincts ; aucune baie exclue proposée.

### Étape 6 — Moteur de règles et calculs de combat 4G
**But :** reproduire les règles nécessaires aux évaluations et vérifications.
**Travail :** matrice des types, catégories physiques/spéciales par type, stats niveau 100 avec IV/EV/nature et arrondis, dégâts, STAB, puissance effective, précision, priorité, critiques, statuts, changements de stats, immunités, météo, effets d'objets/talents et interactions de doubles. Séparer les différences Project PM.
**Livrables :** fonctions de calcul pures, tables mécaniques versionnées, tests unitaires contre des cas de référence.
**Acceptation :** cas de référence documentés passent ; aucun calcul stratégique n'utilise une règle post-4G par défaut ; les mécaniques non connues du mod sont signalées.

### Étape 7 — Validateur de contraintes et de faisabilité
**But :** garantir que toute équipe candidate respecte d'abord les contraintes du formulaire.
**Travail :** trio de starters, 3 places libres, taille six, nombre exact de légendaires/fabuleux, générations I–IV, exclusions, évolution maximale, types, objets imposés, règles CI et contraintes textuelles. Distinguer contraintes dures, préférences pondérées et instructions facultatives ; expliquer tout conflit impossible avant génération.
**Livrables :** validateur indépendant du score stratégique et matrice de tests de toutes les combinaisons.
**Acceptation :** chaque contrainte dure est testée positivement et négativement ; aucune équipe invalide ne peut être présentée comme conforme ; les combinaisons impossibles donnent une explication claire.

### Étape 8 — Algorithme de génération d'équipe et optimisation
**But :** remplacer le choix heuristique simpliste par une recherche de composition solide.
**Travail :** génération de candidats, filtre dur, score multiobjectif, pénalités/bonus de redondance, couverture offensive/défensive, vitesse, rôles, équilibre physique/spécial, soutien et plaisir/variété. Utiliser recherche avec contraintes, beam search ou stratégie déterministe reproductible, avec graine optionnelle pour reproduire les résultats. Ne pas coder le score avant que les données des étapes 3–6 soient utilisables.
**Livrables :** moteur de composition modulaire, explication de score par critère, journal des candidats rejetés.
**Acceptation :** équipes complètes et reproductibles, aucune violation dure, comparaison sur une suite de configurations et tests montrant que les paramètres choisis changent effectivement les résultats.

### Étape 9 — Synergies de combats doubles et construction des sets
**But :** vérifier que les six Pokémon et leurs sets fonctionnent ensemble, et pas seulement isolément.
**Travail :** paires de départ, ordre d'action, couverture des faiblesses, protection/redirection, météo/terrain 4G, Distorsion, priorités, soutien, propagation des attaques, immunités d'alliés et conflits entre stratégies. Construire les quatre capacités, nature, EV/IV, talent et objet selon le rôle ; vérifier la cohérence de chaque set et du duo.
**Livrables :** analyse des six sets, tableau interne de synergies/risques et correcteur itératif.
**Acceptation :** chaque capacité a un rôle expliqué ; les conflits tactiques connus sont détectés ; chaque Pokémon contribue au plan ; le moteur compare et améliore les paires et la composition globale.

### Étape 10 — Capacités illégales, incongruité et remarques utilisateur
**But :** appliquer fidèlement les curseurs et les instructions facultatives sans contourner la légalité.
**Travail :** fréquence par emplacement parmi 24 moveslots, incongruité distincte, comportements 0–24/25–99/100 %, validation manuelle, exclusions biologiques/types, remplacement après rejet, explication des choix. Traiter les remarques en contraintes structurées quand elles sont reconnues ; ne pas prétendre que du texte libre est garanti s'il ne peut pas être interprété.
**Livrables :** module CI isolé, journal de tirage et tests de seuils, probabilités et rejets.
**Acceptation :** tests aux bornes 0, 24, 25, 99, 100 ; distribution statistique vérifiée ; aucune capacité illégale à 100 % ; les paramètres modifient réellement la génération.

### Étape 11 — Rapport complet de l'équipe et stratégie générée
**But :** expliquer l'équipe vérifiée de façon claire et exploitable avant l'infographie.
**Travail :** pour chaque Pokémon, nom français, type, rôle, talent, objet, nature, EV/IV, quatre capacités avec type/catégorie/puissance/précision, fonction de chaque move, menaces couvertes, faiblesses, synergies et limites. Fournir plan d'ouverture, adaptations, conditions de victoire, quatre étapes de préparation maximum, jusqu'à quatre duos complémentaires et au plus deux alternatives globales.
**Livrables :** rapport structuré à partir des données de l'équipe, et non texte inventé séparément ; avertissements explicites si un point reste non certifié.
**Acceptation :** le rapport reflète exactement l'équipe validée et les sets ; pas de nom anglais ; aucun effet/valeur non sourcé ; stratégie utilisable pour un combat double 2v2.

### Étape 12 — Infographie finale et interface de consultation
**But :** produire une infographie à la fois fidèle au design déjà approuvé et lisible sur téléphone.
**Travail :** conserver le design bleu ardoise/glacier et la structure visuelle validée ; format portrait 9:16 ; grille claire, texte lisible, pictogrammes limités, images variées. Afficher type, catégorie, puissance et précision pour chaque move ; inclure stratégie, synergies, talent, objet, EV/IV ; panneau inférieur gauche pour jusqu'à quatre duos ; panneau inférieur droit pour au plus une alternative d'objet et une de move ; guide stratégique de quatre étapes maximum au lieu du tableau récapitulatif des six Pokémon.
**Livrables :** générateur d'infographie alimenté par les données validées, aperçu mobile et export final.
**Acceptation :** chaque donnée de l'infographie correspond au rapport validé ; aucune coupure de texte critique en 9:16 ; tests de rendu et relecture manuelle ; visuels non répétés inutilement.

### Étape 13 — Validation finale, tests de bout en bout et publication
**But :** prouver que l'ensemble fonctionne de la configuration à l'équipe puis à l'infographie.
**Travail :** suite de configurations représentatives et limites : aucun trio, chaque trio, chaque nombre de légendaires, évolution maximale, 0/1/2 objets imposés, CI à chaque seuil, textes facultatifs, orientations et stratégies ; tests desktop/mobile, non-régression, génération répétée et version publiée. Tester contre la version Project PM identifiée, si elle est accessible.
**Livrables :** rapport final de certification, version publiée, journal des limites connues, guide utilisateur et manifeste des versions de données.
**Acceptation :** tests automatisés et navigateur verts ; aucune contrainte dure violée dans la matrice de tests ; chaque donnée affichée est traçable ; les limites non résolues sont explicitement étiquetées ; l'utilisateur valide le résultat final.

## Méthode de progression

- Faire avancer simultanément les lots indépendants ; garder une seule écriture à la fois sur chaque fichier partagé et réconcilier les changements avant validation.
- Avant de changer de fichier, examiner la version courante et cibler le changement minimal.
- Après chaque modification de code, lancer les tests automatisés avant de la déclarer validée. Si les tests échouent, diagnostiquer, corriger et relancer avant de poursuivre l'intégration dépendante ; les travaux indépendants peuvent continuer en parallèle.
- Ne jamais masquer un échec ni marquer une étape terminée sur la seule base d'un déploiement réussi.
- À chaque point de contrôle : communiquer les livrables, preuves, résultats des tests, limites et pourcentage calculé. Continuer automatiquement sur les lots suivants ; signaler uniquement les blocages importants ou les questions nécessitant réellement une décision de l'utilisateur.
- Le pourcentage global sera recalculé à partir des 13 portes d'acceptation : étape non validée = 0 crédit d'étape terminée ; étapes validées = crédit acquis. Un indicateur secondaire de progression interne peut être communiqué, mais séparé du taux d'étapes terminées.
- Le travail continue automatiquement sur les étapes et lots suivants, sans demander d'autorisation à chaque transition. S'arrêter uniquement si un problème important exige une décision de l'utilisateur ou si les outils ne permettent plus d'avancer.
