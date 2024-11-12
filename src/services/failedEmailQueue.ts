// services/failedEmailQueue.ts

import { sendSubscriptionEmail } from './emailService';

interface FailedEmail {
  email: string;
  discountCode: string;
  attempts: number;
  lastAttempt: Date;
}

class FailedEmailQueue {
  private queue: FailedEmail[] = [];

  addToQueue(email: string, discountCode: string): void {
    console.log(`Adding email ${email} to failed email queue`);
    this.queue.push({
      email,
      discountCode,
      attempts: 0,
      lastAttempt: new Date(),
    });
    console.log(`Current queue length: ${this.queue.length}`);
  }

  async processQueue(): Promise<void> {
    console.log(`Processing failed email queue. Current length: ${this.queue.length}`);
    for (const item of [...this.queue]) {
      console.log(`Attempting to resend email to ${item.email}. Attempt ${item.attempts + 1}`);
      try {
        await sendSubscriptionEmail(item.email, item.discountCode);
        console.log(`Successfully resent email to ${item.email}`);
        // If successful, remove from queue
        this.queue = this.queue.filter(queueItem => queueItem.email !== item.email);
      } catch (error) {
        item.attempts++;
        item.lastAttempt = new Date();
        console.error(`Failed to resend email to ${item.email}. Attempt ${item.attempts}`);
        // You may implement a max attempts limit
      }
    }
    console.log(`Finished processing queue. Remaining items: ${this.queue.length}`);
  }
}

export const failedEmailQueue = new FailedEmailQueue();
