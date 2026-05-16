# Backend — API REST AGRICO

> API de gestion des ventes agricoles — Express 5, Prisma 7, PostgreSQL, Better Auth

Ce dossier contient l'API REST qui alimente le dashboard AGRICO. Elle expose les endpoints de gestion des produits, clients, ventes et statistiques, ainsi que l'authentification via Better Auth.

[← Retour au README principal](../README.md) · [Frontend →](../frontend/README.md)

---

## Sommaire

- [Stack](#stack)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Lancement](#lancement)
- [Architecture](#architecture)
- [Authentification](#authentification)
- [Référence API](#référence-api)
- [Données de seed](#données-de-seed)
- [Déploiement Render](#déploiement-render)
- [Conventions](#conventions)

---

## Stack

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| Framework HTTP | Express | 5.2.1 |
| Langage | TypeScript | 6.0.3 |
| ORM | Prisma | 7.8.0 |
| Base de données | PostgreSQL (pg) | 8.20.0 |
| Serverless DB | @neondatabase/serverless | 1.1.0 |
| Authentification | Better Auth | 1.6.11 |
| Validation | Zod | 4.4.3 |
| Sécurité | Helmet | 8.1.0 |
| CORS | cors | 2.8.6 |
| Logging | morgan | 1.10.1 |
| Env | dotenv | 17.4.2 |
| WebSocket | ws | 8.20.1 |
| Dev — runner | tsx | 4.22.0 |

---

## Prérequis

- **Node.js** >= 20
- **npm**
- **PostgreSQL** — instance locale ou compte [Neon](https://neon.tech)

---

## Installation locale

```bash
cd backend
npm install
```

La commande `postinstall` exécute automatiquement `prisma generate`.

---

## Variables d'environnement

Créer un fichier `.env` à la racine de `backend/` :

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
FRONTEND_URL=
PORT=
NODE_ENV=
```

| Variable | Obligatoire | Description |
|----------|:-----------:|-------------|
| `DATABASE_URL` | Oui | Chaîne de connexion PostgreSQL (ex. `postgresql://user:pass@host:5432/db`) |
| `BETTER_AUTH_SECRET` | Oui | Clé secrète pour la signature des sessions Better Auth |
| `BETTER_AUTH_URL` | Oui | URL publique du backend (ex. `http://localhost:4000`) |
| `FRONTEND_URL` | Oui | URL du frontend, utilisée pour CORS et `trustedOrigins` |
| `PORT` | Non | Port d'écoute (défaut : `4000`) |
| `NODE_ENV` | Non | `development` (défaut) ou `production` |

---

## Base de données

### Commandes Prisma

| Commande | Usage |
|----------|-------|
| `npx prisma generate` | Génère le client Prisma à partir du schéma |
| `npx prisma db push` | Synchronise le schéma avec la base (sans fichier de migration) |
| `npx prisma migrate dev` | Crée et applique une migration (avec historique) |
| `npm run db:seed` | Peuple la base avec les données de démonstration |
| `npx prisma studio` | Interface visuelle pour explorer les données |

Le schéma Prisma se trouve dans [`prisma/schema.prisma`](./prisma/schema.prisma).

### Modèles métier

| Modèle | Champs principaux | Description |
|--------|-------------------|-------------|
| `Produit` | `id` (cuid), `nom`, `categorie`, `prixUnitaire`, `ventes[]` | Catalogue de produits agricoles |
| `Client` | `id` (cuid), `nom`, `prenom`, `ville`, `ventes[]` | Clients répartis sur 6 villes |
| `Vente` | `id` (cuid), `produitId`, `vendeurId`, `clientId`, `quantite`, `dateVente`, `montantTotal`, `createdAt` | Enregistrement d'une vente avec calcul automatique du montant |

**Index** sur `Vente` : `dateVente`, `vendeurId`, `produitId`.

### Modèles Better Auth

| Modèle | Rôle |
|--------|------|
| `User` | Utilisateur avec champ additionnel `role` (`"admin"` ou `"vendeur"`) et relation `ventes[]` |
| `Session` | Session active liée à un utilisateur |
| `Account` | Compte d'authentification (email/password) |
| `Verification` | Jetons de vérification |

---

## Lancement

```bash
# Développement (hot-reload)
npm run dev

# Build de production
npm run build

# Lancement en production
npm start
```

Le serveur écoute par défaut sur **http://localhost:4000**.

---

## Architecture

```
src/
├── index.ts              # Point d'entrée : Express, middlewares, routes
├── auth.ts               # Configuration Better Auth
├── seed.ts               # Script de peuplement de la base
├── lib/
│   └── prisma.ts         # Singleton PrismaClient
├── middleware/
│   └── auth.ts           # requireSession, requireRole
└── routes/
    ├── clients.ts        # CRUD clients
    ├── produits.ts       # Liste des produits
    ├── sales.ts          # CRUD ventes
    └── stats.ts          # KPIs et données graphiques
```

### Point d'entrée (`index.ts`)

Middlewares globaux chargés dans l'ordre :

1. `helmet()` — en-têtes de sécurité HTTP
2. `cors({ origin: FRONTEND_URL, credentials: true })` — autorisation cross-origin
3. `morgan('dev')` — logs des requêtes
4. `express.json()` — parsing du body JSON

---

## Authentification

### Configuration Better Auth

```typescript
betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: { enabled: true, autoSignIn: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "vendeur", input: false }
    }
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
  // cookies: httpOnly true, secure (prod), sameSite "none" (prod) / "lax" (dev)
})
```

### Flux d'authentification

1. **Inscription** : `POST /api/auth/sign-up/email` → création utilisateur + session + cookie `better-auth.session_token`
2. **Connexion** : `POST /api/auth/sign-in/email` → vérification des identifiants + cookie
3. **Session** : `GET /api/auth/get-session` → données utilisateur si cookie valide
4. **Déconnexion** : `POST /api/auth/sign-out` → suppression du cookie

### Middlewares

| Middleware | Rôle |
|------------|------|
| `requireSession` | Vérifie la présence d'une session valide, attache `req.user` et `req.session` |
| `requireRole(...roles)` | Vérifie que `req.user.role` fait partie de la liste autorisée |

---

## Référence API

### Vue d'ensemble

| Méthode | Chemin | Auth | Description |
|---------|--------|:----:|-------------|
| `GET` | `/api/health` | Non | Health check |
| `ALL` | `/api/auth/*` | — | Endpoints Better Auth (inscription, connexion, session, déconnexion) |
| `GET` | `/api/produits` | Oui | Liste des produits |
| `GET` | `/api/clients` | Oui | Liste des clients |
| `POST` | `/api/clients` | Oui | Créer un client |
| `GET` | `/api/sales` | Oui | Liste des ventes (filtres + pagination) |
| `POST` | `/api/sales` | Oui | Enregistrer une vente |
| `GET` | `/api/stats/summary` | Oui | KPIs du dashboard |
| `GET` | `/api/stats/charts` | Oui | Données pour les graphiques |

---

### `GET /api/health`

Health check sans authentification.

**Réponse :**

```json
{ "status": "ok" }
```

---

### `GET /api/produits`

Retourne la liste complète des produits.

**Réponse :**

```json
[
  {
    "id": "clx...",
    "nom": "Maïs",
    "categorie": "Céréales",
    "prixUnitaire": 350
  }
]
```

---

### `GET /api/clients`

Retourne la liste complète des clients.

**Réponse :**

```json
[
  {
    "id": "clx...",
    "nom": "Ahouandjinou",
    "prenom": "Marcel",
    "ville": "Cotonou"
  }
]
```

---

### `POST /api/clients`

Crée un nouveau client. Validation Zod en entrée.

**Body :**

```json
{
  "nom": "Dossou",
  "prenom": "Fiacre",
  "ville": "Porto-Novo"
}
```

**Réponse :** l'objet client créé.

```json
{
  "id": "clx...",
  "nom": "Dossou",
  "prenom": "Fiacre",
  "ville": "Porto-Novo"
}
```

---

### `GET /api/sales`

Liste les ventes avec filtres optionnels et pagination.

**Query params :**

| Param | Type | Description |
|-------|------|-------------|
| `month` | `number` | Mois (1–12) |
| `year` | `number` | Année |
| `vendeurId` | `string` | Filtrer par vendeur |
| `page` | `number` | Page (pagination) |
| `limit` | `number` | Nombre de résultats par page |

**Réponse :**

```json
{
  "data": [
    {
      "id": "clx...",
      "quantite": 25,
      "montantTotal": 8750,
      "dateVente": "2026-03-15T00:00:00.000Z",
      "produit": { "nom": "Maïs", "categorie": "Céréales" },
      "client": { "nom": "Dossou", "prenom": "Fiacre", "ville": "Porto-Novo" },
      "vendeur": { "name": "Adéchina Koffi" }
    }
  ],
  "total": 604,
  "page": 1,
  "limit": 20
}
```

---

### `POST /api/sales`

Enregistre une nouvelle vente. Le `montantTotal` est calculé automatiquement (quantité × prix unitaire du produit). Le `vendeurId` correspond à l'utilisateur authentifié.

**Body (validation Zod) :**

```json
{
  "produitId": "clx...",
  "clientId": "clx...",
  "quantite": 15,
  "dateVente": "2026-05-16"
}
```

**Réponse :** l'objet vente créé avec le `montantTotal` calculé.

```json
{
  "id": "clx...",
  "produitId": "clx...",
  "vendeurId": "clx...",
  "clientId": "clx...",
  "quantite": 15,
  "montantTotal": 5250,
  "dateVente": "2026-05-16T00:00:00.000Z",
  "createdAt": "2026-05-16T14:30:00.000Z"
}
```

---

### `GET /api/stats/summary`

Retourne les indicateurs clés du dashboard.

**Réponse :**

```json
{
  "caTotal": 12450000,
  "nbVentes": 604,
  "produitTopName": "Maïs",
  "trendVsPrevMonth": 12.5
}
```

| Champ | Description |
|-------|-------------|
| `caTotal` | Chiffre d'affaires total (somme des `montantTotal`) |
| `nbVentes` | Nombre total de ventes |
| `produitTopName` | Nom du produit le plus vendu |
| `trendVsPrevMonth` | Variation en pourcentage par rapport au mois précédent |

---

### `GET /api/stats/charts`

Retourne les jeux de données pour les graphiques du dashboard.

**Réponse :**

```json
{
  "evolutionCA": [
    { "mois": "2024-06", "ca": 520000 },
    { "mois": "2024-07", "ca": 480000 }
  ],
  "top5Produits": [
    { "nom": "Maïs", "totalVentes": 2500000 }
  ],
  "ventesParVille": [
    { "ville": "Cotonou", "total": 3200000 }
  ],
  "ventesParVendeur": [
    { "vendeur": "Adéchina Koffi", "total": 1800000 }
  ]
}
```

| Champ | Description |
|-------|-------------|
| `evolutionCA` | CA mensuel sur 24 mois (juin 2024 → mai 2026) |
| `top5Produits` | Les 5 produits avec le plus de ventes en valeur |
| `ventesParVille` | Répartition du CA par ville |
| `ventesParVendeur` | Répartition du CA par vendeur |

---

## Données de seed

Le script `npm run db:seed` insère les données suivantes :

| Donnée | Quantité | Détail |
|--------|----------|--------|
| Utilisateurs | 5 | 1 admin + 4 vendeurs |
| Produits | 10 | Maïs, Riz local, Manioc, Igname, Tomate, Piment, Ananas, Noix de palme, Soja, Arachide |
| Clients | 40 | Cotonou (12), Abomey-Calavi (8), Porto-Novo (7), Parakou (5), Bohicon (4), Ouidah (4) |
| Ventes | ~604 | Sur 24 mois (juin 2024 → mai 2026), saisonnalité récolte (pics oct–déc, mar–avr) |

### Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@agrico.bj` | `Admin2024!` |
| Vendeur | 4 comptes créés automatiquement | — |

---

## Déploiement Render

Le fichier [`render.yaml`](../render.yaml) à la racine du projet configure le déploiement :

| Paramètre | Valeur |
|-----------|--------|
| Type | Web Service |
| Root Directory | `backend` |
| Build | `npm install --include=dev && npx prisma generate && npm run build` |
| Start | `node dist/index.js` |

**Variables à déclarer manuellement dans Render :**

| Variable | Synchronisation |
|----------|:--------------:|
| `DATABASE_URL` | Manuel |
| `FRONTEND_URL` | Manuel |
| `BETTER_AUTH_SECRET` | Manuel |

---

## Conventions

- **ESM** : modules ECMAScript (`import` / `export`)
- **TypeScript strict** : pas de `any`, pas de `@ts-ignore`
- **Validation Zod** : en entrée de chaque route de mutation (`POST`, `PUT`, `PATCH`)
- **Gestion d'erreurs** : early returns, codes HTTP appropriés, messages explicites
