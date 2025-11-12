import { pool } from '../models/subscriberModel';

export interface SubscriptionRow {
  id: number;
  email: string;
  subscriptiondate: Date;
  status: 'active' | 'inactive';
}

export const getSubscriptions = async (): Promise<SubscriptionRow[]> => {
  const { rows } = await pool.query<SubscriptionRow>(
    'SELECT id, email, subscriptionDate, status FROM subscribers ORDER BY id DESC'
  );
  return rows;
};

export const createSubscription = async (email: string): Promise<void> => {
  await pool.query('INSERT INTO subscribers (email, subscriptionDate, status) VALUES ($1, NOW(), $2)', [
    email,
    'active',
  ]);
};

