import { useSnackbar } from "@/composables/useSnackbar";
import { LicencesNationalesApiError } from "@/exception/licencesnationales/LicencesNationalesApiError";
import { LicencesNationalesBadRequestApiError } from "@/exception/licencesnationales/LicencesNationalesBadRequestApiError";
import { LicencesNationalesInternalErrorApiError } from "@/exception/licencesnationales/LicencesNationalesInternalErrorApiError";
import { LicencesNationalesNotFoundApiError } from "@/exception/licencesnationales/LicencesNationalesNotFoundApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/exception/licencesnationales/LicencesNationalesUnauthorizedApiError";
import AxiosClient from "@/utils/AxiosClient";

const client = new AxiosClient(import.meta.env.VITE_APP_ROOT_API);

const buildException = (err: any): LicencesNationalesApiError => {
  if (err.response) {
    if (err.response.status) {
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
      }
      return new LicencesNationalesApiError(err.error);
    }
    return new LicencesNationalesApiError(err.error);
  }
  return new LicencesNationalesApiError(err.message);
};

export const useApiService = () => {
  const snackbar = useSnackbar();

  const request = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (err: any) {
      const built = buildException(err);
      snackbar.error(built);
      throw built;
    }
  };

  const get = (url: string, token?: string, param?: any, longRequest?: boolean) =>
    request(() => client.get(url, token, param, longRequest));

  const post = (url: string, data: any, token?: string) =>
    request(() => client.post(url, data, token));

  const put = (url: string, data: any, token?: string) =>
    request(() => client.put(url, data, token));

  const del = (url: string, data: any, token?: string) =>
    request(() => client.delete(url, data, token));

  return {
    get,
    post,
    put,
    del,
    buildException
  };
};
