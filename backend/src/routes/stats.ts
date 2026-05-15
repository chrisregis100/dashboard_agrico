import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireSession } from "../middleware/auth.js";

const router = Router();

// GET /api/stats/summary — KPIs
router.get("/summary", requireSession, async (req, res) => {
  try {
    const { month, year } = req.query;

    const where: Record<string, unknown> = {};
    let prevWhere: Record<string, unknown> = {};

    if (month && year) {
      const m = parseInt(month as string);
      const y = parseInt(year as string);
      where.dateVente = {
        gte: new Date(y, m - 1, 1),
        lt: new Date(y, m, 1),
      };
      const prevM = m === 1 ? 12 : m - 1;
      const prevY = m === 1 ? y - 1 : y;
      prevWhere = {
        dateVente: {
          gte: new Date(prevY, prevM - 1, 1),
          lt: new Date(prevY, prevM, 1),
        },
      };
    } else if (year) {
      const y = parseInt(year as string);
      where.dateVente = { gte: new Date(y, 0, 1), lt: new Date(y + 1, 0, 1) };
      prevWhere = { dateVente: { gte: new Date(y - 1, 0, 1), lt: new Date(y, 0, 1) } };
    }

    const [currentAgg, prevAgg, nbVentes, topProduit] = await Promise.all([
      prisma.vente.aggregate({ where, _sum: { montantTotal: true } }),
      prisma.vente.aggregate({ where: prevWhere, _sum: { montantTotal: true } }),
      prisma.vente.count({ where }),
      prisma.vente.groupBy({
        by: ["produitId"],
        where,
        _sum: { quantite: true },
        orderBy: { _sum: { quantite: "desc" } },
        take: 1,
      }),
    ]);

    const caTotal = currentAgg._sum.montantTotal ?? 0;
    const caPrev = prevAgg._sum.montantTotal ?? 0;
    const trendVsPrevMonth = caPrev > 0 ? ((caTotal - caPrev) / caPrev) * 100 : 0;

    let produitTopName = "N/A";
    if (topProduit.length > 0) {
      const produit = await prisma.produit.findUnique({
        where: { id: topProduit[0].produitId },
        select: { nom: true },
      });
      produitTopName = produit?.nom ?? "N/A";
    }

    res.json({
      caTotal,
      nbVentes,
      produitTopName,
      trendVsPrevMonth: Math.round(trendVsPrevMonth * 100) / 100,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du résumé" });
  }
});

// GET /api/stats/charts — data for all charts
router.get("/charts", requireSession, async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    const startDate = new Date(currentYear - 1, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const allVentes = await prisma.vente.findMany({
      where: { dateVente: { gte: startDate, lt: endDate } },
      select: { dateVente: true, montantTotal: true, produitId: true, vendeurId: true, clientId: true },
    });

    // Group by month for evolution CA (24 months: previous year + current year)
    const evolutionCA: { month: string; ca: number }[] = [];
    for (let y = currentYear - 1; y <= currentYear; y++) {
      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(y, m, 1);
        const monthEnd = new Date(y, m + 1, 1);
        const monthVentes = allVentes.filter(
          (v) => v.dateVente >= monthStart && v.dateVente < monthEnd
        );
        const ca = monthVentes.reduce((sum, v) => sum + v.montantTotal, 0);
        const label = `${String(m + 1).padStart(2, "0")}/${y}`;
        evolutionCA.push({ month: label, ca });
      }
    }

    const yearFilter = {
      dateVente: { gte: new Date(currentYear, 0, 1), lt: new Date(currentYear + 1, 0, 1) },
    };

    // Top 5 produits by quantity sold
    const top5 = await prisma.vente.groupBy({
      by: ["produitId"],
      where: yearFilter,
      _sum: { quantite: true, montantTotal: true },
      orderBy: { _sum: { quantite: "desc" } },
      take: 5,
    });

    const produitIds = top5.map((t) => t.produitId);
    const produits = await prisma.produit.findMany({
      where: { id: { in: produitIds } },
      select: { id: true, nom: true },
    });
    const produitMap = new Map(produits.map((p) => [p.id, p.nom]));

    const top5Produits = top5.map((t) => ({
      nom: produitMap.get(t.produitId) ?? "Inconnu",
      quantite: t._sum.quantite ?? 0,
      ca: t._sum.montantTotal ?? 0,
    }));

    // Ventes par ville
    const ventesAvecClient = await prisma.vente.findMany({
      where: yearFilter,
      select: { client: { select: { ville: true } } },
    });

    const villeCount: Record<string, number> = {};
    for (const v of ventesAvecClient) {
      const { ville } = v.client;
      villeCount[ville] = (villeCount[ville] ?? 0) + 1;
    }
    const ventesParVille = Object.entries(villeCount)
      .map(([ville, count]) => ({ ville, count }))
      .sort((a, b) => b.count - a.count);

    // Ventes par vendeur
    const vendeurGroups = await prisma.vente.groupBy({
      by: ["vendeurId"],
      where: yearFilter,
      _count: true,
      _sum: { montantTotal: true },
    });

    const vendeurIds = vendeurGroups.map((v) => v.vendeurId);
    const vendeurs = await prisma.user.findMany({
      where: { id: { in: vendeurIds } },
      select: { id: true, name: true },
    });
    const vendeurMap = new Map(vendeurs.map((v) => [v.id, v.name]));

    const ventesParVendeur = vendeurGroups
      .map((v) => ({
        nom: vendeurMap.get(v.vendeurId) ?? "Inconnu",
        count: v._count,
        ca: v._sum.montantTotal ?? 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({ evolutionCA, top5Produits, ventesParVille, ventesParVendeur });
  } catch (error) {
    console.error("Error fetching charts:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des graphiques" });
  }
});

export default router;
