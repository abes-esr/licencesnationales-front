import Institution from "@/entity/Institution";
import {
  InstitutionContactMapper,
  JsonCreateInstitutionContact,
  JsonInstitutionContactResponse,
  JsonUpdateInstitutionContact
} from "@/mapper/InstitutionContactMapper";
import { DateUtils } from "@/utils/DateUtils";

export interface JsonInstitutionResponse {
  id?: number;
  nomEtab?: string;
  nom?: string;
  siren?: string;
  dateCreation?: string;
  dateModificationDerniereIp?: string;
  typeEtablissement?: string;
  statut?: string;
  statutIps?: string;
  idAbes?: string;
  contact?: JsonInstitutionContactResponse;
  nomContact?: string;
  prenomContact?: string;
  mailContact?: string;
  adresseContact?: string;
  villeContact?: string;
  cpContact?: string;
}

export interface JsonCreateInstitution {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonCreateInstitutionContact;
  recaptcha: string;
}

export interface JsonUpdateInstitution {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonUpdateInstitutionContact;
  role: string;
}

export class InstitutionMapper {
  static toDomain(response: JsonInstitutionResponse): Institution {
    const institution = new Institution();
    if (response.id !== undefined) institution.id = response.id;
    if (response.nomEtab !== undefined) institution.name = response.nomEtab;
    if (response.nom !== undefined) institution.name = response.nom;
    if (response.siren !== undefined) institution.siren = response.siren;
    if (response.dateCreation) {
      institution.createdAt = DateUtils.stringToDate(response.dateCreation, "dd-MM-yyyy", "-");
    }
    if (response.typeEtablissement !== undefined) {
      institution.institutionType = response.typeEtablissement;
    }
    if (response.statut !== undefined) institution.status = response.statut;
    if (response.statutIps !== undefined) institution.ipStatus = response.statutIps;
    if (response.idAbes !== undefined) institution.abesId = response.idAbes;
    if (response.dateModificationDerniereIp !== undefined)
      institution.lastIpUpdateDate = response.dateModificationDerniereIp;
    institution.contact = InstitutionContactMapper.toDomain(response.contact);
    this.applyContactFallback(institution, response);
    return institution;
  }

  static toDomainList(responses: Array<JsonInstitutionResponse> = []): Array<Institution> {
    return responses.map((element) => this.toDomain(element));
  }

  static toCreatePayload(institution: Institution, recaptchaToken: string): JsonCreateInstitution {
    return {
      nom: institution.name,
      siren: institution.siren,
      typeEtablissement: institution.institutionType?.toString() ?? "",
      contact: InstitutionContactMapper.toCreatePayload(institution.contact),
      recaptcha: recaptchaToken
    };
  }

  static toUpdatePayload(institution: Institution, isAdmin: boolean): JsonUpdateInstitution {
    return {
      nom: institution.name,
      siren: institution.siren,
      typeEtablissement: institution.institutionType ?? "",
      contact: InstitutionContactMapper.toUpdatePayload(institution.contact),
      role: isAdmin ? "admin" : "etab"
    };
  }

  private static applyContactFallback(
    institution: Institution,
    response: JsonInstitutionResponse
  ): void {
    if (response.nomContact !== undefined) institution.contact.lastName = response.nomContact;
    if (response.prenomContact !== undefined)
      institution.contact.firstName = response.prenomContact;
    if (response.mailContact !== undefined) institution.contact.email = response.mailContact;
    if (response.adresseContact !== undefined)
      institution.contact.address = response.adresseContact;
    if (response.villeContact !== undefined) institution.contact.city = response.villeContact;
    if (response.cpContact !== undefined) institution.contact.postalCode = response.cpContact;
  }
}
