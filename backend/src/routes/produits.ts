import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireSession } from "../middleware/auth.js";

const router = Router();

router.get("/", requireSession, async (_req, res) => {
  try {
    const produits = await prisma.produit.findMany({
      orderBy: { nom: "asc" },
    });
    res.json(produits);
  } catch (error) {
    console.error("Error fetching produits:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des produits" });
  }
});

export default router;
