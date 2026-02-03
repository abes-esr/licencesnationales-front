import Ip from "@/entity/Ip";

export interface JsonIpResponse {
  id?: number;
  ip?: string;
  idAbes?: string;
  dateCreation?: string;
  dateModification?: string | null;
  commentaires?: Array<string>;
  statut?: string;
  typeAcces?: string;
  typeIp?: string;
  siren?: string;
  nomEtab?: string;
}

export class IpMapper {
  static toDomainList(responses: Array<JsonIpResponse> = []): Array<Ip> {
    return responses.map((element) => this.toDomain(element));
  }

  static toDomain(response: JsonIpResponse): Ip {
    const ip = new Ip();
    if (response.id !== undefined) ip.id = response.id;
    if (response.ip !== undefined) ip.ip = response.ip;
    if (response.dateCreation) ip.createdAt = new Date(response.dateCreation);
    if (response.dateModification !== undefined) {
      ip.updatedAt = response.dateModification ? new Date(response.dateModification) : null;
    }
    if (response.commentaires !== undefined) ip.comments = response.commentaires;
    if (response.statut !== undefined) ip.status = response.statut;
    if (response.typeAcces !== undefined) ip.typeAcces = response.typeAcces;
    if (response.typeIp !== undefined) ip.typeIp = response.typeIp;
    this.applyInstitutionFallback(ip, response);
    return ip;
  }

  private static applyInstitutionFallback(ip: Ip, response: JsonIpResponse): void {
    if (response.idAbes !== undefined) ip.institution.abesId = response.idAbes;
    if (response.siren !== undefined) ip.institution.siren = response.siren;
    if (response.nomEtab !== undefined) ip.institution.name = response.nomEtab;
  }
}
