import { Request, Response } from 'express';
import { subscribeUserService, sendSubscriptionEmail } from '../services/subscriptionService';

export const subscribeUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  try {
    const result = await subscribeUserService(email);
    res.status(201).json({ message: result.message });

    // Attempt to send email, but don't wait for it
    sendSubscriptionEmail(email, result.discountCode).catch(error => {
      console.error('Error sending subscription email:', error);
      // Here you could log this error or add to a queue for retry
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'This email is already subscribed') {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error subscribing user', error: error.message });
      }
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};
