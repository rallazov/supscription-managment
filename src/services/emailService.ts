import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendGridError extends Error {
  response?: {
    body: any;
  };
}

export const sendConfirmationEmail = async (email: string, discountCode: string): Promise<void> => {
  console.log(`Preparing email for ${email} with discount code ${discountCode}`);
  const msg = {
    to: email,
    from: 'no-reply@yourdomain.com', // Replace with your verified sender
    subject: 'Thank you for subscribing!',
    text: `Welcome! Here's your discount code: ${discountCode}`,
    html: `<p>Welcome to our newsletter!</p><p>Your discount code is: <strong>${discountCode}</strong></p>`,
  };

  try {
    console.log(`Sending email via SendGrid to ${email}`);
    await sgMail.send(msg);
    console.log(`Email successfully sent to ${email} via SendGrid`);
  } catch (error) {
    console.error('Error sending confirmation email via SendGrid:', error);
    if ((error as SendGridError).response) {
      console.error((error as SendGridError).response?.body);
    }
    throw error;
  }
};
