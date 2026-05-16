# Frontend — Dashboard AGRICO

> Dashboard Next.js 16 + React 19 + Tailwind 4 pour AGRICO

Application web de visualisation et de gestion des ventes agricoles. Interface responsive avec graphiques interactifs, gestion des ventes et authentification intégrée.

[← Retour au README principal](../README.md) · [Backend →](../backend/README.md)

---

## Sommaire

- [Stack](#stack)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement](#lancement)
- [Architecture App Router](#architecture-app-router)
- [Composants](#composants)
- [Helpers et utilitaires](#helpers-et-utilitaires)
- [Authentification](#authentification)
- [Data fetching](#data-fetching)
- [State URL](#state-url)
- [Theming](#theming)
- [Visualisations](#visualisations)
- [Conventions](#conventions)
- [Déploiement Vercel](#déploiement-vercel)

---

## Stack

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| UI Runtime | React | 19.2.4 |
| Langage | TypeScript | 5.x |
| Style | Tailwind CSS | 4.x |
| PostCSS | @tailwindcss/postcss | 4.x |
| Composants | shadcn/ui | 4.7.0 |
| Base UI | @base-ui/react | 1.4.1 |
| Auth | Better Auth (client) | 1.6.11 |
| Data fetching | TanStack React Query | 5.100.10 |
| Formulaires | react-hook-form | 7.75.0 |
| Résolveurs | @hookform/resolvers | 5.2.2 |
| Validation | Zod | 4.4.3 |
| State URL | nuqs | 2.8.9 |
| Graphiques | Chart.js | 4.5.1 |
| Graphiques React | react-chartjs-2 | 5.3.1 |
| Icônes | @deemlol/next-icons | 0.2.7 |
| Icônes (complément) | lucide-react | 1.16.0 |
| Thème | next-themes | 0.4.6 |
| Notifications | sonner | 2.0.7 |
| Utilitaires CSS | clsx | 2.1.1 |
| Fusion classes | tailwind-merge | 3.6.0 |
| Variants | class-variance-authority (CVA) | 0.7.1 |
| Animation | tw-animate-css | 1.4.0 |
| Dev — lint | eslint + eslint-config-next | 9.x / 16.2.6 |
| Dev — deploy | Vercel CLI | 54.0.0 |

---

## Prérequis

- **Node.js** >= 20
- **npm**
- Backend AGRICO en cours d'exécution (voir [backend/README.md](../backend/README.md))

---

## Installation

```bash
cd frontend
npm install
```

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine de `frontend/` :

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend (ex. `http://localhost:4000`) |
| `NEXT_PUBLIC_APP_URL` | URL publique du frontend (ex. `http://localhost:3000`), utilisée par le client Better Auth |

---

## Lancement

```bash
# Développement
npm run dev

# Build de production
npm run build

# Lancement en production
npm start

# Vérification du code
npm run lint
```

Le dashboard est accessible sur **http://localhost:3000**.

---

## Architecture App Router

```
app/
├── layout.tsx              # Root layout (fonts Geist, metadata)
├── globals.css             # Tailwind v4 + variables OKLCH + shadcn
├── providers.tsx           # QueryClient, NuqsAdapter, Toaster
├── (auth)/                 # Groupe de routes publiques
│   ├── layout.tsx          # Layout centré pour l'authentification
│   └── login/
│       └── page.tsx        # Page de connexion
├── (dashboard)/            # Groupe de routes protégées
│   ├── layout.tsx          # Layout avec Sidebar + TopBar
│   ├── page.tsx            # Dashboard principal (KPIs + graphiques)
│   └── ventes/
│       └── page.tsx        # Gestion des ventes (tableau + formulaire)
middleware.ts               # Garde d'authentification
```

### Route groups

| Groupe | Rôle | Accès |
|--------|------|-------|
| `(auth)` | Pages d'authentification (login) | Public |
| `(dashboard)` | Pages métier (dashboard, ventes) | Authentifié uniquement |

### Middleware d'authentification

Le fichier `middleware.ts` intercepte chaque requête :

- **Sans cookie** `better-auth.session_token` → redirection vers `/login`
- **Avec cookie** sur `/login` → redirection vers `/` (dashboard)

---

## Composants

### Primitives UI (`components/ui/`)

Composants shadcn/Radix réutilisables :

| Composant | Fichier | Usage |
|-----------|---------|-------|
| Badge | `badge.tsx` | Labels de catégorie, statuts |
| Button | `button.tsx` | Actions principales et secondaires |
| Card | `card.tsx` | Conteneurs de KPIs et sections |
| Dialog | `dialog.tsx` | Modales (création client inline) |
| Dropdown Menu | `dropdown-menu.tsx` | Menus contextuels |
| Input | `input.tsx` | Champs de saisie |
| Label | `label.tsx` | Labels de formulaire |
| Select | `select.tsx` | Listes déroulantes |
| Separator | `separator.tsx` | Séparateurs visuels |
| Sheet | `sheet.tsx` | Panneaux latéraux (navigation mobile) |
| Sidebar | `sidebar.tsx` | Navigation latérale |
| Skeleton | `skeleton.tsx` | Placeholders de chargement |
| Sonner | `sonner.tsx` | Notifications toast |
| Table | `table.tsx` | Tableaux de données |
| Tooltip | `tooltip.tsx` | Info-bulles |

### Layout (`components/layout/`)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| AppSidebar | `Sidebar.tsx` | Barre latérale de navigation principale avec liens dashboard et ventes |
| TopBar | `TopBar.tsx` | Barre supérieure avec titre de page, info utilisateur et déconnexion |
| MonthYearFilter | `MonthYearFilter.tsx` | Sélecteur mois/année pour filtrer les données du dashboard |

### Graphiques (`components/charts/`)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| KpiCard | `KpiCard.tsx` | Carte d'indicateur clé (CA total, nombre de ventes, tendance) |
| EvolutionChart | `EvolutionChart.tsx` | Courbe d'évolution du chiffre d'affaires sur 24 mois |
| Top5ProduitsChart | `Top5ProduitsChart.tsx` | Barres horizontales des 5 produits les plus vendus |
| VillesChart | `VillesChart.tsx` | Répartition des ventes par ville |
| VendeursChart | `VendeursChart.tsx` | Répartition des ventes par vendeur |
| RecentSalesTable | `RecentSalesTable.tsx` | Tableau des 10 dernières ventes enregistrées |

### Formulaires (`components/forms/`)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| SaleForm | `SaleForm.tsx` | Formulaire de création de vente : sélection produit, client, quantité, date. Inclut la création de client inline via une modale. Utilise react-hook-form + Zod. |

---

## Helpers et utilitaires

### `lib/api.ts` — Fetch wrapper

```typescript
apiFetch<T>(path: string, options?: RequestInit): Promise<T>
```

Wrapper autour de `fetch` avec :

- `credentials: "include"` pour transmettre les cookies d'authentification
- Header `Content-Type: application/json`
- Base URL configurée via `NEXT_PUBLIC_API_URL` (fallback `http://localhost:4000`)

### `lib/auth-client.ts` — Better Auth React

```typescript
const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})

export const { signIn, signOut, useSession } = authClient
```

Exports principaux : `signIn`, `signOut`, `useSession`.

### `lib/utils.ts` — Utilitaires CSS

```typescript
function cn(...inputs: ClassValue[]): string
```

Combine `clsx` et `tailwind-merge` pour la fusion conditionnelle de classes Tailwind.

### Hooks (`hooks/`)

| Hook | Fichier | Description |
|------|---------|-------------|
| `useSummary` | `use-dashboard-data.ts` | KPIs du dashboard via TanStack Query |
| `useCharts` | `use-dashboard-data.ts` | Données des graphiques via TanStack Query |
| `useRecentSales` | `use-dashboard-data.ts` | 10 dernières ventes via TanStack Query |
| `useIsMobile` | `use-mobile.ts` | Détection mobile (breakpoint 768px) |

### Types (`types/api.ts`)

| Type | Champs principaux |
|------|-------------------|
| `SalesSummary` | `caTotal`, `nbVentes`, `produitTopName`, `trendVsPrevMonth` |
| `ChartData` | `evolutionCA`, `top5Produits`, `ventesParVille`, `ventesParVendeur` |
| `Vente` | `id`, `quantite`, `montantTotal`, `dateVente`, `produit`, `client`, `vendeur` |
| `SalesResponse` | `data: Vente[]`, `total`, `page`, `limit` |
| `Produit` | `id`, `nom`, `categorie`, `prixUnitaire` |
| `Client` | `id`, `nom`, `prenom`, `ville` |

---

## Authentification

### Client Better Auth

Le frontend utilise le client React de Better Auth, configuré dans `lib/auth-client.ts` :

- **`signIn.email({ email, password })`** — connexion par email/mot de passe
- **`signOut()`** — déconnexion (suppression du cookie)
- **`useSession()`** — hook React qui retourne la session courante et l'état de chargement

### Cookie et rewrite

Le cookie `better-auth.session_token` est défini en HTTP-only par le backend. Pour que le client Better Auth puisse communiquer avec le backend, un **rewrite Next.js** est configuré dans `next.config.ts` :

```typescript
async rewrites() {
  return [
    {
      source: "/api/auth/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`
    }
  ]
}
```

Le client envoie ses requêtes auth vers `/api/auth/*` (même origine), qui sont redirigées de manière transparente vers le backend.

### Middleware Next.js

Le fichier `middleware.ts` protège les routes du groupe `(dashboard)` :

1. Vérifie la présence du cookie `better-auth.session_token`
2. **Absent** → redirection vers `/login`
3. **Présent** et URL = `/login` → redirection vers `/`

---

## Data fetching

### Pattern TanStack React Query

Les données sont récupérées via des hooks TanStack Query définis dans `hooks/use-dashboard-data.ts` :

```typescript
const { data, isLoading, error } = useSummary()
const { data: charts } = useCharts()
const { data: sales } = useRecentSales()
```

Chaque hook utilise `apiFetch` en interne et gère automatiquement le cache, la revalidation et les états de chargement.

### Endpoints consommés

| Hook / Composant | Endpoint | Usage |
|-------------------|----------|-------|
| `useSummary` | `GET /api/stats/summary` | KPIs du dashboard |
| `useCharts` | `GET /api/stats/charts` | Données pour les 4 graphiques |
| `useRecentSales` | `GET /api/sales?limit=10` | Tableau des ventes récentes |
| `SaleForm` | `GET /api/produits` | Liste déroulante des produits |
| `SaleForm` | `GET /api/clients` | Liste déroulante des clients |
| `SaleForm` | `POST /api/sales` | Création d'une vente |
| `SaleForm` | `POST /api/clients` | Création d'un client inline |

---

## State URL

Le composant `MonthYearFilter` utilise **nuqs** pour synchroniser les filtres mois/année avec les paramètres d'URL :

```
/ventes?month=3&year=2026
```

Cela permet de partager un lien filtré et de conserver l'état lors de la navigation.

---

## Theming

### Tailwind CSS v4 + shadcn

Le thème est configuré dans `globals.css` via des variables CSS au format **OKLCH** :

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

:root {
  --background: /* oklch */;
  --foreground: /* oklch */;
  --primary: /* oklch */;
  --secondary: /* oklch */;
  --accent: /* oklch */;
  --muted: /* oklch */;
  --destructive: /* oklch */;
  --border: /* oklch */;
  --input: /* oklch */;
  --ring: /* oklch */;
  --chart-1: /* oklch */;
  --chart-2: /* oklch */;
  --chart-3: /* oklch */;
  --chart-4: /* oklch */;
  --chart-5: /* oklch */;
  --sidebar-background: /* oklch */;
  --sidebar-foreground: /* oklch */;
  --radius: 0.625rem;
}
```

### Configuration shadcn

Le fichier `components.json` définit :

| Paramètre | Valeur |
|-----------|--------|
| Style | `base-nova` |
| Base color | `neutral` |
| CSS Variables | `true` |
| Icon library | `lucide` |

### Dark mode

Le dark mode est géré via **next-themes** et la classe `.dark` appliquée au `<html>`. Les variables CSS sont redéfinies dans le sélecteur `.dark` de `globals.css`.

### Alias de chemins

| Alias | Chemin |
|-------|--------|
| `@/components` | `./components` |
| `@/components/ui` | `./components/ui` |
| `@/lib` | `./lib` |
| `@/lib/utils` | `./lib/utils` |
| `@/hooks` | `./hooks` |

---

## Visualisations

Les graphiques utilisent **Chart.js 4.5.1** via **react-chartjs-2 5.3.1** :

| Graphique | Composant | Type Chart.js | Description |
|-----------|-----------|---------------|-------------|
| Évolution du CA | `EvolutionChart` | Line | Courbe mensuelle sur 24 mois |
| Top 5 produits | `Top5ProduitsChart` | Bar (horizontal) | Classement des produits par chiffre d'affaires |
| Ventes par ville | `VillesChart` | Doughnut / Bar | Répartition géographique des ventes |
| Ventes par vendeur | `VendeursChart` | Bar | Performance commerciale par vendeur |
| Ventes récentes | `RecentSalesTable` | Table HTML | 10 dernières ventes enregistrées |

---

## Conventions

- **RSC par défaut** : tous les composants sont des Server Components sauf indication contraire
- **`'use client'`** : uniquement sur les composants feuilles nécessitant de l'interactivité (hooks, événements DOM)
- **Icônes** : `@deemlol/next-icons` en priorité, `lucide-react` en complément
- **Fusion de classes** : `cn()` de `lib/utils.ts` pour toute combinaison conditionnelle
- **Mobile-first** : classes Tailwind sans préfixe, puis `md:`, `lg:` pour les écrans larges
- **Named exports** : pas de `export default` seul sur les composants

---

## Déploiement Vercel

La CLI Vercel est disponible en dépendance de développement.

```bash
cd frontend
vercel          # déploiement preview
vercel --prod   # déploiement production
```

### Variables à définir dans le projet Vercel

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | URL du backend déployé (ex. Render) |
| `NEXT_PUBLIC_APP_URL` | URL du frontend Vercel |
