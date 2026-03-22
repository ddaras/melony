import express, { Request, response, Response } from 'express';
import cors from 'cors';
import { sampleAgent } from './agent.js';
import { ErrorEvent } from 'melony';

export function createServer(): express.Express {
  const app = express();

  // Configure CORS for Studio access (console.melony.dev)
  app.use(cors({
    origin: '*', // For development, allow all origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', version: '1.0.0' });
  });

  // Main chat route that Melony Studio connects to
  app.post('/chat', async (req: Request, res: Response) => {
    const { event, sessionId } = req.body;
    const messageText = event?.data?.text;

    if (!messageText) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    try {
      // Initialize state with the user's message for the LLM plugin
      const state = {
        messages: [
          { role: 'user', content: messageText }
        ],
        sessionId
      };

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        for await (const event of sampleAgent.run(messageText, { state })) {
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        }
      } catch (error) {
        const runtimeErrorEvent: ErrorEvent = {
          type: "error",
          data: {
            message: error instanceof Error ? error.message : "Unknown agent error"
          }
        };
        res.write(`data: ${JSON.stringify(runtimeErrorEvent)}\n\n`);
      } finally {
        res.end();
      }
    } catch (error) {
      console.error('Failed to run agent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}
