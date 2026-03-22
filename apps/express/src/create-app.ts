import express from "express";
import { registerChatRoutes } from "./chat-routes.js";
import cors from "cors";

export const createApp = (): express.Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  });

  registerChatRoutes(app);
  return app;
};
