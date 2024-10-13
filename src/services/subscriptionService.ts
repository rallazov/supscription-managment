import { createSubscriber, getSubscriberByEmail } from '../models/subscriberModel';
import { generateDiscountCode } from '../utils/discountCodeGenerator';
import { sendConfirmationEmail } from './emailService';
import { failedEmailQueue } from './failedEmailQueue';

export const subscribeUserService = async (email: string): Promise<{ message: string, discountCode: string }> => {
  console.log(`Attempting to subscribe email: ${email}`);
  const existingSubscriber = await getSubscriberByEmail(email);
  
  if (existingSubscriber) {
    console.log(`Email ${email} is already subscribed`);
    throw new Error('This email is already subscribed');
  }

  const discountCode = generateDiscountCode();
  console.log(`Generated discount code for ${email}: ${discountCode}`);
  
  await createSubscriber(email, discountCode);
  console.log(`Successfully created subscriber for ${email}`);

  return { 
    message: 'Subscription successful.', 
    discountCode 
  };
};

export const sendSubscriptionEmail = async (email: string, discountCode: string): Promise<void> => {
  console.log(`Attempting to send confirmation email to ${email}`);
  try {
    await sendConfirmationEmail(email, discountCode);
    console.log(`Confirmation email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send confirmation email to ${email}:`, error);
    console.log(`Adding ${email} to failed email queue`);
    failedEmailQueue.addToQueue(email, discountCode);
  }
};

// Remove all Express-related code and imports

// Instead, define your service functions here, for example:
export const getSubscriptions = async () => {
  // Implementation
};

export const createSubscription = async (data: any) => {
  // Implementation
};


export function subscribeUser(email: any) {
  throw new Error('Function not implemented.');
}
// ... other subscription-related functions
