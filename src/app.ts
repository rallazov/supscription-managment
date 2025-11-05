import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import subscriptionRoutes from './routes/subscriptionRoutes';
import { pool } from './models/subscriberModel';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : undefined;
app.use(
  cors(
    allowedOrigins
      ? { origin: allowedOrigins, credentials: true }
      : {}
  )
);
app.use(express.json());

// Routes
app.use('/api', subscriptionRoutes); // Adjusted to use `/api` for better API structure

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Management API');
});

// Liveness/Readiness endpoints
app.get('/healthz', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'ok' });
  } catch (e) {
    res.status(503).json({ status: 'degraded', db: 'error' });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  res.status(status).json({ error: message });
});

// Add this before starting the server
const testDatabaseConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
};

// Modify your server start logic
const startServer = async () => {
  try {
    await testDatabaseConnection();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await pool.end();
        } finally {
          process.exit(0);
        }
      });
      // Fallback hard-exit timer
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export default app;
