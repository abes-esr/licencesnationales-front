import InstitutionContact from "@/entity/InstitutionContact";

export interface JsonInstitutionContactResponse {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
}

export interface JsonCreateInstitutionContact {
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
  motDePasse: string;
}

export interface JsonUpdateInstitutionContact {
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
  role: string;
}

export class InstitutionContactMapper {
  static toDomain(response: JsonInstitutionContactResponse): InstitutionContact {
    const contact = new InstitutionContact();
    contact.id = response.id;
    contact.lastName = response.nom;
    contact.firstName = response.prenom;
    contact.address = response.adresse;
    contact.poBox = response.boitePostale;
    contact.postalCode = response.codePostal;
    contact.city = response.ville;
    contact.cedex = response.cedex;
    contact.phone = response.telephone;
    contact.email = response.mail;
    return contact;
  }

  static toCreatePayload(contact: InstitutionContact): JsonCreateInstitutionContact {
    return {
      nom: contact.lastName,
      prenom: contact.firstName,
      adresse: contact.address,
      boitePostale: contact.poBox,
      codePostal: contact.postalCode,
      ville: contact.city,
      cedex: contact.cedex,
      telephone: contact.phone,
      mail: contact.email,
      motDePasse: contact.password
    };
  }

  static toUpdatePayload(contact: InstitutionContact): JsonUpdateInstitutionContact {
    return {
      nom: contact.lastName,
      prenom: contact.firstName,
      adresse: contact.address,
      boitePostale: contact.poBox,
      codePostal: contact.postalCode,
      ville: contact.city,
      cedex: contact.cedex,
      telephone: contact.phone,
      mail: contact.email,
      role: contact.role
    };
  }
}

