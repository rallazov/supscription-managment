import { Request, Response } from 'express';
import { createSubscriber } from '../models/subscriberModel';

const subscribeUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await createSubscriber(email);
    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing user' });
  }
};

export { subscribeUser };
