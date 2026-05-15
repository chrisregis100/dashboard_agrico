import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import { auth } from "./auth.js";

// ---------------------------------------------------------------------------
// Seeded LCG PRNG — deterministic output for every run
// ---------------------------------------------------------------------------
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967295;
  };
}

function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function randomInt(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function randomDate(year: number, month: number, rng: () => number): Date {
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = randomInt(1, daysInMonth, rng);
  const hours = randomInt(7, 18, rng);
  const minutes = randomInt(0, 59, rng);
  return new Date(year, month - 1, day, hours, minutes);
}

// ---------------------------------------------------------------------------
// Static seed data
// ---------------------------------------------------------------------------
const USERS = [
  {
    name: "Admin AGRICO",
    email: "admin@agrico.bj",
    password: "Admin2024!",
    role: "admin",
  },
  {
    name: "Koffi Mensah",
    email: "koffi@agrico.bj",
    password: "Vendeur2024!",
    role: "vendeur",
  },
  {
    name: "Aïcha Dossou",
    email: "aicha@agrico.bj",
    password: "Vendeur2024!",
    role: "vendeur",
  },
  {
    name: "Yves Ahouandjinou",
    email: "yves@agrico.bj",
    password: "Vendeur2024!",
    role: "vendeur",
  },
  {
    name: "Grâce Houngbédji",
    email: "grace@agrico.bj",
    password: "Vendeur2024!",
    role: "vendeur",
  },
] as const;

const PRODUITS = [
  { nom: "Maïs", categorie: "Céréales", prixUnitaire: 250 },
  { nom: "Riz local", categorie: "Céréales", prixUnitaire: 450 },
  { nom: "Manioc", categorie: "Tubercules", prixUnitaire: 150 },
  { nom: "Igname", categorie: "Tubercules", prixUnitaire: 350 },
  { nom: "Tomate", categorie: "Maraîchage", prixUnitaire: 500 },
  { nom: "Piment", categorie: "Maraîchage", prixUnitaire: 600 },
  { nom: "Ananas", categorie: "Fruits", prixUnitaire: 300 },
  { nom: "Noix de palme", categorie: "Oléagineux", prixUnitaire: 200 },
  { nom: "Soja", categorie: "Légumineuses", prixUnitaire: 400 },
  { nom: "Arachide", categorie: "Légumineuses", prixUnitaire: 280 },
] as const;

const CLIENTS = [
  // 12 × Cotonou
  { nom: "Ahouandjinou", prenom: "Firmin", ville: "Cotonou" },
  { nom: "Dossou", prenom: "Carine", ville: "Cotonou" },
  { nom: "Zinsou", prenom: "Pascal", ville: "Cotonou" },
  { nom: "Agbossou", prenom: "Edwige", ville: "Cotonou" },
  { nom: "Sènou", prenom: "Rodrigue", ville: "Cotonou" },
  { nom: "Kpossou", prenom: "Lucie", ville: "Cotonou" },
  { nom: "Gbèhounou", prenom: "David", ville: "Cotonou" },
  { nom: "Houngbédji", prenom: "Mireille", ville: "Cotonou" },
  { nom: "Akpaki", prenom: "Gontrand", ville: "Cotonou" },
  { nom: "Vodounou", prenom: "Isabelle", ville: "Cotonou" },
  { nom: "Azondekon", prenom: "Théodore", ville: "Cotonou" },
  { nom: "Sèdogbé", prenom: "Nadège", ville: "Cotonou" },
  // 8 × Abomey-Calavi
  { nom: "Tossoukpè", prenom: "Jocelyn", ville: "Abomey-Calavi" },
  { nom: "Agbodji", prenom: "Félicienne", ville: "Abomey-Calavi" },
  { nom: "Djènontin", prenom: "Valentin", ville: "Abomey-Calavi" },
  { nom: "Kéké", prenom: "Bernadette", ville: "Abomey-Calavi" },
  { nom: "Houndété", prenom: "Clovis", ville: "Abomey-Calavi" },
  { nom: "Gnanvo", prenom: "Delphine", ville: "Abomey-Calavi" },
  { nom: "Tchédji", prenom: "Serge", ville: "Abomey-Calavi" },
  { nom: "Fagnon", prenom: "Alphonsine", ville: "Abomey-Calavi" },
  // 7 × Porto-Novo
  { nom: "Adékambi", prenom: "Sylvain", ville: "Porto-Novo" },
  { nom: "Gbèdo", prenom: "Victorine", ville: "Porto-Novo" },
  { nom: "Goudou", prenom: "Félix", ville: "Porto-Novo" },
  { nom: "Dèkponu", prenom: "Anastasie", ville: "Porto-Novo" },
  { nom: "Hounkonnou", prenom: "Alexis", ville: "Porto-Novo" },
  { nom: "Médé", prenom: "Rosalie", ville: "Porto-Novo" },
  { nom: "Adjovi", prenom: "Ignace", ville: "Porto-Novo" },
  // 5 × Parakou
  { nom: "Alassoum", prenom: "Rachidou", ville: "Parakou" },
  { nom: "Imorou", prenom: "Fatoumata", ville: "Parakou" },
  { nom: "Moussa", prenom: "Saliou", ville: "Parakou" },
  { nom: "Bello", prenom: "Aminata", ville: "Parakou" },
  { nom: "Daouda", prenom: "Ibrahima", ville: "Parakou" },
  // 4 × Bohicon
  { nom: "Agbayou", prenom: "Constance", ville: "Bohicon" },
  { nom: "Dédé", prenom: "Gratien", ville: "Bohicon" },
  { nom: "Nouatin", prenom: "Prudence", ville: "Bohicon" },
  { nom: "Tossou", prenom: "Bernard", ville: "Bohicon" },
  // 4 × Ouidah
  { nom: "Sagbohan", prenom: "Ambroise", ville: "Ouidah" },
  { nom: "Gbèdolo", prenom: "Pierrette", ville: "Ouidah" },
  { nom: "Agossou", prenom: "Léandre", ville: "Ouidah" },
  { nom: "Tovihoudji", prenom: "Estelle", ville: "Ouidah" },
] as const;

// Ventes per month — harvest peaks Oct–Dec & Mar–Apr; low season Jun–Aug
const MONTHLY_COUNTS: Record<number, number> = {
  1: 20,  // Janvier   — fin de récolte
  2: 22,  // Février
  3: 32,  // Mars      — pic récolte saison sèche
  4: 30,  // Avril
  5: 25,  // Mai
  6: 17,  // Juin      — début saison basse
  7: 15,  // Juillet   — creux
  8: 18,  // Août
  9: 25,  // Septembre — reprise
  10: 33, // Octobre   — pic récolte principale
  11: 35, // Novembre
  12: 30, // Décembre
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  console.log("🌱 Seeding AGRICO database...");

  // Clear all data respecting FK order
  await prisma.vente.deleteMany();
  await prisma.client.deleteMany();
  await prisma.produit.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑️  Cleared existing data");

  // ---------------------------------------------------------------------------
  // Users — created via Better Auth so passwords are properly hashed
  // The FRONTEND_URL env var must be set; it is used as the trusted origin.
  // ---------------------------------------------------------------------------
  const origin = process.env.FRONTEND_URL ?? "http://localhost:5173";

  console.log("👥 Creating users...");
  for (const u of USERS) {
    await auth.api.signUpEmail({
      body: { email: u.email, password: u.password, name: u.name },
      headers: new Headers({ origin, "content-type": "application/json" }),
    });
    console.log(`   ✓ ${u.email}`);
  }

  // Elevate admin role — Better Auth creates all users as "vendeur" by default
  await prisma.user.update({
    where: { email: "admin@agrico.bj" },
    data: { role: "admin" },
  });
  console.log("   🔑 admin@agrico.bj → role=admin");

  // Fetch vendeurs only (exclude admin from sales attribution)
  const vendeurs = await prisma.user.findMany({
    where: { role: "vendeur" },
    select: { id: true },
  });

  // ---------------------------------------------------------------------------
  // Produits
  // ---------------------------------------------------------------------------
  console.log("🌾 Creating produits...");
  const produits = await prisma.$transaction(
    PRODUITS.map((p) =>
      prisma.produit.create({
        data: { nom: p.nom, categorie: p.categorie, prixUnitaire: p.prixUnitaire },
      })
    )
  );
  console.log(`   ✓ ${produits.length} produits`);

  // ---------------------------------------------------------------------------
  // Clients
  // ---------------------------------------------------------------------------
  console.log("👤 Creating clients...");
  const clients = await prisma.$transaction(
    CLIENTS.map((c) =>
      prisma.client.create({
        data: { nom: c.nom, prenom: c.prenom, ville: c.ville },
      })
    )
  );
  console.log(`   ✓ ${clients.length} clients`);

  // ---------------------------------------------------------------------------
  // Ventes — June 2024 → May 2026 (24 months, ~604 records total)
  // Uses a seeded RNG so results are identical across runs.
  // ---------------------------------------------------------------------------
  console.log("📊 Creating ventes...");
  const rng = makeRng(42);

  interface VenteInput {
    produitId: string;
    vendeurId: string;
    clientId: string;
    quantite: number;
    dateVente: Date;
    montantTotal: number;
  }
  const allVentes: VenteInput[] = [];

  // Build the 24-month window starting at June 2024 (month index 5, 0-based)
  for (let i = 0; i < 24; i++) {
    const totalMonths = 5 + i; // 5 = June (0-based from January)
    const year = 2024 + Math.floor(totalMonths / 12);
    const month = (totalMonths % 12) + 1; // 1-based month
    const count = MONTHLY_COUNTS[month] ?? 25;

    for (let j = 0; j < count; j++) {
      const produit = pickRandom(produits, rng);
      const vendeur = pickRandom(vendeurs, rng);
      const client = pickRandom(clients, rng);
      const quantite = randomInt(5, 100, rng);

      allVentes.push({
        produitId: produit.id,
        vendeurId: vendeur.id,
        clientId: client.id,
        quantite,
        montantTotal: quantite * produit.prixUnitaire,
        dateVente: randomDate(year, month, rng),
      });
    }
  }

  // Insert in batches to stay within Postgres parameter limits
  const BATCH = 100;
  for (let i = 0; i < allVentes.length; i += BATCH) {
    await prisma.vente.createMany({ data: allVentes.slice(i, i + BATCH) });
  }
  console.log(`   ✓ ${allVentes.length} ventes`);

  console.log("\n✅ Seed complete!");
  console.log(`   Users   : ${USERS.length}`);
  console.log(`   Produits: ${produits.length}`);
  console.log(`   Clients : ${clients.length}`);
  console.log(`   Ventes  : ${allVentes.length}`);
}

main()
  .catch((err: unknown) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
