// errors/EmailAlreadySubscribedError.ts

export class EmailAlreadySubscribedError extends Error {
  constructor(message = 'This email is already subscribed') {
    super(message);
    this.name = 'EmailAlreadySubscribedError';
  }
}
