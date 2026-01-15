import { DataGouvApiError } from "@/exception/data.gouv/DataGouvApiError";

export class SirenNotFoundError extends DataGouvApiError {
  constructor(message: string) {
    super(404, message);
  }
}
