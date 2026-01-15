import { LicencesNationalesApiError } from "@/exception/licencesnationales/LicencesNationalesApiError";

export class LicencesNationalesUnauthorizedApiError extends LicencesNationalesApiError {
  constructor(message: string, path?: string, debugMessage?: string) {
    super(message, path, debugMessage);
  }
}
