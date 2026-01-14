export enum ContactType {
  TECHNIQUE,
  COMMERCIAL
}

export class PublisherContact {
  id: number = -999;
  lastName: string = "";
  firstName: string = "";
  email: string = "";
  type: ContactType = ContactType.COMMERCIAL;
}
export default PublisherContact;
