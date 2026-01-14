import Institution from "@/entity/Institution";
import { DateUtils } from "@/utils/DateUtils";
import {
  InstitutionContactMapper,
  JsonCreateInstitutionContact,
  JsonInstitutionContactResponse,
  JsonUpdateInstitutionContact
} from "@/mapper/InstitutionContactMapper";

export interface JsonInstitutionResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  typeEtablissement: string;
  statut: string;
  statutIps: string;
  idAbes: string;
  contact: JsonInstitutionContactResponse;
}

export interface JsonSimpleInstitutionResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  dateModificationDerniereIp: string;
  typeEtablissement: string;
  statut: string;
  statutIps: string;
  idAbes: string;
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
    institution.id = response.id;
    institution.name = response.nom;
    institution.siren = response.siren;
    institution.createdAt = DateUtils.stringToDate(
      response.dateCreation,
      "dd-MM-yyyy",
      "-"
    );
    institution.institutionType = response.typeEtablissement;
    institution.status = response.statut;
    institution.ipStatus = response.statutIps;
    institution.abesId = response.idAbes;
    institution.contact = InstitutionContactMapper.toDomain(response.contact);
    return institution;
  }

  static toDomainList(responses: Array<JsonSimpleInstitutionResponse>): Array<Institution> {
    return responses.map((element) => this.toSimpleDomain(element));
  }

  static toSimpleDomain(response: JsonSimpleInstitutionResponse): Institution {
    const institution = new Institution();
    institution.id = response.id;
    institution.name = response.nom;
    institution.siren = response.siren;
    institution.createdAt = DateUtils.stringToDate(
      response.dateCreation,
      "dd-MM-yyyy",
      "-"
    );
    institution.lastIpUpdateDate = response.dateModificationDerniereIp;
    institution.institutionType = response.typeEtablissement;
    institution.status = response.statut;
    institution.ipStatus = response.statutIps;
    institution.abesId = response.idAbes;
    return institution;
  }

  static toCreatePayload(institution: Institution, recaptchaToken: string): JsonCreateInstitution {
    return {
      nom: institution.name,
      siren: institution.siren,
      typeEtablissement: institution.institutionType.toString(),
      contact: InstitutionContactMapper.toCreatePayload(institution.contact),
      recaptcha: recaptchaToken
    };
  }

  static toUpdatePayload(institution: Institution, isAdmin: boolean): JsonUpdateInstitution {
    return {
      nom: institution.name,
      siren: institution.siren,
      typeEtablissement: institution.institutionType,
      contact: InstitutionContactMapper.toUpdatePayload(institution.contact),
      role: isAdmin ? "admin" : "etab"
    };
  }
}


