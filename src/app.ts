// app.ts

import express from 'express';
import cors from 'cors';
import subscriptionRoutes from './routes/subscriptionRoutes';
import { pool } from './models/subscriberModel';
import path from 'path';
import dotenv from 'dotenv';
import { failedEmailQueue } from './services/failedEmailQueue';

dotenv.config();

console.log('Current working directory:', process.cwd());
console.log('.env file path:', path.resolve(process.cwd(), '.env'));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use Express's built-in JSON parser

// Routes
app.use('/api', subscriptionRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Management API');
});

const testDatabaseConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error; // Re-throw the error to be caught in startServer
  }
};

const startServer = async () => {
  try {
    await testDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit the process if we can't connect to the database
  }
};

// Process failed emails every 15 minutes
setInterval(() => {
  failedEmailQueue.processQueue().catch(error => {
    console.error('Error processing failed email queue:', error);
  });
}, 15 * 60 * 1000);

startServer();

export default app;
