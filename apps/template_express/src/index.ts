import dotenv from 'dotenv';
import { sampleAgent } from './agent.js';
import { serveNode } from '@melony/server-node';

// Load environment variables
dotenv.config();

serveNode(sampleAgent, { port: process.env.PORT });
