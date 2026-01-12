import { BaseError } from "@/exception/BaseError";

export class DataGouvApiError extends BaseError {
  constructor(public status: number, public message: string) {
    super();
  }

  public toString = (): string => {
    return `${this.message} - Status HTTP: ${this.status}`;
  };
}
