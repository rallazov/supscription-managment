import express, { Request, Response } from 'express';
import { subscribeUser } from '../controllers/subscriptionController';
import { validationResult, check } from 'express-validator';
import { Router } from 'express';
import * as subscriptionService from '../services/subscriptionService';

const router = Router();

router.post(
  '/subscribe',
  [
    check('email').isEmail().withMessage('Invalid email!')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      await subscribeUser(req, res);
    }
  }
);

router.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
