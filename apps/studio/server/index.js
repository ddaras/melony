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
  const { runId, agentName, timestamp, event, state, type } = req.body;
  
  if (!runs.has(runId)) {
    runs.set(runId, { 
      runId,
      agentName,
      events: [], 
      startedAt: timestamp, 
      lastUpdatedAt: timestamp,
      state: state || {}
    });
  }
  
  const run = runs.get(runId);
  
  // Update agent name if it was previously unknown
  if (agentName && (!run.agentName || run.agentName === 'Anonymous Agent')) {
    run.agentName = agentName;
  }
  
  // We only store the event if it's an emission (to avoid duplicates from intercept)
  // or if it's the first intercept for this runId.
  // Actually, we can store both and mark them.
  run.events.push({ timestamp, event, state, type });
  run.lastUpdatedAt = timestamp;
  if (state) {
    run.state = state;
  }
  
  // Broadcast to all connected Studio UI clients
  const payload = JSON.stringify({ 
    type: 'event', 
    data: { runId, timestamp, event, state, type } 
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
