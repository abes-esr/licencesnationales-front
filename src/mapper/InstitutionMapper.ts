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
    institution.nom = response.nom;
    institution.siren = response.siren;
    institution.dateCreation = DateUtils.stringToDate(
      response.dateCreation,
      "dd-MM-yyyy",
      "-"
    );
    institution.typeEtablissement = response.typeEtablissement;
    institution.statut = response.statut;
    institution.statutIP = response.statutIps;
    institution.idAbes = response.idAbes;
    institution.contact = InstitutionContactMapper.toDomain(response.contact);
    return institution;
  }

  static toDomainList(responses: Array<JsonSimpleInstitutionResponse>): Array<Institution> {
    return responses.map((element) => this.toSimpleDomain(element));
  }

  static toSimpleDomain(response: JsonSimpleInstitutionResponse): Institution {
    const institution = new Institution();
    institution.id = response.id;
    institution.nom = response.nom;
    institution.siren = response.siren;
    institution.dateCreation = DateUtils.stringToDate(
      response.dateCreation,
      "dd-MM-yyyy",
      "-"
    );
    institution.dateModificationDerniereIp = response.dateModificationDerniereIp;
    institution.typeEtablissement = response.typeEtablissement;
    institution.statut = response.statut;
    institution.statutIP = response.statutIps;
    institution.idAbes = response.idAbes;
    return institution;
  }

  static toCreatePayload(institution: Institution, recaptchaToken: string): JsonCreateInstitution {
    return {
      nom: institution.nom,
      siren: institution.siren,
      typeEtablissement: institution.typeEtablissement.toString(),
      contact: InstitutionContactMapper.toCreatePayload(institution.contact),
      recaptcha: recaptchaToken
    };
  }

  static toUpdatePayload(institution: Institution, isAdmin: boolean): JsonUpdateInstitution {
    return {
      nom: institution.nom,
      siren: institution.siren,
      typeEtablissement: institution.typeEtablissement,
      contact: InstitutionContactMapper.toUpdatePayload(institution.contact),
      role: isAdmin ? "admin" : "etab"
    };
  }
}


