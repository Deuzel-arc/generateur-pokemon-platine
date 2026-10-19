# Référence vérifiée des 64 baies — Pokémon Platine / génération IV

## Périmètre et fiabilité

Référence compilée à partir de la liste française de Poképédia et du guide Pokémon Platine de Pokémon Trash. La 4G compte 64 baies : les 35 premières baies de la liste de la 3G, les 17 baies de résistance, puis les baies Lichii à Enigma renumérotées 53–60, et enfin Micle, Chérim, Jaboca et Pommo en 61–64. Les baies e-Reader de la 3G ne sont pas des baies distinctes dans Platine : elles deviennent des Baies Enigma au transfert.

Sources :
- Poképédia, « Liste des Baies » : https://www.pokepedia.fr/Liste_des_Baies
- Pokémon Trash, « Liste des Baies — Platine » : https://www.pokemontrash.com/platine/liste-baies
- Bulbapedia, « Berry » : https://bulbapedia.bulbagarden.net/wiki/Berry

Les noms français et les effets sont transcrits selon les références ci-dessus. « Vérifiée par source » ne signifie pas que chaque effet a été exécuté dans une ROM. Les mécaniques exactes de Project PM devront être testées séparément.

## 1. Soin des PV, des statuts et des PP (10)

- **Baie Ceriz (#01)** — soigne la paralysie.
- **Baie Maron (#02)** — soigne le sommeil.
- **Baie Pêcha (#03)** — soigne l'empoisonnement.
- **Baie Fraive (#04)** — soigne la brûlure.
- **Baie Willia (#05)** — soigne le gel.
- **Baie Mepo (#06)** — restaure 10 PP à une capacité.
- **Baie Oran (#07)** — restaure 10 PV lorsqu'elle est consommée en combat ; l'effet se déclenche par le script de soin fixe, pas selon le seuil de Sitrus.
- **Baie Kika (#08)** — soigne la confusion.
- **Baie Prine (#09)** — soigne un problème de statut non-volatil ou la confusion.
- **Baie Sitrus (#10)** — restaure 1/4 des PV max lorsque les PV actuels sont inférieurs ou égaux à la moitié des PV max (script Platine : `HOLD_EFFECT_HP_PCT_RESTORE`, paramètre 25).

## 2. Soin conditionnel et confusion liée à la saveur (5)

Les données/scripts de Pokémon Platine (`src/battle/battle_lib.c`) déclenchent ces baies lorsque les PV actuels sont inférieurs ou égaux à la moitié des PV max. Elles restaurent 1/8 des PV max (paramètre d'objet 8). La confusion dépend de l'affinité de nature à la saveur correspondante. Elles rendent confus un Pokémon dont la nature n'aime pas la saveur correspondante.

- **Baie Figuy (#11)** — saveur épicée.
- **Baie Wiki (#12)** — saveur sèche.
- **Baie Mago (#13)** — saveur sucrée.
- **Baie Gowav (#14)** — saveur amère.
- **Baie Papaya (#15)** — saveur acide.

## 3. Baies d'ingrédients pour Poffins et culture (14)

Ces baies servent principalement à la culture et à la préparation de Poffins. Elles n'ont pas d'effet tactique automatique standard lorsqu'elles sont tenues en combat.

- **Baie Framby (#16)** — ingrédient de Poffins.
- **Baie Remu (#17)** — ingrédient de Poffins.
- **Baie Nanab (#18)** — ingrédient de Poffins.
- **Baie Repoi (#19)** — ingrédient de Poffins.
- **Baie Nanana (#20)** — ingrédient de Poffins.
- **Baie Siam (#27)** — ingrédient de Poffins.
- **Baie Mangou (#28)** — ingrédient de Poffins.
- **Baie Rabuta (#29)** — ingrédient de Poffins.
- **Baie Tronci (#30)** — ingrédient de Poffins.
- **Baie Kiwan (#31)** — ingrédient de Poffins.
- **Baie Palma (#32)** — ingrédient de Poffins.
- **Baie Stekpa (#33)** — ingrédient de Poffins.
- **Baie Durin (#34)** — ingrédient de Poffins.
- **Baie Myrte (#35)** — ingrédient de Poffins.

## 4. Baies qui diminuent les EV (6)

Chacune diminue de 10 les EV de la statistique indiquée, jusqu'à zéro si le total est inférieur à 10.

- **Baie Grena (#21)** — PV.
- **Baie Alga (#22)** — Attaque.
- **Baie Qualot (#23)** — Défense.
- **Baie Lonme (#24)** — Attaque Spéciale.
- **Baie Résin (#25)** — Défense Spéciale.
- **Baie Tamato (#26)** — Vitesse.

## 5. Baies de résistance aux attaques (17)

Réduit de moitié les dégâts d'une attaque du type correspondant qui serait super efficace contre le porteur. La baie est consommée à l'activation.

- **Baie Chocco (#36)** — Feu.
- **Baie Pocpoc (#37)** — Eau.
- **Baie Parma (#38)** — Électrik.
- **Baie Ratam (#39)** — Plante.
- **Baie Nanone (#40)** — Glace.
- **Baie Pomroz (#41)** — Combat.
- **Baie Kébia (#42)** — Poison.
- **Baie Jouca (#43)** — Sol.
- **Baie Cobaba (#44)** — Vol.
- **Baie Yapap (#45)** — Psy.
- **Baie Panga (#46)** — Insecte.
- **Baie Charti (#47)** — Roche.
- **Baie Sédra (#48)** — Spectre.
- **Baie Fraigo (#49)** — Dragon.
- **Baie Lampou (#50)** — Ténèbres.
- **Baie Babiri (#51)** — Acier.
- **Baie Zalis (#52)** — réduit de moitié les dégâts de la première attaque de type Normal reçue ; elle n'a pas besoin d'être super efficace.

## 6. Baies à déclenchement conditionnel ou effets spéciaux (8)

- **Baie Lichii (#53)** — augmente l'Attaque d'un niveau lorsque les PV sont inférieurs ou égaux à 1/4 des PV max.
- **Baie Lingan (#54)** — augmente la Défense d'un niveau lorsque les PV passent sous 1/4 des PV max.
- **Baie Sailak (#55)** — augmente la Vitesse d'un niveau lorsque les PV passent sous 1/4 des PV max.
- **Baie Pitaye (#56)** — augmente l'Attaque Spéciale d'un niveau lorsque les PV passent sous 1/4 des PV max.
- **Baie Abriko (#57)** — augmente la Défense Spéciale d'un niveau lorsque les PV passent sous 1/4 des PV max.
- **Baie Lansat (#58)** — augmente d'un niveau le taux de coups critiques lorsque les PV passent sous 1/4 des PV max.
- **Baie Frista (#59)** — augmente de deux niveaux une statistique lorsque les PV passent sous 1/4 des PV max.
- **Baie Enigma (#60)** — restaure 1/4 des PV max lorsque le porteur est touché par une attaque super efficace.

## 7. Baies ajoutées en 4G : précision, priorité et contrecoups (4)

- **Baie Micle (#61)** — lorsque les PV sont inférieurs ou égaux à 1/4 des PV max, augmente la précision de la prochaine capacité.
- **Baie Chérim (#62)** — lorsque les PV sont inférieurs ou égaux à 1/4 des PV max, permet au porteur d'agir en premier une fois.
- **Baie Jaboca (#63)** — inflige des dégâts à l'attaquant qui touche le porteur avec une capacité physique.
- **Baie Pommo (#64)** — inflige des dégâts à l'attaquant qui touche le porteur avec une capacité spéciale.

## Contrôle des totaux

- Soin/statut/PP : 10
- Soin conditionnel : 5
- Ingrédients Poffins/culture : 14
- Réduction d'EV : 6
- Résistance : 17
- Effets conditionnels/spéciaux (#53–60) : 8
- Effets ajoutés en 4G (#61–64) : 4
- **Total : 64 baies uniques**

## Règles pour le générateur

- Cette référence est documentaire ; ne pas afficher automatiquement les effets dans l'interface.
- Le pool d'objets tenus doit être séparé de la liste exhaustive des baies du jeu.
- Ne pas considérer les effets comme testés dans Project PM sans test spécifique de la ROM.


## Corrections relevées pendant l'audit initial

- Correction après recoupement : la Baie Chérim donne bien la priorité lorsque les PV passent sous 1/4 ; elle ne doit pas être décrite comme une baie de fuite.
- La Baie Micle est conditionnée par les PV bas ; elle ne doit pas être décrite comme un simple effet inconditionnel.
- Les seuils et les niveaux exacts des baies Frista/Lichii/Lingan/Sailak/Pitaye/Abriko/Lansat/Micle doivent être comparés aux données/scripts du jeu avant le statut CERTIFIÉ.
- Le tableau ci-dessus reste **documentaire, non certifié expérimentalement**. Les formulations qui nécessitent confirmation primaire sont explicitement signalées.


## Preuve primaire vérifiée — source de décompilation

Dépôt : https://github.com/pret/pokeplatinum
Fichier analysé : `src/battle/battle_lib.c` (branche main, consulté le 2026-10-19), plus définitions d'objets dans `res/items/data/*_berry.json`.

Constats confirmés dans les scripts/données du jeu :
- Les baies de saveur `HOLD_EFFECT_HP_RESTORE_SPICY/DRY/SWEET/BITTER/SOUR` déclenchent à `curHP <= maxHP / 2`; `effectParam: 8` donne 1/8 des PV max et le script contrôle la saveur/nature.
- La Baie Sitrus utilise `HOLD_EFFECT_HP_PCT_RESTORE`, `effectParam: 25`, déclenche à `curHP <= maxHP / 2` : soin d'un quart des PV max.
- Les effets de seuil de type `HOLD_EFFECT_PINCH_*` utilisent `curHP <= maxHP / itemPower`; les baies avec paramètre 4 s'activent donc à 1/4 des PV max. Le talent Gloutonnerie modifie ce seuil dans le code.
- Baie Frista : `HOLD_EFFECT_PINCH_RANDOM_UP`, paramètre 4 ; le code choisit une statistique au hasard et la monte de deux niveaux.
- Baie Micle : `HOLD_EFFECT_PINCH_ACC_UP`, paramètre 4.
- Baie Chérim : `HOLD_EFFECT_PINCH_PRIORITY`, paramètre 4.
- Baie Enigma : `HOLD_EFFECT_HP_RESTORE_SE`, paramètre 4 ; restaure 1/4 des PV max après une attaque super efficace.
- Baie Jaboca/Pommo : effets de contrecoup physique/spécial ; le code de combat les déclenche si l'attaque adverse touche.

Liens de preuve directe :
- https://github.com/pret/pokeplatinum/blob/main/src/battle/battle_lib.c
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/figy_berry.json
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/sitrus_berry.json
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/starf_berry.json
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/enigma_berry.json
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/micle_berry.json
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/custap_berry.json
- https://github.com/pret/pokeplatinum/blob/main/res/items/data/rowap_berry.json

Limite : cela certifie la logique lue dans la décompilation de Pokémon Platine pour ces effets, pas l'exécution dans une ROM binaire, ni les comportements du mod Project PM. Les effets des 64 baies ne sont pas encore tous certifiés individuellement.
