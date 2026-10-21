# Reprise vérifiable — objets témoins CPUF (21 octobre 2026)

## Résultat réellement reproductible

L'archive de données décodées conservée dans la Bibliothèque a été rematérialisée et inspectée : `rom_decoded_core_tables.zip`. Elle contient `platinum/itemtool__itemdata__pl_item_data.narc.json`, avec 446 enregistrements hexadécimaux de 34 octets, et `platinum/items.json`, dont les champs `raw` concordent structurellement avec ces enregistrements.

Les huit octets ROM cités dans le rapport précédent ont été comparés aux index de cette archive extraite :
- index 1 : Master Ball
- index 2 : Ultra Ball
- index 17 : Potion
- index 113 : Adamant Orb
- index 228 : Dragon Fang
- index 278 : Zap Plate
- index 328 : CT23
- index 445 : Secret Key

Résultat : les huit chaînes hexadécimales du rapport correspondent bien aux huit enregistrements de l'export extrait (8/8, 272/272 octets). Cette vérification est reproductible à partir de l'export JSON et confirme que les valeurs citées sont présentes dans l'export.

## Limite essentielle

Ce contrôle ne prouve pas à lui seul que les 34 octets ont été reconstruits indépendamment depuis chacun des JSON canoniques de `pret/pokeplatinum`. Le comparateur existant `scripts/audit-item-archive-mapping.mjs` le précise lui-même : il vérifie la cohérence des exports et le mapping candidat, pas la reconstruction complète `ItemData` depuis les fichiers source. La certification source → binaire reste donc **non acquise**.

## Suite de l'étape 1

1. Conserver le résultat 8/8 comme contrôle des valeurs de l'export, sans le présenter comme une reconstruction source indépendante.
2. Implémenter un encodeur reproductible des champs `ItemData` en reproduisant `proc_item`, `proc_params`, les énumérations et le packing des bitfields.
3. Tester l'encodeur sur les huit témoins.
4. Étendre aux 446 enregistrements CPUF, puis auditer CPUE séparément (470 entrées).
5. Maintenir les noms et effets des entrées CPUE supplémentaires comme non résolus tant qu'ils ne sont pas vérifiés.

Le mapping reste candidat et aucun effet d'objet n'est certifié par cette vérification.
