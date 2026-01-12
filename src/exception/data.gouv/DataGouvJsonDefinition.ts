/**
 * Définitions des formats Json utilisés par l'API Data Gouv
 */

export interface JsonCheckSirenResponse {
  uniteLegale: JsonCheckSirenInfo;
}

export interface JsonCheckSirenInfo {
  periodesUniteLegale: JsonCheckSirenInfoDetails;
}

export interface JsonCheckSirenInfoDetails {
  denominationUniteLegal: string;
}
