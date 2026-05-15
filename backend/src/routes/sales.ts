import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSession, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/sales — filtered list with pagination
router.get("/", requireSession, async (req, res) => {
  try {
    const { month, year, vendeurId, page = "1", limit = "20" } = req.query;

    const where: Record<string, unknown> = {};

    if (month && year) {
      const m = parseInt(month as string);
      const y = parseInt(year as string);
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 1);
      where.dateVente = { gte: startDate, lt: endDate };
    } else if (year) {
      const y = parseInt(year as string);
      where.dateVente = { gte: new Date(y, 0, 1), lt: new Date(y + 1, 0, 1) };
    }

    if (vendeurId) {
      where.vendeurId = vendeurId as string;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [ventes, total] = await Promise.all([
      prisma.vente.findMany({
        where,
        include: {
          produit: { select: { nom: true, categorie: true } },
          vendeur: { select: { name: true } },
          client: { select: { nom: true, prenom: true, ville: true } },
        },
        orderBy: { dateVente: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.vente.count({ where }),
    ]);

    res.json({ data: ventes, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des ventes" });
  }
});

// POST /api/sales — create sale with server-calculated montantTotal
const createSaleSchema = z.object({
  produitId: z.string().min(1),
  clientId: z.string().min(1),
  quantite: z.number().int().positive(),
  dateVente: z.string().min(1),
});

router.post("/", requireSession, async (req, res) => {
  try {
    const parsed = createSaleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { produitId, clientId, quantite, dateVente } = parsed.data;
    const authReq = req as AuthenticatedRequest;

    const produit = await prisma.produit.findUnique({ where: { id: produitId } });
    if (!produit) {
      res.status(404).json({ error: "Produit non trouvé" });
      return;
    }

    const montantTotal = quantite * produit.prixUnitaire;

    const vente = await prisma.vente.create({
      data: {
        produitId,
        vendeurId: authReq.user!.id,
        clientId,
        quantite,
        dateVente: new Date(dateVente),
        montantTotal,
      },
      include: {
        produit: { select: { nom: true } },
        client: { select: { nom: true, prenom: true } },
      },
    });

    res.status(201).json(vente);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ error: "Erreur lors de la création de la vente" });
  }
});

export default router;
