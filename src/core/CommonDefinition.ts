/**
 * Définitions des structures de données communes
 */

export enum Action {
  CREATION = "CREATION",
  MODIFICATION = "MODIFICATION",
  VISUALISER = "VISUALISER",
  FUSION = "FUSION",
  SCISSION = "SCISSION"
}

export interface SegmentPlage {
  length: number;
  value: string;
}

export interface List {
  id: number;
  value: string;
}

export enum ContactType {
  TECHNIQUE,
  COMMERCIAL
}

export interface ConfirmPopupOptions {
  color: string;
  width: string;
}

export enum MessageType {
  ERREUR,
  INFORMATION,
  AVERTISSEMENT,
  VALIDATION
}
