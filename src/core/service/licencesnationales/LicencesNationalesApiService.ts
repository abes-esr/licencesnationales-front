import AxiosClient from "../../../utils/AxiosClient";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { LicencesNationalesNotFoundApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesNotFoundApiError";
import { LicencesNationalesInternalErrorApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesInternalErrorApiError";

export class LicencesNationalesApiService {
  // Client HTTP
  client: AxiosClient = new AxiosClient(import.meta.env.VITE_APP_ROOT_API);

  buildException(err: any): LicencesNationalesApiError {
    if (err.response) {
      // Il y a une réponse HTTP
      if (err.response.status) {
        // Il s'agit d'une exception de l'API
        if (err.response.status == 400) {
          return new LicencesNationalesBadRequestApiError(
            err.response.data.message,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 401 || err.response.status == 403) {
          return new LicencesNationalesUnauthorizedApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 404) {
          return new LicencesNationalesNotFoundApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 405) {
          return new LicencesNationalesNotFoundApiError(
            err.response.data.message,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else if (err.response.status == 500) {
          return new LicencesNationalesInternalErrorApiError(
            err.response.data.error,
            err.response.data.path,
            err.response.data.debugMessage
          );
        } else {
          return new LicencesNationalesApiError(err.error);
        }
      } else {
        // Exception non géré par l'API - Erreur interne ?
        return new LicencesNationalesApiError(err.error);
      }
    } else {
      // Erreur au départ de la requête HTTP
      return new LicencesNationalesApiError(err.message);
    }
  }
}
