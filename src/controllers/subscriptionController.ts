import { Request, Response } from 'express';
import { createSubscriber as createSubscriberFunc, pool } from '../models/subscriberModel';

const subscribeUser = async (req: Request, res: Response): Promise<void> => {
  console.log('1. Entering subscribeUser function');
  const { email } = req.body;

  if (!email) {
    console.log('2. No email provided');
    res.status(400).json({ message: 'Email is required' });
  } else {
    try {
      console.log(`3. Attempting to subscribe email: ${email}`);
      await createSubscriberFunc(email);
      console.log(`4. Successfully subscribed email: ${email}`);
      res.status(201).json({ message: 'Subscription successful' });
    } catch (error) {
      console.log('5. Caught an error in subscribeUser');
      console.error('Subscription error:', error);
      if (error instanceof Error) {
        console.log(`6. Error instance: ${error.name}, ${error.message}`);
        if (error.message.includes('duplicate key value') || error.message.includes('already exists')) {
          console.log('7. Duplicate email detected');
          res.status(409).json({ message: 'This email is already subscribed' });
        } else {
          console.log('8. Other error occurred');
          res.status(500).json({ 
            message: 'Error subscribing user',
            error: error.message
          });
        }
      } else {
        console.log('9. Unexpected error type');
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  }
  console.log('10. Exiting subscribeUser function');
};

export { subscribeUser };
