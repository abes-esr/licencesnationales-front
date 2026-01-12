import { LicencesNationalesApiError } from "@/exception/licencesnationales/LicencesNationalesApiError";

export class LicencesNationalesNotFoundApiError extends LicencesNationalesApiError {
  constructor(public message: string, public path?: string, public deBugMessage?: string) {
    super(path, deBugMessage);
  }
}
