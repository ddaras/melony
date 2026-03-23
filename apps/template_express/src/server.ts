import express, { Request, Response } from 'express';
import cors from 'cors';
import { sampleAgent } from './agent.js';
import { ErrorEvent, generateId, Event } from 'melony';
import { runManager } from './runs.js';

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
        const runtimeErrorEvent: ErrorEvent = {
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

  // Subscribe to events for a specific run or thread
  app.get('/events', (req: Request, res: Response) => {
    const { runId, threadId, after } = req.query;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Filter by runId or threadId
    const filter = { 
      runId: runId as string, 
      threadId: threadId as string 
    };

    // 1. Send historical events if "after" is not provided (replaying full history for thread/run)
    // In a real system, "after" would be used for pagination/offset.
    const historicalEvents = runManager.getEvents(filter);
    for (const event of historicalEvents) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    // 2. Subscribe to new real-time events
    const unsubscribe = runManager.subscribe(filter, (event: Event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    // Cleanup when the connection is closed
    req.on('close', () => {
      unsubscribe();
      res.end();
    });
  });

  return app;
}
