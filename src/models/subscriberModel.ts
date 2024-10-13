import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

console.log('Environment variables:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
// Don't log the password for security reasons

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
};

console.log('Pool configuration:', {
  ...poolConfig,
  password: '[REDACTED]' // Don't log the actual password
});

const pool = new Pool(poolConfig);

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
});

interface Subscriber {
  id: number;
  email: string;
  subscriptionDate: Date;
  status: 'active' | 'inactive';
  discountCode: string | null;
}

const createSubscriber = async (email: string, discountCode: string): Promise<void> => {
  console.log('A. Entering createSubscriber function');
  const query = 'INSERT INTO subscribers (email, subscriptionDate, status, discountCode) VALUES ($1, NOW(), $2, $3)';
  try {
    console.log(`B. Attempting to insert email: ${email}`);
    await pool.query(query, [email, 'active', discountCode]);
    console.log(`C. Successfully inserted email: ${email}`);
  } catch (error) {
    console.log('D. Caught an error in createSubscriber');
    console.error('Error in createSubscriber:', error);
    if (error instanceof Error) {
      console.log(`E. Error details: ${error.name}, ${error.message}`);
      if ((error as any).code === '23505') {
        console.log('F. Duplicate key error detected');
        throw new Error('Email already exists');
      }
    }
    console.log('G. Re-throwing the error');
    throw error;
  }
  console.log('H. Exiting createSubscriber function');
};

const getSubscriberByEmail = async (email: string): Promise<Subscriber | null> => {
  const query = 'SELECT * FROM subscribers WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export { createSubscriber, getSubscriberByEmail, pool };
