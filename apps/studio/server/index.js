import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// In-memory storage for events (current session only)
const runs = new Map();

const compareRunEvents = (a, b) => {
  const aSeq = typeof a.sequence === 'number' ? a.sequence : Number.MAX_SAFE_INTEGER;
  const bSeq = typeof b.sequence === 'number' ? b.sequence : Number.MAX_SAFE_INTEGER;
  if (aSeq !== bSeq) {
    return aSeq - bSeq;
  }
  return a.timestamp - b.timestamp;
};

wss.on('connection', (ws) => {
  console.log('Studio UI connected via WebSocket');
  
  // Send the initial state to the UI
  ws.send(JSON.stringify({ 
    type: 'init', 
    data: Array.from(runs.entries()).map(([runId, data]) => ({ runId, ...data })) 
  }));
});

// Endpoint for the Inspector to send events
app.post('/api/events', (req, res) => {
  const { runId, sessionId: incomingSessionId, name, agentName, sequence, timestamp, event, state, type } = req.body;
  const resolvedName = name || agentName || 'Anonymous';
  const sessionId = incomingSessionId || state?.sessionId || 'default';
  
  if (!runs.has(runId)) {
    runs.set(runId, { 
      runId,
      sessionId,
      agentName: resolvedName,
      events: [], 
      startedAt: timestamp, 
      lastUpdatedAt: timestamp,
      state: state || {}
    });
  }
  
  const run = runs.get(runId);
  if (!run.sessionId) {
    run.sessionId = sessionId;
  }
  
  // Update name if it was previously unknown
  if (resolvedName && (!run.agentName || run.agentName === 'Anonymous' || run.agentName === 'Anonymous Agent')) {
    run.agentName = resolvedName;
  }
  
  // We only store the event if it's an emission (to avoid duplicates from intercept)
  // or if it's the first intercept for this runId.
  // Actually, we can store both and mark them.
  run.events.push({ sequence, timestamp, event, state, type });
  run.events.sort(compareRunEvents);
  run.lastUpdatedAt = Math.max(run.lastUpdatedAt || timestamp, timestamp);
  if (state) {
    run.state = state;
  }
  
  // Broadcast to all connected Studio UI clients
  const payload = JSON.stringify({ 
    type: 'event', 
    data: { runId, sessionId: run.sessionId, name: run.agentName, sequence, timestamp, event, state, type } 
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(payload);
    }
  });
  
  res.sendStatus(200);
});

// Clear all runs
app.delete('/api/runs', (req, res) => {
  runs.clear();
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'clear' }));
    }
  });
  res.sendStatus(200);
});

const PORT = process.env.PORT || 7777;
server.listen(PORT, () => {
  console.log(`Melony Studio Server running on http://localhost:${PORT}`);
});
