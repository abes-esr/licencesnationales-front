import PublisherContact, { ContactType } from "@/entity/PublisherContact";

export interface JsonPublisherContactResponse {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
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
  static toDomain(response: JsonPublisherContactResponse, type: ContactType): PublisherContact {
    const contact = new PublisherContact();
    contact.id = response.id;
    contact.lastName = response.nom;
    contact.type = type;
    contact.firstName = response.prenom;
    contact.email = response.mail;
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
