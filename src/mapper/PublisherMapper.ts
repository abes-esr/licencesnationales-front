import Publisher from "@/entity/Publisher";
import { ContactType } from "@/entity/PublisherContact";
import {
  JsonCreatePublisherContactRequest,
  JsonPublisherContactResponse,
  JsonUpdatePublisherContactRequest,
  PublisherContactMapper
} from "@/mapper/PublisherContactMapper";

export interface JsonCreatePublisherRequest {
  nom: string;
  identifiantBis: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonCreatePublisherContactRequest>;
  contactsTechniques: Array<JsonCreatePublisherContactRequest>;
}

export interface JsonSimplePublisherResponse {
  id: number;
  nom: string;
  dateCreation: string;
}

export interface JsonPublisherResponse {
  id: number;
  nom: string;
  identifiantBis: string;
  dateCreation: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonPublisherContactResponse>;
  contactsTechniques: Array<JsonPublisherContactResponse>;
}

export interface JsonUpdatePublisherRequest {
  id: number;
  nom: string;
  identifiantBis: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonUpdatePublisherContactRequest>;
  contactsTechniques: Array<JsonUpdatePublisherContactRequest>;
}

export class PublisherMapper {
  static toDomainList(responses: Array<JsonSimplePublisherResponse>): Array<Publisher> {
    return responses.map((element) => this.toSimpleDomain(element));
  }

  static toSimpleDomain(response: JsonSimplePublisherResponse): Publisher {
    const publisher = new Publisher();
    publisher.id = response.id;
    publisher.name = response.nom;
    publisher.createdAt = new Date(response.dateCreation);
    return publisher;
  }

  static toDomain(response: JsonPublisherResponse): Publisher {
    const publisher = new Publisher();
    publisher.id = response.id;
    publisher.name = response.nom;
    publisher.createdAt = new Date(response.dateCreation);
    publisher.relatedInstitutionTypes = response.typesEtablissements;
    publisher.secondaryId = response.identifiantBis;
    publisher.address = response.adresse;

    response.contactsCommerciaux.forEach((element) => {
      publisher.addContact(PublisherContactMapper.toDomain(element, ContactType.COMMERCIAL));
    });

    response.contactsTechniques.forEach((element) => {
      publisher.addContact(PublisherContactMapper.toDomain(element, ContactType.TECHNIQUE));
    });

    return publisher;
  }

  static toCreatePayload(publisher: Publisher): JsonCreatePublisherRequest {
    const { commercial, technical } = this.splitContacts(publisher);
    return {
      nom: publisher.name,
      identifiantBis: publisher.secondaryId,
      typesEtablissements: publisher.relatedInstitutionTypes,
      adresse: publisher.address,
      contactsCommerciaux: commercial.map(PublisherContactMapper.toCreatePayload),
      contactsTechniques: technical.map(PublisherContactMapper.toCreatePayload)
    };
  }

  static toUpdatePayload(publisher: Publisher): JsonUpdatePublisherRequest {
    const { commercial, technical } = this.splitContacts(publisher);
    return {
      id: publisher.id,
      nom: publisher.name,
      identifiantBis: publisher.secondaryId,
      typesEtablissements: publisher.relatedInstitutionTypes,
      adresse: publisher.address,
      contactsCommerciaux: commercial.map(PublisherContactMapper.toUpdatePayload),
      contactsTechniques: technical.map(PublisherContactMapper.toUpdatePayload)
    };
  }

  private static splitContacts(publisher: Publisher) {
    const commercial = publisher.contacts.filter(
      (contact) => contact.type === ContactType.COMMERCIAL
    );
    const technical = publisher.contacts.filter(
      (contact) => contact.type === ContactType.TECHNIQUE
    );
    return { commercial, technical };
  }
}
