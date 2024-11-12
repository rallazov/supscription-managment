console.log('Test log 1');
import dotenv from 'dotenv';
console.log('Test log 2');
dotenv.config();
console.log('Test log 3');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '[REDACTED]' : 'Not set');
console.log('SENDGRID_VERIFIED_SENDER:', process.env.SENDGRID_VERIFIED_SENDER);
console.log('Test log 4');

