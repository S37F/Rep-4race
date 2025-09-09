import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Simple game session endpoints for future expansion
  app.get("/api/games/:gameId", (_req, res) => {
    res.json({ message: "Game endpoint - implement with Supabase" });
  });

  app.post("/api/games", (_req, res) => {
    res.json({ message: "Create game endpoint - implement with Supabase" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
