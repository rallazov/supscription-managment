import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { subscribeUserService, getSubscriptionsService, getSubscriberByIdService, getSubscriberByEmailService, updateSubscriberService, deleteSubscriberService } from '../services/subscriptionService';
import { EmailAlreadySubscribedError } from '../errors/EmailAlreadySubscribedError';

export const subscribeUser = async (req: Request, res: Response): Promise<void> => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email } = req.body;

  try {
    const result = await subscribeUserService(email);
    res.status(201).json({ message: 'Subscribed successfully!', data: result });
  } catch (error) {
    if (error instanceof EmailAlreadySubscribedError) {
      res.status(409).json({ message: error.message });
    } else {
      console.error('Error subscribing user:', error);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscriptions = await getSubscriptionsService();
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Error fetching subscriptions' });
  }
};

export const getSubscriberById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const subscriber = await getSubscriberByIdService(id);
    if (subscriber) {
      res.json(subscriber);
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    console.error('Error fetching subscriber by ID:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const getSubscriberByEmail = async (req: Request, res: Response): Promise<void> => {
  const email = req.params.email;

  try {
    const subscriber = await getSubscriberByEmailService(email);
    if (subscriber) {
      res.json(subscriber);
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    console.error('Error fetching subscriber by email:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const updateSubscriber = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const updateData = req.body;

  try {
    const updatedSubscriber = await updateSubscriberService(id, updateData);
    if (updatedSubscriber) {
      res.json({ message: 'Subscriber updated successfully', data: updatedSubscriber });
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    console.error('Error updating subscriber:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

export const deleteSubscriber = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const deleted = await deleteSubscriberService(id);
    if (deleted) {
      res.json({ message: 'Subscriber deleted successfully' });
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
