// services/subscriptionService.ts

import {
  createSubscriber,
  getSubscriberByEmail,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriberById,
  deleteSubscriberById,
  Subscriber,
} from '../models/subscriberModel';
import { generateDiscountCode } from '../utils/discountCodeGenerator';
import { sendSubscriptionEmail } from './emailService';
import { EmailAlreadySubscribedError } from '../errors/EmailAlreadySubscribedError';
import { failedEmailQueue } from './failedEmailQueue';

export const subscribeUserService = async (email: string): Promise<{ message: string; discountCode: string }> => {
  console.log(`Attempting to subscribe email: ${email}`);
  const existingSubscriber = await getSubscriberByEmail(email);

  if (existingSubscriber) {
    console.log(`Email ${email} is already subscribed`);
    throw new EmailAlreadySubscribedError();
  }

  const discountCode = generateDiscountCode();
  console.log(`Generated discount code for ${email}: ${discountCode}`);

  await createSubscriber(email, discountCode);
  console.log(`Successfully created subscriber for ${email}`);

  // Send the confirmation email
  try {
    await sendSubscriptionEmail(email, discountCode);
    console.log(`Confirmation email sent to ${email}`);
    // Optionally, update the subscriber record to set email_sent to true
  } catch (error) {
    console.error(`Failed to send confirmation email to ${email}:`, error);
    // Handle email sending failure, e.g., add to retry queue
    failedEmailQueue.addToQueue(email, discountCode);
  }

  return {
    message: 'Subscription successful.',
    discountCode,
  };
};

export const getSubscriptionsService = async (): Promise<Subscriber[]> => {
  const subscribers = await getAllSubscribers();
  return subscribers;
};

export const getSubscriberByIdService = async (id: number): Promise<Subscriber | null> => {
  return await getSubscriberById(id);
};

export const getSubscriberByEmailService = async (email: string): Promise<Subscriber | null> => {
  return await getSubscriberByEmail(email);
};

export const updateSubscriberService = async (id: number, updateData: Partial<Subscriber>): Promise<Subscriber | null> => {
  return await updateSubscriberById(id, updateData);
};

export const deleteSubscriberService = async (id: number): Promise<boolean> => {
  return await deleteSubscriberById(id);
};
