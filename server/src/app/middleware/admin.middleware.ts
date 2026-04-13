import type { NextFunction, Request, Response } from "express";

export function restrictToAdmin() {
  return function (req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user) {
      return res.status(401).json({ error: "Authentication Required" });
    }

    // @ts-ignore
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }

    next();
  };
}
