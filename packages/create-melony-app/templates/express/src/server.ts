import express, { Request, Response } from 'express';
import cors from 'cors';
import { sampleAgent } from './agent.js';
import { createStreamResponse } from 'melony';

export function createServer() {
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

    console.log(`Received message from session ${sessionId}: ${messageText}`);

    try {
      // Initialize state with the user's message for the LLM plugin
      const state = {
        messages: [
          { role: 'user', content: messageText }
        ]
      };

      // Stream agent run (returns an AsyncGenerator of Melony events)
      const generator = sampleAgent.run(
        { text: messageText },
        { state, sessionId }
      );

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const response = createStreamResponse(generator);
      res.send(response);
    } catch (error) {
      console.error('Failed to run agent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return app;
}
