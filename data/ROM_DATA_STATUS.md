# État du décodage des ROMs — mise à jour 2026-10-20

## Versions examinées

Les deux archives fournies dans la conversation ont été extraites et relues localement. Codes internes vérifiés : CPUF (original) et CPUE (Project PM), taille 134 217 728 octets chacune.

| Profil | SHA-256 calculé sur le fichier .nds extrait |
|---|---|
| Platine original | `1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8` |
| Project PM | `435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1` |

**Important :** ces empreintes ne correspondent pas aux empreintes consignées dans l'audit antérieur. Les résultats d'extraction présents ici se rapportent aux octets des fichiers `.nds` extraits des ZIP actuellement joints. Ne pas fusionner automatiquement les deux séries d'empreintes.

## Extraction réellement effectuée

Pour chaque ROM : système de fichiers NitroFS parcouru, archives NARC reconnues et indexées, données principales transformées en JSON. La base complète exportée est conservée dans la bibliothèque ChatGPT sous `/Audit_ROM_Pokemon_Platine/rom_battle_database.json`; l'archive des tables séparées est `rom_decoded_core_tables.zip`.

| Table | Original | Project PM | Niveau de décodage |
|---|---:|---:|---|
| Entrées espèces | 508 | 509 | Statistiques, types, taux de capture, EV, objets tenus, groupes d'œufs, talents, croissance et bits CT/CS décodés |
| Capacités | 471 | 472 | Identifiants, effet, catégorie, puissance, type, précision, PP, cible, priorité, drapeaux |
| Apprentissages par niveau | 508 | 509 | Niveaux et identifiants d'attaques décodés |
| Évolutions | 508 | 509 | Champs méthode/paramètre/cible extraits; interprétation des méthodes encore à certifier |
| Objets | 446 | 470 | Champs bruts conservés; sémantique des effets pas encore certifiée |
| Baies | 64 | 64 | Entrées brutes conservées; liaison complète aux noms/effets à terminer |
| Archives de rencontres | 183 | 187 | Entrées brutes conservées, pas encore entièrement décodées en zones/slots |
| Données dresseurs | 928 | 973 | Entrées brutes conservées, structure à décoder |
| Pokémon des dresseurs | 928 | 1945 | Entrées brutes conservées, structure à décoder |

## Limites et anomalies à résoudre

- Ce n'est **pas** encore un décodage exhaustif de tous les scripts, textes, événements, cartes, graphismes et sons.
- Les données d'objets, rencontres et dresseurs sont présentes mais ne doivent pas être traitées comme sémantiquement certifiées.
- Un conflit doit être résolu avant d'intégrer le type secondaire de Dracaufeu de Project PM : l'override vérifié enregistré auparavant indique Ténèbres, tandis que l'extraction directe des octets de l'archive personnelle de la ROM jointe décode l'ID de type 16 en Dragon selon la table de types employée. Les deux empreintes de ROM ne concordent pas non plus avec l'audit précédent. Ne pas remplacer l'override actif avant réconciliation de la version exacte et du mapping des types.
- La base extraite n'est pas encore chargée dynamiquement par la page GitHub Pages. Le roster stratégique de `index.html` reste partiel; les données brutes extraites ne signifient pas que l'algorithme les exploite déjà.

## Prochaines étapes

1. Réconcilier les empreintes et les versions exactes des ROM avant tout transfert d'override historique.
2. Formaliser le schéma minimal des données stratégiques et les statuts de provenance/validation.
3. Valider les identifiants des espèces, types, talents et capacités contre la référence Gen IV, en isolant les ajouts Project PM.
4. Étendre le roster par lots vérifiés au-delà des 71 profils actuels.
5. Intégrer progressivement les capacités et apprentissages, puis les évolutions et objets uniquement après décodage sémantique.
6. Ajouter des tests de régression et vérifier les workflows de tests et de déploiement après chaque changement.

Les tables de dresseurs, routes, rencontres et dialogues sont différées; voir « Périmètre stratégique du générateur ».

## Vérification automatisée — 2026-10-20

- Le workflow `Generator checks` a réussi sur le commit `01006997e7e8ff83565f9f04c6b2e080479f0ef2`, après mise à jour des tests navigateur pour vérifier le profil à travers le résumé généré plutôt que via un élément d'interface supprimé.
- Les tests de provenance du manifeste et des overrides vérifiés passent également dans le workflow de ce commit.
- Les modifications ultérieures retirent un bonus de compatibilité d'objet fondé sur le type Ténèbres non réconcilié; le workflow correspondant a réussi pour le déploiement mais son job de tests a précédemment échoué sur l'ancien test navigateur. Le test navigateur a ensuite été corrigé et le workflow de commit `01006997e7e8ff83565f9f04c6b2e080479f0ef2` a passé les tests.
- Le commit `4c44c0dcb86d98b35dfa2e12d2e339324b347957` contient la suppression du bonus restant; une nouvelle exécution de tests de bout en bout sur le HEAD actuel est nécessaire avant de certifier l'état final.

## Avancement estimatif (non mesuré automatiquement)

