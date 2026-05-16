# Dashboard AGRICO

**Système de Gestion et d'Analyse de Ventes — AGRICO, Bénin**

Dashboard web complet pour la gestion commerciale et l'analyse des performances de vente de produits agroalimentaires (céréales, tubercules, maraîchage, fruits, oléagineux, légumineuses) à travers 6 villes du Bénin.

> Projet de formation — Full-stack Next.js + Express + PostgreSQL

---

## Sommaire

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
- [Démarrage rapide](#démarrage-rapide)
- [Comptes de démo](#comptes-de-démo)
- [Structure du repo](#structure-du-repo)
- [Scripts disponibles](#scripts-disponibles)
- [Déploiement](#déploiement)
- [Documentation par dossier](#documentation-par-dossier)
- [Roadmap](#roadmap)
- [Licence](#licence)

---

## Vue d'ensemble

AGRICO est une entreprise agroalimentaire basée au Bénin, opérant sur 6 villes : **Cotonou**, **Abomey-Calavi**, **Porto-Novo**, **Parakou**, **Bohicon** et **Ouidah**.

Le dashboard centralise :

- La gestion du catalogue de **10 produits** répartis en 6 catégories (céréales, tubercules, maraîchage, fruits, oléagineux, légumineuses)
- Le suivi de **40 clients** répartis sur les 6 villes
- L'enregistrement et la consultation des **ventes** avec calcul automatique du montant total
- Des **KPIs en temps réel** : chiffre d'affaires total, nombre de ventes, produit le plus vendu, tendance mensuelle
- Des **graphiques interactifs** : évolution du CA sur 24 mois, top 5 des produits, répartition par ville et par vendeur
- Un système d'**authentification par rôle** (admin / vendeur) avec cookies HTTP-only

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                 │  SQL    │                 │
│   Frontend      │────────▶│   Backend       │────────▶│  PostgreSQL     │
│   Next.js 16    │  :3000  │   Express 5     │  :4000  │  (Neon)         │
│   React 19      │◀────────│   Prisma 7      │◀────────│                 │
│   Tailwind 4    │  JSON   │   Better Auth   │  ORM    │                 │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           ▲
        │   /api/auth/*  (rewrite)  │
        └───────────────────────────┘
```

### Communication

| Flux | Mécanisme |
|------|-----------|
| Authentification | Cookies HTTP-only (`better-auth.session_token`), rewrite Next.js `/api/auth/*` → backend |
| Données métier | Requêtes `fetch` directes du frontend vers `NEXT_PUBLIC_API_URL` avec `credentials: "include"` |
| CORS | Configuré côté backend, autorise `FRONTEND_URL` |

---

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Frontend** | Next.js (App Router) | 16.2.6 |
| | React | 19.2.4 |
| | TypeScript | 5.x |
| | Tailwind CSS | 4.x |
| | shadcn/ui | 4.7.0 |
| | TanStack React Query | 5.100.10 |
| | Chart.js + react-chartjs-2 | 4.5.1 / 5.3.1 |
| | Better Auth (client) | 1.6.11 |
| | nuqs | 2.8.9 |
| | next-themes | 0.4.6 |
| **Backend** | Express | 5.2.1 |
| | TypeScript | 6.0.3 |
| | Prisma | 7.8.0 |
| | Better Auth | 1.6.11 |
| | Zod | 4.4.3 |
| | PostgreSQL (pg) | 8.20.0 |
| | Helmet | 8.1.0 |

---

## Prérequis

- **Node.js** >= 20
- **npm** (inclus avec Node.js)
- **PostgreSQL** — instance locale ou compte [Neon](https://neon.tech)

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd dashboard_agrico

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

---

## Configuration des variables d'environnement

Créer un fichier `.env` (ou `.env.local`) dans chaque dossier.

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL (ex. `postgresql://user:pass@host:5432/db`) |
| `BETTER_AUTH_SECRET` | Clé secrète pour la signature des tokens Better Auth |
| `BETTER_AUTH_URL` | URL publique du backend (ex. `http://localhost:4000`) |
| `FRONTEND_URL` | URL du frontend autorisée par CORS (ex. `http://localhost:3000`) |
| `PORT` | Port d'écoute du serveur (défaut : `4000`) |
| `NODE_ENV` | Environnement (`development` ou `production`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend (ex. `http://localhost:4000`) |
| `NEXT_PUBLIC_APP_URL` | URL publique du frontend (ex. `http://localhost:3000`) |

---

## Démarrage rapide

Depuis la racine du projet, exécuter les commandes dans l'ordre :

```bash
# 1. Générer le client Prisma
cd backend
npx prisma generate

# 2. Appliquer le schéma à la base de données
npx prisma db push        # développement rapide
# ou
npx prisma migrate dev    # avec historique de migration

# 3. Peupler la base avec les données de démo
npm run db:seed

# 4. Lancer le backend (terminal 1)
npm run dev

# 5. Lancer le frontend (terminal 2)
cd ../frontend
npm run dev
```

Le dashboard est accessible sur **http://localhost:3000**.

---

## Comptes de démo

Après exécution du seed (`npm run db:seed`), les comptes suivants sont disponibles :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@agrico.bj` | `Admin2024!` |
| Vendeur | 4 comptes vendeurs créés automatiquement | — |

L'admin a accès à l'ensemble des données. Les vendeurs voient les ventes de tous les utilisateurs.

---

## Structure du repo

```
dashboard_agrico/
├── backend/                 # API REST Express + Prisma
│   ├── prisma/              # Schéma et migrations
│   ├── src/                 # Code source TypeScript
│   │   ├── routes/          # Routes Express (clients, produits, sales, stats)
│   │   ├── middleware/      # Middlewares d'authentification
│   │   ├── lib/             # Singleton Prisma
│   │   ├── auth.ts          # Configuration Better Auth
│   │   ├── seed.ts          # Script de peuplement
│   │   └── index.ts         # Point d'entrée
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Application Next.js (App Router)
│   ├── app/                 # Pages et layouts
│   │   ├── (auth)/          # Routes publiques (login)
│   │   ├── (dashboard)/     # Routes protégées (dashboard, ventes)
│   │   ├── layout.tsx       # Root layout
│   │   ├── providers.tsx    # Providers React Query, nuqs, Toaster
│   │   └── globals.css      # Tailwind v4 + variables OKLCH
│   ├── components/          # Composants React
│   │   ├── ui/              # Primitives shadcn / Radix
│   │   ├── layout/          # Sidebar, TopBar, MonthYearFilter
│   │   ├── charts/          # Graphiques et KPIs
│   │   └── forms/           # Formulaires
│   ├── hooks/               # Hooks personnalisés
│   ├── lib/                 # Utilitaires (api, auth-client, utils)
│   ├── types/               # Types TypeScript
│   ├── middleware.ts         # Middleware d'authentification Next.js
│   ├── package.json
│   └── next.config.ts
├── render.yaml              # Configuration déploiement Render (backend)
├── .gitignore
└── README.md                # Ce fichier
```

---

## Scripts disponibles

### Backend

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `tsx watch src/index.ts` | Serveur de développement avec hot-reload |
| `build` | `tsc` | Compilation TypeScript |
| `start` | `node dist/index.js` | Lancement en production |
| `db:migrate` | `prisma migrate dev` | Créer et appliquer une migration |
| `db:push` | `prisma db push` | Synchroniser le schéma sans migration |
| `db:seed` | `tsx src/seed.ts` | Peupler la base de données |
| `db:generate` | `prisma generate` | Générer le client Prisma |

### Frontend

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `next dev` | Serveur de développement (port 3000) |
| `build` | `next build` | Build de production |
| `start` | `next start` | Lancement en production |
| `lint` | `eslint` | Vérification du code |

---

## Déploiement

### Backend — Render

Le fichier [`render.yaml`](./render.yaml) à la racine configure le déploiement du backend sur [Render](https://render.com) :

- **Build** : `npm install --include=dev && npx prisma generate && npm run build`
- **Start** : `node dist/index.js`
- **Variables** à définir dans Render : `DATABASE_URL`, `FRONTEND_URL`, `BETTER_AUTH_SECRET`

### Frontend — Vercel

La CLI Vercel est incluse dans les dépendances de développement du frontend.

```bash
cd frontend
vercel          # déploiement preview
vercel --prod   # déploiement production
```

Variables à définir dans le projet Vercel :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | URL du backend déployé sur Render |
| `NEXT_PUBLIC_APP_URL` | URL du frontend Vercel |

---

## Documentation par dossier

- [Backend — API REST Express + Prisma](./backend/README.md)
- [Frontend — Dashboard Next.js](./frontend/README.md)

---

## Roadmap

Améliorations envisageables pour les prochaines itérations :

- Ajout de tests unitaires et d'intégration (Vitest, Playwright)
- Gestion fine des rôles côté frontend (restrictions d'accès par rôle)
- Exports des données en CSV et PDF
- Notifications en temps réel (WebSocket)
- Tableau de bord personnalisable par utilisateur

---

## Licence

MIT — Projet de formation.
