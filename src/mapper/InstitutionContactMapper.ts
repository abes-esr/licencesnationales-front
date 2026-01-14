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
    contact.nom = response.nom;
    contact.prenom = response.prenom;
    contact.adresse = response.adresse;
    contact.boitePostale = response.boitePostale;
    contact.codePostal = response.codePostal;
    contact.ville = response.ville;
    contact.cedex = response.cedex;
    contact.telephone = response.telephone;
    contact.mail = response.mail;
    return contact;
  }

  static toCreatePayload(contact: InstitutionContact): JsonCreateInstitutionContact {
    return {
      nom: contact.nom,
      prenom: contact.prenom,
      adresse: contact.adresse,
      boitePostale: contact.boitePostale,
      codePostal: contact.codePostal,
      ville: contact.ville,
      cedex: contact.cedex,
      telephone: contact.telephone,
      mail: contact.mail,
      motDePasse: contact.motDePasse
    };
  }

  static toUpdatePayload(contact: InstitutionContact): JsonUpdateInstitutionContact {
    return {
      nom: contact.nom,
      prenom: contact.prenom,
      adresse: contact.adresse,
      boitePostale: contact.boitePostale,
      codePostal: contact.codePostal,
      ville: contact.ville,
      cedex: contact.cedex,
      telephone: contact.telephone,
      mail: contact.mail,
      role: contact.role
    };
  }
}

