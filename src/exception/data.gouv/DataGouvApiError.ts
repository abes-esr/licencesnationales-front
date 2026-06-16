export class DataGouvApiError extends Error {
  public status: number;

  constructor(status: number, message: string, options?: ErrorOptions) {
    super(message, options);
    this.status = status;
  }

  public toString = (): string => {
    return `${this.message} - Status HTTP: ${this.status}`;
  };
}
