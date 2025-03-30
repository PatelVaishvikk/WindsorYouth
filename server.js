import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import next from 'next';
import connectDb from './lib/db.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Ensure MongoDB URI is provided
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Connect to MongoDB
  connectDb().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

  // **Body parsers for JSON and URL-encoded payloads**
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Serve static files
  server.use(express.static(path.join(__dirname, 'public')));
  server.use('/styles', express.static(path.join(__dirname, 'public/styles')));

  // Let Next.js handle all other routes including API routes
  server.all('*', (req, res) => handle(req, res));

  // Start the server
  server.listen(PORT, err => {
    if (err) {
      console.error('Error starting server:', err);
      process.exit(1);
    }
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
