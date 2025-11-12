import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
};

// Avoid logging sensitive configuration in production

const pool = new Pool(poolConfig);

// Do not open an extra connection on module import; app will test connectivity

interface Subscriber {
  id: number;
  email: string;
  subscriptionDate: Date;
  status: 'active' | 'inactive';
}

const createSubscriber = async (email: string): Promise<void> => {
  console.log('A. Entering createSubscriber function');
  const query = 'INSERT INTO subscribers (email, subscriptionDate, status) VALUES ($1, NOW(), $2)';
  try {
    console.log(`B. Attempting to insert email: ${email}`);
    await pool.query(query, [email, 'active']);
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

export { createSubscriber, pool };
