export class LicencesNationalesApiError extends Error {
  public path: string | undefined;
  debugMessage: string | undefined;

  constructor(message: string, path?: string, debugMessage?: string) {
    super(message);
    this.path = path;
    this.debugMessage = debugMessage;
  }

  public toString = (): string => {
    return `${this.message} - Route: ${this.path} - Debug: ${this.debugMessage}`;
  };
}
