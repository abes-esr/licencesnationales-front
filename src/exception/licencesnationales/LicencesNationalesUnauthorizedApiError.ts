import { LicencesNationalesApiError } from "@/exception/licencesnationales/LicencesNationalesApiError";

export class LicencesNationalesUnauthorizedApiError extends LicencesNationalesApiError {
  constructor(public message: string, public path?: string, public deBugMessage?: string) {
    super(message);
  }
}
