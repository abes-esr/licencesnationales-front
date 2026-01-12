import { DataGouvApiError } from "@/core/service/data.gouv/exception/DataGouvApiError";

export class SirenNotFoundError extends DataGouvApiError {
  constructor(public message: string) {
    super(404);
  }
}
