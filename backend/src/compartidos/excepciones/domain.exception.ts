export class DomainException extends Error {
  constructor(
    message: string,
    public readonly codigoHttp: number = 400,
  ) {
    super(message);
    this.name = 'DomainException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException);
    }
  }
}
