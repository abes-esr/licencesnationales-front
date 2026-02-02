import InstitutionContact from "@/entity/InstitutionContact";

export interface JsonInstitutionContactResponse {
  id?: number;
  nom?: string;
  prenom?: string;
  adresse?: string;
  boitePostale?: string;
  codePostal?: string;
  ville?: string;
  cedex?: string;
  telephone?: string;
  mail?: string;
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
  static toDomain(response: JsonInstitutionContactResponse | undefined): InstitutionContact {
    const contact = new InstitutionContact();
    if (!response) {
      return contact;
    }
    if (response.id !== undefined) contact.id = response.id;
    if (response.nom !== undefined) contact.lastName = response.nom;
    if (response.prenom !== undefined) contact.firstName = response.prenom;
    if (response.adresse !== undefined) contact.address = response.adresse;
    if (response.boitePostale !== undefined) contact.poBox = response.boitePostale;
    if (response.codePostal !== undefined) contact.postalCode = response.codePostal;
    if (response.ville !== undefined) contact.city = response.ville;
    if (response.cedex !== undefined) contact.cedex = response.cedex;
    if (response.telephone !== undefined) contact.phone = response.telephone;
    if (response.mail !== undefined) contact.email = response.mail;
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

