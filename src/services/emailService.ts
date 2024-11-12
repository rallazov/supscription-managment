// services/emailService.ts

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendSubscriptionEmail(to: string, discountCode: string): Promise<void> {
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || 'info@zephyrlux.com';

  const msg: sgMail.MailDataRequired = {
    to,
    from: verifiedSender,
    subject: 'Subscription Confirmation',
    text: `Thank you for subscribing! Your discount code is: ${discountCode}`,
    html: `<strong>Thank you for subscribing!</strong><p>Your discount code is: ${discountCode}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${to}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}
