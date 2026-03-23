import express from "express";
import { registerChatRoutes } from "./chat-routes.js";
import cors from "cors";

export const createApp = (): express.Express => {
  const app = express();

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  app.use(express.json());
  
  registerChatRoutes(app);
  return app;
};
