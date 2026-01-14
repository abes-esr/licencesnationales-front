export enum ContactType {
  TECHNIQUE,
  COMMERCIAL
}

export class PublisherContact {
  id: number = -999;
  nom: string = "";
  prenom: string = "";
  mail: string = "";
  type: ContactType = ContactType.COMMERCIAL;
}
export default PublisherContact;
