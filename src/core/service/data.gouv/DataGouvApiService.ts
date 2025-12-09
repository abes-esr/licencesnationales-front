import AxiosClient from "../../../utils/AxiosClient";
import { JsonCheckSirenResponse } from "@/core/service/data.gouv/DataGouvJsonDefinition";
import { SirenNotFoundError } from "@/core/service/data.gouv/exception/SirenNotFoundError";
import { DataGouvApiError } from "@/core/service/data.gouv/exception/DataGouvApiError";

export class DataGouvApiService {
  // Client HTTP
  client: AxiosClient = new AxiosClient(import.meta.env.VITE_APP_ROOT_API);

  /**
   * Appel API pour se logger et obtenir un getToken d'identification
   * @param data Json de login à l'API LicencesNationales
   * @return string : La dénomination de l'entreprise
   * @throws SirenNotFoundError si le numéro SIREN n'existe pas dans data.gouv
   * @throws HttpRequestError si la requête retourne une erreur
   */
  checkSiren(num: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/siren/" + num)
        .then(result => {
          /**
           * Attention, l'assignation de AxiosResponse<any> vers l'interface n'est pas considérée comme fiable à 100%
           * Elle peut mener à la levée d'une exception qui mène dans le catch avec une erreur vide ( = { } ).
           * Il conviendrait de tester la présence de chaque champs et de les assigner "à la main".
           */
          const response: JsonCheckSirenResponse = result.data;

          if (response.uniteLegale.periodesUniteLegale[0].denominationUniteLegale == null) {
            resolve("Dénomination non renseignée");
          } else {
            resolve(response.uniteLegale.periodesUniteLegale[0].denominationUniteLegale);
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response) {
            if (
              err.response.status == 404
            ) {
              reject(new SirenNotFoundError("SIREN introuvable"));
            } else if (err.response.status == 400){
              reject(new SirenNotFoundError("Format incorrect"));
            } else {
              reject(
                new DataGouvApiError(
                  err.response.status,
                  err.response.data.message
                )
              );
            }
          } else {
            reject(new DataGouvApiError(500, "Service SIREN Indisponible"));
          }
        });
    });
  }
}

export const serviceGouv = new DataGouvApiService();
