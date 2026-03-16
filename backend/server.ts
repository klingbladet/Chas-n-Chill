import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import moviesRouter from './routes/movies.js';
import path from 'path';
import { fileURLToPath } from 'url';

//  från .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewar
app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/movies', moviesRouter);

// check-endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Movie API is running',
    timestamp: new Date().toISOString()
  });
});

// Root-endpoint (API Docs)
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Movie Watchlist API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      movies: {
        getAll: 'GET /api/movies',
        getFiltered: 'GET /api/movies?status=watchlist|watched',
        getOne: 'GET /api/movies/:id',
        create: 'POST /api/movies',
        update: 'PUT /api/movies/:id',
        delete: 'DELETE /api/movies/:id',
        stats: 'GET /api/movies/user/stats'
      }
    }
  });
});

// Serve static files from the built frontend (frontend/dist folder)
// If we're running from 'dist/server.js', we need to go up two levels.
// If we're running from 'server.ts' (dev), we go up one level.
const distPath = path.join(__dirname, __dirname.endsWith('dist') ? '../../frontend/dist' : '../frontend/dist');
app.use(express.static(distPath));

// 2. Handle SPA Routing (Optional but recommended)
// This ensures that if a user refreshes on a sub-page, they don't get a 404
app.get('*', (req: Request, res: Response) => {
  // If the request starts with /api but didn't match any route, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
      hint: 'Check the API documentation for available endpoints'
    });
  }
  
  // Otherwise, serve the SPA index.html
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

// Felhanterare 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Starta servern
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     🎬 Movie Watchlist API Server     ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✓ API docs: http://localhost:${PORT}/api`);
  console.log(`✓ Frontend: http://localhost:${PORT}/`);
  console.log('Available endpoints:');
  console.log('  GET    /api/movies              - Get all movies');
  console.log('  GET    /api/movies/:id          - Get specific movie');
  console.log('  GET    /api/movies/user/stats   - Get user statistics');
  console.log('  POST   /api/movies              - Add new movie');
  console.log('  PUT    /api/movies/:id          - Update movie');
  console.log('  DELETE /api/movies/:id          - Delete movie');
  console.log('');
});


