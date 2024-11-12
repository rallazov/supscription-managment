// src/routes/subscriptionRoutes.ts

import { Router } from 'express';
import { check } from 'express-validator';
import {
  subscribeUser,
  getSubscriptions,
  getSubscriberById,
  getSubscriberByEmail,
  updateSubscriber,
  deleteSubscriber,
} from '../controllers/subscriptionController';

const router = Router();

// GET all subscribers
router.get('/subscribers', getSubscriptions);

// GET a subscriber by ID
router.get('/subscribers/:id', getSubscriberById);

// GET a subscriber by email
router.get('/subscribers/email/:email', getSubscriberByEmail);

// POST route for subscribing a user
router.post(
  '/subscribe',
  [
    check('email').isEmail().withMessage('Please provide a valid email address'),
    // Add more validations as needed
  ],
  subscribeUser
);

// PUT route for updating a subscriber
router.put(
  '/subscribers/:id',
  [
    // Add validation checks for the fields that can be updated
    check('email').optional().isEmail().withMessage('Please provide a valid email address'),
    check('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  ],
  updateSubscriber
);

// DELETE route for deleting a subscriber
router.delete('/subscribers/:id', deleteSubscriber);

export default router;
