import { DataGouvApiError } from "@/exception/data.gouv/DataGouvApiError";

export class SirenNotFoundError extends DataGouvApiError {
  constructor(public message: string) {
    super(404);
  }
}
