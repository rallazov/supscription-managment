import express, { Request, Response } from 'express';
import { subscribeUser } from '../controllers/subscriptionController';
import { validationResult, check } from 'express-validator';
import { Router } from 'express';
import * as subscriptionService from '../services/subscriptionService';

const router = Router();

// Add this new GET route for fetching all subscriptions
router.get('/', async (req: Request, res: Response) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Error fetching subscriptions' });
  }
});

// Keep your existing POST route for subscribing
router.post(
  '/subscribe',
  [
    check('email').isEmail().withMessage('Invalid email!')
  ],
  subscribeUser
);

export default router;
