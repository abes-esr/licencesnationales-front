import { LicencesNationalesBadRequestApiError } from "@/exception/licencesnationales/LicencesNationalesBadRequestApiError";

export const formatApiError = (err: unknown, prefix = "Impossible d'executer l'action"): string => {
  if (!err) {
    return prefix;
  }

  if (err instanceof LicencesNationalesBadRequestApiError) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  if (err instanceof Error) {
    return `${prefix} : ${err.message}`;
  }

  const anyErr = err as { message?: string };
  if (anyErr.message) {
    return `${prefix} : ${anyErr.message}`;
  }

  return prefix;
};
