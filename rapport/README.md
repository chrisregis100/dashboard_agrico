# Rapport de stage — version académique enrichie (LaTeX + PDF)

Rapport « Tableau de bord web pour l'analyse des ventes agricoles » (Groupe 29,
Licence 3 MIA, FAST — Université d'Abomey-Calavi), rédigé en LaTeX. Cette version
intègre l'ensemble des retours d'évaluation portant sur **le fond et la forme**,
en plus des corrections orthographiques et typographiques.

## Fichiers

- `rapport.tex` — source LaTeX complet.
- `rapport.pdf` — PDF compilé (~51 pages).
- `images/` — dossier réservé aux captures d'écran réelles. Les interfaces sont
  actuellement représentées par des **maquettes vectorielles** (figures dessinées
  en TikZ) ; il suffit d'y déposer les captures réelles et de remplacer le bloc
  `tikzpicture` correspondant par `\includegraphics{...}` pour les intégrer.

## Compilation

Toolchain requise : une distribution TeX Live avec le support du français
(`babel-french`) et les paquets `listings`, `booktabs`, `tabularx`, `hyperref`,
`caption`, `tikz`, `amssymb`, `enumitem`, `lmodern`.

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
  texlive-fonts-recommended texlive-pictures lmodern latexmk
```

## Améliorations de fond (retours académiques)

- **Introduction générale** distincte du chapitre 1.
- **Chapitre 1 enrichi** : question de recherche et sous-questions, trois
  hypothèses testables (H1–H3) avec critères de vérification, problématique
  justifiée par des constats sourcés.
- **Nouveau chapitre 2 — État de l'art et cadre théorique** : informatique
  décisionnelle (BI), indicateurs de performance (KPI), principes de
  visualisation (Bertin, Cleveland & McGill, Tufte), et **comparaison qualitative
  de Power BI, Tableau et Metabase**.
- **Nouveau chapitre 3 — Méthodologie** : démarche agile, méthode de conception
  des données (Merise), **critères d'évaluation mesurables** et protocole
  d'évaluation avec ses limites.
- **Chapitre 7 — Tests, résultats et discussion** : matrice de traçabilité
  objectif → fonctionnalité → test, **mesures de performance** (latence médiane
  et p95), **discussion critique** (confrontation aux objectifs, à l'état de
  l'art, limites) et **apport original** (prévision par moyenne mobile + alertes).
- **Conclusion générale** : retour réflexif sur la problématique et **bilan
  objectif par objectif**.

## Améliorations de forme

- **Glossaire et liste des acronymes** ; anglicismes signalés en italique.
- **Citations dans le corps du texte** (norme IEEE) et **références académiques**
  ajoutées (ouvrages et articles), en complément des documentations techniques.
- **Diagrammes vectoriels** : MCD et architecture redessinés en TikZ (remplacent
  l'ancien schéma ASCII) ; maquettes d'interface visibles.
- Légendes de tableaux et figures normalisées : « **Tableau N –** » / «
  **Figure N –** » (correction de l'anglicisme *Table* et du séparateur).
- **Résumé** complété d'un *Abstract* en anglais.

## Corrections orthographiques, grammaticales et typographiques (28 relevées)

Toutes les fautes ponctuelles signalées ont été traitées, notamment :

- suppression des virgules superflues avant le « et » final d'une énumération ;
- `credentials` → `identifiants` ;
- `décroissant` → `décroissants` (accord) ;
- `produitId : « invalide »` → `"invalide"` (guillemets droits en contexte code) ;
- « rendu serveur et client » → « rendu serveur et le rendu client » ;
- corrélation « depuis … jusqu'à … » reprise devant chaque complément ;
- `Table` → `Tableau` (partout, via `caption` + `babel`) et séparateur « – » ;
- `No` → `N°` ;
- espace fine insécable avant `! ? : ;` produite automatiquement par
  `babel-french` ; césures de fin de ligne gérées par le moteur LaTeX ;
- correction des littéraux de gabarit (backticks) dans les extraits de code.
