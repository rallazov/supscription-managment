import express from 'express';
import cors from 'cors';
import subscriptionRoutes from './routes/subscriptionRoutes';
import { pool } from './models/subscriberModel';
import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();


console.log('Current working directory:', process.cwd());
console.log('.env file path:', path.resolve(process.cwd(), '.env'));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', subscriptionRoutes); // Adjusted to use `/api` for better API structure

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Management API');
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
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export default app;
