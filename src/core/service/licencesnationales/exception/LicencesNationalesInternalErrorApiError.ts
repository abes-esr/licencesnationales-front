import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";

export class LicencesNationalesInternalErrorApiError extends LicencesNationalesApiError {
  constructor(
    public message: string,
    public path?: string,
    public deBugMessage?: string
  ) {
    super(path, deBugMessage);
  }
}
