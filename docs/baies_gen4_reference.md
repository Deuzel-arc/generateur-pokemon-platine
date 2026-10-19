# Référence des baies — Pokémon Platine / génération IV

> Document de travail sauvegardé à partir de la liste classée. Les effets décrits sont ceux visés pour les mécaniques de génération IV. Avant toute utilisation automatique dans le moteur, les noms, les 64 entrées et les conditions exactes doivent être vérifiés contre une source de données de référence. Ce document n'est pas le pool d'objets sélectionnés par le générateur.

## 1. Soin et récupération (10)

- **Baie Oran** — restaure 10 PV lorsqu'elle est consommée en combat.
- **Baie Sitrus** — restaure 30 PV en 4G lorsque les PV du porteur sont à la moitié ou moins.
- **Baie Mepo** — restaure 10 PP à une capacité qui n'a plus de PP.
- **Baie Ceriz** — soigne la paralysie.
- **Baie Maron** — soigne le sommeil.
- **Baie Pêcha** — soigne l'empoisonnement.
- **Baie Fraive** — soigne la brûlure.
- **Baie Willia** — soigne le gel.
- **Baie Kika** — soigne la confusion.
- **Baie Prine** — soigne un problème de statut, y compris la confusion.

## 2. Soin conditionnel et confusion possible (5)

Ces baies restaurent 1/8 des PV max lorsque le porteur tombe à la moitié de ses PV ou moins. Selon la nature, elles peuvent provoquer la confusion.

- **Baie Figuy** — saveur épicée.
- **Baie Wiki** — saveur sèche.
- **Baie Mago** — saveur sucrée.
- **Baie Gowav** — saveur amère.
- **Baie Papaya** — saveur acide.

## 3. Résistance aux attaques (17)

Réduit de moitié les dégâts de la première attaque super efficace du type concerné. **Baie Zalis** est l'exception : elle réduit les dégâts d'une attaque Normal.

- **Baie Chocco** — Feu.
- **Baie Pocpoc** — Eau.
- **Baie Parma** — Électrik.
- **Baie Ratam** — Plante.
- **Baie Nanone** — Glace.
- **Baie Pomroz** — Combat.
- **Baie Kébia** — Poison.
- **Baie Jouca** — Sol.
- **Baie Cobaba** — Vol.
- **Baie Yapap** — Psy.
- **Baie Panga** — Insecte.
- **Baie Charti** — Roche.
- **Baie Sédra** — Spectre.
- **Baie Fraigo** — Dragon.
- **Baie Lampou** — Ténèbres.
- **Baie Babiri** — Acier.
- **Baie Zalis** — Normal.

## 4. Statistiques et effets conditionnels (9)

- **Baie Lichii** — augmente l'Attaque d'un niveau lorsque les PV sont bas.
- **Baie Lingan** — augmente la Défense d'un niveau lorsque les PV sont bas.
- **Baie Sailak** — augmente la Vitesse d'un niveau lorsque les PV sont bas.
- **Baie Pitaye** — augmente l'Attaque Spéciale d'un niveau lorsque les PV sont bas.
- **Baie Abriko** — augmente la Défense Spéciale d'un niveau lorsque les PV sont bas.
- **Baie Lansat** — augmente le taux de coups critiques lorsque les PV sont bas.
- **Baie Frista** — augmente plusieurs statistiques lorsque les PV sont bas.
- **Baie Micle** — augmente la précision de la prochaine capacité.
- **Baie Chérim** — effet de fuite indiqué dans la liste de travail, à vérifier avant intégration.

## 5. Réaction aux dégâts reçus (3)

- **Baie Enigma** — restaure des PV lorsque le Pokémon est touché par une attaque super efficace.
- **Baie Jaboca** — blesse l'adversaire qui touche le porteur avec une attaque physique.
- **Baie Pommo** — blesse l'adversaire qui touche le porteur avec une attaque spéciale.

## 6. Réduction des EV (6)

Ces baies diminuent de 10 EV la statistique indiquée, jusqu'à zéro si le total est inférieur à 10.

- **Baie Grena** — PV.
- **Baie Alga** — Attaque.
- **Baie Qualot** — Défense.
- **Baie Lonme** — Attaque Spéciale.
- **Baie Résin** — Défense Spéciale.
- **Baie Tamato** — Vitesse.

## 7. Culture et Poffins (14)

Ces baies sont principalement utiles pour la culture et la préparation de Poffins ; elles ne sont pas destinées par défaut au pool d'objets tenus en combat.

- **Baie Framby** — saveur épicée, culture et Poffins.
- **Baie Remu** — saveur sèche, culture et Poffins.
- **Baie Nanab** — saveur sucrée, culture et Poffins.
- **Baie Repoi** — saveur amère, culture et Poffins.
- **Baie Nanana** — saveur acide, culture et Poffins.
- **Baie Siam** — culture et Poffins.
- **Baie Mangou** — culture et Poffins.
- **Baie Rabuta** — culture et Poffins.
- **Baie Tronci** — culture et Poffins.
- **Baie Kiwan** — culture et Poffins.
- **Baie Palma** — culture et Poffins.
- **Baie Stekpa** — culture et Poffins.
- **Baie Durin** — culture et Poffins.
- **Baie Myrte** — culture et Poffins.

## Usage dans le générateur

- Cette référence ne doit pas afficher automatiquement les descriptions d'effets dans l'interface.
- Le fichier `data/berries_gen4.json` reste le catalogue tactique séparé utilisé comme base de travail.
- Ne pas intégrer automatiquement les baies de culture ou d'entraînement comme objets tenus sans validation.
- Avant certification, vérifier le nom français officiel, la disponibilité dans Pokémon Platine, le déclencheur exact en génération IV et les éventuelles exceptions.
