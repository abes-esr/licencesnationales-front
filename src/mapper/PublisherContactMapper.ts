import PublisherContact, { ContactType } from "@/entity/PublisherContact";

export interface JsonPublisherContactResponse {
  id?: number;
  nom?: string;
  prenom?: string;
  mail?: string;
}

export interface JsonCreatePublisherContactRequest {
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonUpdatePublisherContactRequest {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

export class PublisherContactMapper {
  static toDomain(response: JsonPublisherContactResponse | undefined, type: ContactType): PublisherContact {
    const contact = new PublisherContact();
    contact.type = type;
    if (!response) {
      return contact;
    }
    if (response.id !== undefined) contact.id = response.id;
    if (response.nom !== undefined) contact.lastName = response.nom;
    if (response.prenom !== undefined) contact.firstName = response.prenom;
    if (response.mail !== undefined) contact.email = response.mail;
    return contact;
  }

  static toCreatePayload(contact: PublisherContact): JsonCreatePublisherContactRequest {
    return {
      nom: contact.lastName,
      prenom: contact.firstName,
      mail: contact.email
    };
  }

  static toUpdatePayload(contact: PublisherContact): JsonUpdatePublisherContactRequest {
    return {
      id: contact.id,
      nom: contact.lastName,
      prenom: contact.firstName,
      mail: contact.email
    };
  }
}
