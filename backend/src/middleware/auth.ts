import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

export type { AuthenticatedRequest };

export const requireSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    if (!session) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }

    (req as AuthenticatedRequest).user = session.user as AuthenticatedRequest["user"];
    (req as AuthenticatedRequest).session = session.session as AuthenticatedRequest["session"];
    next();
  } catch {
    res.status(401).json({ error: "Session invalide" });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res.status(403).json({ error: "Accès refusé" });
      return;
    }
    next();
  };
};