- Décodage sémantique des deux ROM : 25 %.
- Enrichissement validé de la base : 28 %.
- Intégration réelle au générateur : 14 %.

Ces chiffres ne représentent pas la proportion de toutes les ressources internes décodées; ils expriment l'avancement du périmètre utile au générateur. Le catalogue reste partiellement décodé et n'est pas encore chargé dynamiquement par `index.html`.


## Intégration partielle des profils d'espèces — 2026-10-20

- Ajout de `data/rom_roster_profiles.json` : statistiques de base et types décodés pour les 71 espèces du roster actuel, avec overrides Project PM séparés.
- Les 71 profils sont intégrés au calcul du roster dans `index.html` : les types et les statistiques d'attaque/défense alimentent désormais le score selon le profil choisi.
- Le mapping des types de valeur 9 dans Project PM n'est pas certifié de façon globale. Les espèces dont le type décodé reste `Inconnu` gardent leur type de référence original, sauf Gardevoir et Togekiss dont le type Fée est confirmé par le contexte du hack. À ne pas présenter comme une table de types complètement validée.
- Empreintes des ROM actuellement utilisées par les exports : original `1cfd024519116c1c6285d6af2dbdfcec778e9d74c7c18585e22032e81aaa7eb8`; Project PM `435b0288238f01f21eeeef7b5de6de3e3c9c3a9b70ea3b18d71b31ba282ae4e1`. Elles diffèrent des empreintes de l'ancien fichier d'overrides, qui doit être considéré comme un audit antérieur distinct jusqu'à réconciliation.
- Le catalogue complet des attaques et apprentissages n'est pas encore intégré au générateur; cette étape porte sur les profils de base du roster uniquement.


## Session de travail simultané — 2026-10-20

- Les profils des 71 espèces continuent d'être intégrés au générateur, et le manifeste `data/rom_catalog.json` reflète désormais ce périmètre réel sans prétendre que toutes les tables sont intégrées.
- Correction de robustesse : les types placeholder `Inconnu` ne sont jamais appliqués au roster actif.
- Les overrides de Gardevoir (Psy/Fée) et Togekiss (Fée/Vol) sont explicités dans le profil Project PM selon les règles établies pour ce hack.
- Les tests statiques contrôlent maintenant la couverture de 71 profils, la structure des lignes statistiques et ces deux types. Les tests GitHub Actions de ce dernier lot doivent encore finir avant certification.
- Travail simultané en cours : validation des données espèce/type, raccordement du calcul de score, garde-fous de provenance et tests de régression. Les tables complètes d'attaques, d'apprentissage, objets, rencontres et dresseurs restent à intégrer.

## Vérification différentielle approfondie — 2026-10-20

- Ajout du rapport structuré `data/rom_delta_audit.json`, associé aux empreintes CPUF/CPUE actuellement retenues. Il consigne les comptes par table et distingue les différences binaires des différences dont la sémantique est certifiée.
- Comparaison reproductible du JSON d'extraction conservé dans la bibliothèque : 500 entrées d'espèces modifiées sur 508 identifiants communs; 101 entrées de capacités modifiées sur 471; 497 listes d'apprentissage modifiées; 33 enregistrements d'évolution modifiés; 165 objets modifiés; 75 archives de rencontres modifiées. Ces chiffres sont des différences de champs extraits, pas une certification des conséquences en jeu.
- Les 64 entrées de baies diffèrent toutes sur l'octet d'index 4. La structure `BerryData` du dépôt de référence `pret/pokeplatinum` (commit `06c6e9a0348da283be8d9225d0bec03c349ff5c2`, `include/berry_data.h`) identifie ce champ comme `stageDuration`. Cette interprétation est confirmée pour la structure Platine de référence; elle ne suppose pas que Project PM conserve tous les aspects du format inchangés.
- Un test automatisé vérifie la provenance du rapport, les empreintes et les comptes clés, et empêche de traiter le catalogue brut comme certifié. La réussite des tests sur le commit courant doit être vérifiée dans GitHub Actions avant de valider le lot.
- Les équipes de dresseurs, les noms et effets d'objets, les rencontres normalisées, le mapping global des types Project PM et la réconciliation des empreintes de l'audit historique restent non certifiés.


## Périmètre stratégique du générateur — décision du 2026-10-20

Le périmètre d'intégration est limité aux données nécessaires à la construction et à l'évaluation d'équipes. Les archives extraites restent conservées pour audit; les tables hors périmètre ne doivent pas être supprimées ni intégrées automatiquement au runtime.

### Priorité d'intégration
1. Espèces et formes : identifiants réconciliés, noms, types, statistiques et talents.
2. Capacités : identifiants, noms, type, catégorie, puissance, précision, priorité, PP et effets, avec provenance et statut de validation.
3. Apprentissage par niveau et compatibilités de capacités, en distinguant les règles originales et Project PM.
4. Évolutions et formes, après certification des méthodes et paramètres.
5. Objets tenus et effets de combat, uniquement lorsque leur sémantique et leur disponibilité sont vérifiées.
6. Table des types et règles de combat Gen IV, avec différences de Project PM documentées séparément.
7. Tests de cohérence des données, des équipes doubles et de la provenance; CI et déploiement après chaque lot.

