import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import salesRouter from "./routes/sales.js";
import statsRouter from "./routes/stats.js";
import produitsRouter from "./routes/produits.js";
import clientsRouter from "./routes/clients.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/sales", salesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/produits", produitsRouter);
app.use("/api/clients", clientsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AGRICO Backend running on port ${PORT}`);
});

export default app;
