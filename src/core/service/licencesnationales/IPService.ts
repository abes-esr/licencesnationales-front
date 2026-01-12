import { AxiosResponse } from "axios";
import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";

export class IPService extends LicencesNationalesApiService {
  getListIP(token: string, siren): Promise<AxiosResponse> {
    return this.client.get("/ip/" + siren, token);
  }

  getListIPEtab(token: string, siren): Promise<AxiosResponse> {
    return this.client.get("/ip/ipsEtab/" + siren, token);
  }

  getIPInfos(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/getIpEntity", data, token);
  }

  addIP(token: string, siren: string, data: any): Promise<AxiosResponse> {
    return this.client.put("/ip/" + siren, data, token);
  }

  updateIP(token: string, siren: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/ip/gerer/" + siren, data, token);
  }

  deleteIP(token: string, id): Promise<AxiosResponse> {
    return this.client.delete("/ip/" + id, null, token);
  }

  getWhoIs(token: string, ip): Promise<AxiosResponse> {
    return this.client.get("/ip/whois/" + ip, token);
  }

  search(criteres: Array<string>, token: string): Promise<AxiosResponse> {
    return this.client.post("/ip/search/", criteres, token);
  }

  getHisto(siren: string, token: string): Promise<AxiosResponse> {
    return this.client.get("/ip/histo/" + siren, token);
  }

  getStats(
    dateDebut: string,
    dateFin: string,
    token: string
  ): Promise<AxiosResponse> {
    return this.client.get(
      "/ip/stats?dateDebut=" + dateDebut + "&dateFin=" + dateFin,
      token
    );
  }

  /**
   * Appel API pour telecharger la liste des ip d'un etab
   * @param siren siren du proprietaire d'ips
   * @param token Jeton de session
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  async downloadIPs(siren: string, token: string): Promise<any> {
    try {
      const response = await this.client.post("/ip/export/" + siren, null, token);
      return response;
    } catch (err) {
      throw this.buildException(err);
    }
  }
}

export const iPService = new IPService();

/* JSON entrée / sortie */
