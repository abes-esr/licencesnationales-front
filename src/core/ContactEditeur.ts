import { ContactType } from "@/core/CommonDefinition";

export class ContactEditeur {
  id: number = -999;
  nom: string = "";
  prenom: string = "";
  mail: string = "";
  type: ContactType = ContactType.COMMERCIAL;
}
export default ContactEditeur;
