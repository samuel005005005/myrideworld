export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException);
    }
  }
}
