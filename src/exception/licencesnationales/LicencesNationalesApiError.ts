import { BaseError } from "@/exception/BaseError";

export class LicencesNationalesApiError extends BaseError {
  constructor(
    public message: string,
    public path?: string,
    public deBugMessage?: string
  ) {
    super();
  }

  public toString = (): string => {
    return `${this.message} - Route: ${this.path} - Debug: ${this.deBugMessage}`;
  };
}
