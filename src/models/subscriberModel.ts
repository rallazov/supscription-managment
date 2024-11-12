// models/subscriberModel.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

const pool = new Pool(poolConfig);

export interface Subscriber {
  id: number;
  email: string;
  subscriptiondate: Date;
  status: 'active' | 'inactive';
  discount_code: string | null;
  email_sent: boolean;
}

export const createSubscriber = async (email: string, discountCode: string): Promise<void> => {
  const query = `
    INSERT INTO subscribers (email, subscriptiondate, status, discount_code, email_sent)
    VALUES ($1, NOW(), $2, $3, $4)
  `;
  try {
    await pool.query(query, [email, 'active', discountCode, false]);
  } catch (error) {
    console.error('Error in createSubscriber:', error);
    throw error;
  }
};

export const getSubscriberByEmail = async (email: string): Promise<Subscriber | null> => {
  const query = 'SELECT * FROM subscribers WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

export const getAllSubscribers = async (): Promise<Subscriber[]> => {
  const query = 'SELECT * FROM subscribers';
  const result = await pool.query(query);
  return result.rows;
};

export const getSubscriberById = async (id: number): Promise<Subscriber | null> => {
  const query = 'SELECT * FROM subscribers WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updateSubscriberById = async (id: number, updateData: Partial<Subscriber>): Promise<Subscriber | null> => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updateData) {
    fields.push(`${key} = $${index}`);
    values.push((updateData as any)[key]);
    index++;
  }

  values.push(id);

  const query = `
    UPDATE subscribers
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteSubscriberById = async (id: number): Promise<boolean> => {
  const query = 'DELETE FROM subscribers WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rowCount !== null && result.rowCount > 0;
};

export { pool };
