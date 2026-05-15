import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireSession } from "../middleware/auth.js";

const router = Router();

router.get("/", requireSession, async (_req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { nom: "asc" },
    });
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des clients" });
  }
});

const createClientSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  ville: z.string().min(1),
});

router.post("/", requireSession, async (req, res) => {
  try {
    const parsed = createClientSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const client = await prisma.client.create({ data: parsed.data });
    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Erreur lors de la création du client" });
  }
});

export default router;