### Hors périmètre immédiat
Dresseurs et leurs équipes, routes/cartes, rencontres sauvages, dialogues, scripts narratifs, événements, graphismes, musiques et sons ne sont pas nécessaires au générateur actuel. Leur décodage est reporté, sans suppression des archives. Ils pourront être réévalués si un mode aventure, défi ou simulation de progression est ajouté.

### Garde-fous
- Une table extraite n'est pas réputée sémantiquement décodée par le seul fait qu'elle existe.
- Ne pas apparier les entrées entre ROM uniquement par index lorsque la structure ou les empreintes sont en conflit.
- Ne pas inventer les noms ou effets des IDs supplémentaires; conserver les données brutes et indiquer explicitement ce qui reste inconnu.
- Le catalogue de référence et les données propres à Project PM doivent rester séparés et sourcés.
- Étendre le roster au-delà des 71 profils actuels seulement après validation des identifiants, types et statistiques correspondants.

## Vérification CI — 2026-10-20, reprise suivante

- Le workflow `Generator checks` a réussi sur le commit `381570728d74e431e67914459c92b8267bf670fd` (run 133) : configuration Node, cache Playwright, installation des dépendances, installation Chromium et tests statiques/ROM/navigateur terminés avec succès.
- Le déploiement GitHub Pages associé a également réussi (run 190).
- La cause du run 132 en échec était la configuration `setup-node` demandant un cache npm fondé sur `package-lock.json`, absent du dépôt. Le workflow a été corrigé en supprimant ce cache npm et en utilisant `npm install`; le cache Playwright reste activé avec une clé fondée sur `package.json`.
- Cette correction rétablit la vérification automatisée, mais ne certifie pas de nouveaux mappings ROM. Les empreintes différentes de l'audit historique et les noms d'IDs spéciaux/attaques supplémentaires restent à résoudre avant intégration runtime.
- Avancement estimatif inchangé à cette vérification : décryptage ROM 25 %, validation/enrichissement des bases 32 %, intégration générateur 14 %. Ces valeurs sont des estimations de travail, pas des mesures automatiques.

## Contrôle structurel croisé des tables extraites — 2026-10-20

Un contrôle local indépendant a été exécuté sur `rom_battle_database.json` pour les deux profils. Résultats :
- Identifiants uniques et continus pour les espèces, capacités, apprentissages, évolutions et objets (508 espèces/471 capacités pour Platine; 509/472 pour Project PM).
- Tous les enregistrements de statistiques ont les six champs attendus et des valeurs entières comprises entre 0 et 255; tous les champs puissance/précision/PP contrôlés sont dans leur plage binaire attendue.
- Toutes les références de capacités des listes d'apprentissage pointent vers un ID présent dans la table des capacités du même profil; niveaux compris entre 1 et 100; marqueurs de fin trouvés dans toutes les listes.
- Toutes les cibles d'évolution référencées sont dans les limites de la table d'espèces du profil.
- **Aucune anomalie structurelle détectée dans ces contrôles.** Cela ne certifie ni les noms, ni les effets de combat, ni l'identité nationale des entrées spéciales.
- Le profil Project PM contient 31 entrées d'espèces avec au moins un type décodé comme `Inconnu`. Les octets bruts sont conservés; l'hypothèse que l'ID de type concerné représente Fée doit être confirmée par une table de types ou un contrôle de combat avant de remplacer ce statut.

## Enquête ciblée sur l'identifiant de type 9 — 2026-10-20

- Dans la table des espèces Project PM, la valeur brute d'ID de type 9 est actuellement affichée « Inconnu » par le décodeur. Elle apparaît dans 31 enregistrements d'espèces; dans la table des attaques, elle apparaît notamment sur les attaques 66, 140, 186, 204, 236, 295, 296 et 461.
- L'hypothèse « type Fée » est plausible car plusieurs entrées correspondent à des espèces qui ont reçu le type Fée dans les générations suivantes (par ex. Mélofée, Rondoudou, M. Mime, Togepi, Marill, Snubbull, Tarsal, Mysdibule et Toudoudou).
- **Cette hypothèse n'est pas encore certifiée** : d'autres entrées portant l'ID 9, comme Méganium (ID 154), ne correspondent pas à la liste canonique des espèces ayant gagné le type Fée. Cela peut indiquer des changements propres à Project PM, un mapping différent, ou une table de types qui doit être décodée directement. La seule fréquence des valeurs ne suffit pas à trancher.
- Décision conservatrice : ne pas remplacer automatiquement « Inconnu » par « Fée » dans les données runtime. Garder l'ID brut 9, la liste des occurrences et l'hypothèse séparée jusqu'à ce que la table des types ou le calcul d'efficacité en combat soit contrôlé dans la ROM Project PM exacte.
- Prochaine vérification technique : retrouver dans NitroFS les données de table d'efficacité des types et/ou le code/table qui relie les IDs internes aux noms, puis comparer au moins plusieurs cas discriminants. Les empreintes CPUF/CPUE actuelles doivent rester attachées à chaque résultat.
