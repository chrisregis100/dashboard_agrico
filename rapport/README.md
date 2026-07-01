# Rapport de stage — version corrigée (LaTeX + PDF)

Rapport « Tableau de bord web pour l'analyse des ventes agricoles » (Groupe 29,
Licence 3 MIA, FAST — Université d'Abomey-Calavi), réécrit en LaTeX avec **toutes
les corrections de l'annexe d'audit Memoira (MEM-2526-011)** appliquées.

## Fichiers

- `rapport.tex` — source LaTeX complet et corrigé.
- `rapport.pdf` — PDF compilé (37 pages).
- `images/` — dossier réservé aux captures d'écran (figures 3.1, 4.1–4.3). Les
  figures manquantes sont représentées par des encadrés d'aperçu ; il suffit d'y
  déposer les images réelles et de remplacer les commandes `\apercu{...}` par des
  `\includegraphics{...}` pour les intégrer.

## Compilation

Toolchain requise : une distribution TeX Live avec le support du français
(`babel-french`) et les paquets `listings`, `booktabs`, `tabularx`, `hyperref`,
`lmodern`.

```bash
# Méthode recommandée (gère automatiquement les passes multiples)
latexmk -pdf rapport.tex

# Ou manuellement (deux passes pour la table des matières et les références)
pdflatex rapport.tex
pdflatex rapport.tex
```

Sur Debian/Ubuntu, l'environnement se met en place avec :

```bash
sudo apt-get install -y --no-install-recommends \
  texlive-latex-recommended texlive-latex-extra texlive-lang-french \
  texlive-fonts-recommended lmodern latexmk
```

## Corrections appliquées

### 33 corrections orthographiques / typographiques

| #  | Section | Correction |
|----|---------|------------|
| 1  | 4.3.5 / 4.4 | `ex. ?month=...` → `ex. : ?month=...` (deux-points après « ex. ») |
| 2  | Partout | `email` → `e-mail` (mot français) |
| 3  | 4.4 | `informa- tions` → `informations` (césure supprimée) |
| 4  | 5.2 | En-tête `No` → `N°` |
| 5  | 5.2 | `Admin2024!` → espace insécable avant `!` (typographie française) |
| 6  | 5.2 | `quantite : 25` → `quantité : 25` |
| 7  | 5.2 | `quantite : 0` → `quantité : 0` |
| 8  | 5.2 | `produitId : "invalide"` → `produitId : « invalide »` |
| 9  | 5.2 | `nom, prenom, ville` → `nom, prénom, ville` |
| 10 | 5.2 | `{nom seulement}` conservé avec accolades |
| 11 | 5.3 | `cross-origin` en italique |
| 12 | 5.3 | `'use client'` → `« use client »` |
| 13 | 5.3 | Passage vérifié (aucune faute) |
| 14 | 6.1 | Guillemets `« Dashboard AGRICO »` corrects |
| 15 | 6.2 | `sou- dure` → `soudure` |
| 16 | 6.2 | `confi- guration` → `configuration` |
| 17 | 6.2 | `tailwind.config.js` mis en `\texttt` |
| 18 | Annexe B | `Selectionnez un produit` → `Sélectionnez un produit` |
| 19 | Annexe B | `Selectionnez un client` → `Sélectionnez un client` |
| 20 | Annexe B | `La quantite doit etre positive` → `La quantité doit être positive` |
| 21 | Annexe B | `Vente enregistree avec succes` → `Vente enregistrée avec succès` |
| 22 | Annexe B | `Selecteurs produit , client , quantite` → `Sélecteurs produit, client, quantité` |
| 23 | Annexe B | Espaces parasites du code supprimés : `('/login', request.url)` |
| 24 | Annexe C | URL de clonage Git nettoyée (espaces parasites) |
| 25 | Annexe C | `une - cle - secrete - aleatoire` → `une-cle-secrete-aleatoire` |
| 26 | Annexe C | `npx prisma migrate dev` (aucune faute) |
| 27 | Annexe C | `Admin2024 !` — espace insécable avant `!` (table C.1) |
| 28 | Annexe C | `Vendeur2024 !` — espace insécable avant `!` (table C.1) |
| 29 | Annexe C | `FAST Université` → `FAST, Université` |
| 30 | 5.3 | `expi- rées` → `expirées` |
| 31 | 5.2 | URL corrigée : `GET /api/stats/summary?month=5&year=2026` |
| 32 | 5.2 | URL corrigée : `GET /api/stats/summary?month=12&year=2020` |
| 33 | 5.2 | URL corrigée : `GET /api/stats/charts?month=5&year=2026` |

> Les césures erronées (#3, #15, #16, #30) sont éliminées d'office car la coupure
> de mots est désormais gérée automatiquement par le moteur LaTeX (babel français).
> Les espaces insécables avant `! ? : ;` (#5, #27, #28) sont produits
> automatiquement par `babel-french`.

### 8 suggestions de réécriture

| #  | Section | Objet |
|----|---------|-------|
| 1  | 4.4 | « par simple copie d'URL » → « par simple copie de l'URL » |
| 2  | 4.4 | Phrase de description de la page principale restructurée (points-virgules) |
| 3  | 5.1 | Stratégie de test reformulée (suppression des répétitions de « vérifiant ») |
| 4  | 6.2 | Configuration de Better Auth reformulée |
| 5  | 6.2 | Génération des données de seed reformulée |
| 6  | 6.3 | « Travail collaboratif en groupe avec gestion de version Git » → « Travail collaboratif avec gestion de versions sous Git » |
| 7  | Annexe C | Pied de page : `FAST, Université d'Abomey-Calavi` |
| 8  | 6.2 | « calculs de statistiques … par multiple dimensions » → « calculs statistiques … selon de multiples dimensions » |

### Correction complémentaire de cohérence

Par souci d'uniformité avec les corrections #18–#21, la chaîne du middleware
d'authentification `"Non authentifie"` a été accentuée en `"Non authentifié"`.
