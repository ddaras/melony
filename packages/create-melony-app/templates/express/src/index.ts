import dotenv from 'dotenv';
import { createServer } from './server.js';

// Load environment variables
dotenv.config();

const app = createServer();
const PORT = process.env.PORT || 7123;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Melony Agent Server running on http://localhost:${PORT}`);
  console.log(`Ready to connect: https://studio.melony.dev?agent=http://localhost:${PORT}/chat`);
});
