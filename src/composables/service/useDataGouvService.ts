import { useSnackbar } from "@/composables/useSnackbar";
import { DataGouvApiError } from "@/exception/data.gouv/DataGouvApiError";
import { JsonCheckSirenResponse } from "@/exception/data.gouv/DataGouvJsonDefinition";
import { SirenNotFoundError } from "@/exception/data.gouv/SirenNotFoundError";
import AxiosClient from "@/utils/AxiosClient";

const client = new AxiosClient(import.meta.env.VITE_APP_ROOT_API);

const buildDataGouvError = (err: any) => {
  if (err.response) {
    if (err.response.status == 404) {
      return new SirenNotFoundError("SIREN introuvable");
    }
    if (err.response.status == 400) {
      return new SirenNotFoundError("Format incorrect");
    }
    return new DataGouvApiError(err.response.status, err.response.data.message);
  }
  return new DataGouvApiError(500, "Service SIREN Indisponible");
};

export const useDataGouvService = () => {
  const snackbar = useSnackbar();

  const checkSiren = async (num: string): Promise<string> => {
    try {
      const result = await client.get(`/siren/${num}`);
      const response: JsonCheckSirenResponse = result.data;
      const denomination = response.uniteLegale.periodesUniteLegale[0].denominationUniteLegale;

      return denomination ?? "Denomination non renseignee";
    } catch (err: any) {
      const built = buildDataGouvError(err);
      snackbar.error(built);
      throw built;
    }
  };

  return {
    checkSiren
  };
};
