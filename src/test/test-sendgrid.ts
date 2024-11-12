import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

console.log('Script started');

dotenv.config();
console.log('Dotenv config loaded');

console.log('Environment variables:');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '[REDACTED]' : 'Not set');
console.log('SENDGRID_VERIFIED_SENDER:', process.env.SENDGRID_VERIFIED_SENDER);

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('SENDGRID_API_KEY is not set in the environment variables');
  process.exit(1);
}

sgMail.setApiKey(apiKey);
console.log('SendGrid API key set');

const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER;
if (!verifiedSender) {
  console.error('SENDGRID_VERIFIED_SENDER is not set in the environment variables');
  process.exit(1);
}

const testEmail = {
  to: 'mr.raminallazov@gmail.com', // Replace with a real email address you can check
  from: verifiedSender,
  subject: 'SendGrid Test Email',
  text: 'This is a test email from SendGrid',
  html: '<strong>This is a test email from SendGrid</strong>',
};

async function sendTestEmail() {
  console.log('Entering sendTestEmail function');
  try {
    console.log('Attempting to send test email...');
    const response = await sgMail.send(testEmail);
    console.log('Test email sent successfully');
    console.log('SendGrid Response:', response);
  } catch (error: unknown) {
    console.error('Error sending test email:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
    }
    
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sendGridError = error as { response?: { body?: any } };
      if (sendGridError.response && sendGridError.response.body) {
        console.error('SendGrid API error response:', JSON.stringify(sendGridError.response.body, null, 2));
      }
    }
  }
  console.log('Exiting sendTestEmail function');
}

console.log('About to call sendTestEmail');
sendTestEmail().then(() => console.log('sendTestEmail promise resolved')).catch(error => console.error('Unhandled error in sendTestEmail:', error));
console.log('Script finished');
