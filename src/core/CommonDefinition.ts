/**
 * Définitions des structures de données communes
 */

export enum Action {
  CREATION,
  MODIFICATION,
  VISUALISER
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

export class Message {
  isDisplayed = false;
  isSticky = false;
  isMultiline = true;
  type: MessageType = MessageType.INFORMATION;
  texte = "";
}
