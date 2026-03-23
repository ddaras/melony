import express, { Request, Response } from 'express';
import cors from 'cors';
import { sampleAgent } from './agent.js';
import { generateId, Event } from 'melony';
import { runManager } from './runs.js';

export function createServer(): express.Express {
  const app = express();

  // Configure CORS for Studio access (console.melony.dev)
  app.use(cors({
    origin: true, // Echo back the request origin for better CORS support with credentials/Authorization
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'healthy', 
      version: '0.0.1', 
      platform: 'melony',
      runtime: 'express'
    });
  });

  // Create a new run
  app.post('/runs', async (req: Request, res: Response) => {
    const { event, threadId, sessionId } = req.body;
    const messageText = event?.data?.text;

    if (!messageText) {
      return res.status(400).json({ error: 'Message text is required in event.data.text' });
    }

    // Resolve or generate threadId
    const activeThreadId = (threadId || sessionId || generateId()) as string;

    // Create a new run
    const run = runManager.createRun(activeThreadId);

    // Respond immediately with the run ID
    res.json({ 
      runId: run.id, 
      threadId: activeThreadId,
      status: 'running'
    });

    // Start the agent run in the background
    (async () => {
      runManager.updateRunStatus(run.id, 'running');
      try {
        const state = {
          messages: [{ role: 'user', content: messageText }],
          threadId: activeThreadId
        };

        for await (const agentEvent of sampleAgent.run(messageText, { state })) {
          runManager.emitEvent(run.id, agentEvent);
        }

        runManager.updateRunStatus(run.id, 'completed');
      } catch (error) {
        console.error(`Run ${run.id} failed:`, error);
        const runtimeErrorEvent = {
          type: "error",
          data: {
            message: error instanceof Error ? error.message : "Unknown agent error"
          }
        };
        runManager.emitEvent(run.id, runtimeErrorEvent);
        runManager.updateRunStatus(run.id, 'failed');
      }
    })();
  });

  // List all runs, optionally filtered by threadId
  app.get('/runs', (req: Request, res: Response) => {
    const { threadId } = req.query;
    const runs = runManager.listRuns({ 
      threadId: threadId as string 
    });
    res.json({ runs });
  });

  // List all threads
  app.get('/threads', (req: Request, res: Response) => {
    const threadIds = runManager.listThreads();
    const threads = threadIds.map(id => ({ id }));
    res.json({ threads });
  });

  // Stream events from specific runId or threadId
  app.get('/stream', (req: Request, res: Response) => {
    const { runId, threadId } = req.query;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const filter = { 
      runId: runId as string, 
      threadId: threadId as string 
    };

    const historicalEvents = runManager.getEvents(filter);
    for (const event of historicalEvents) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    const unsubscribe = runManager.subscribe(filter, (event: Event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    req.on('close', () => {
      unsubscribe();
      res.end();
    });
  });

  // Get historical events for a run or thread
  app.get('/events', (req: Request, res: Response) => {
    const { runId, threadId } = req.query;
    const filter = { 
      runId: runId as string, 
      threadId: threadId as string 
    };
    const events = runManager.getEvents(filter);
    res.json({ events });
  });

  return app;
}
