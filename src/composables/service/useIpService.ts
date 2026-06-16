import { useApiService } from "@/composables/service/useApiService";
import { IpMapper, JsonIpResponse } from "@/mapper/IpMapper";

export const useIpService = () => {
  const api = useApiService();

  const getListIP = async (token: string, siren: string) => {
    const result = await api.get(`/ip/${siren}`, token);
    const response: Array<JsonIpResponse> = result.data ?? [];
    return IpMapper.toDomainList(response);
  };

  const getInstitutionIpList = async (token: string, siren: string) => {
    const result = await api.get(`/ip/ipsEtab/${siren}`, token);
    const response: Array<JsonIpResponse> = result.data ?? [];
    return IpMapper.toDomainList(response);
  };

  const getIPInfos = async (token: string, data: any) => {
    const result = await api.post("/ip/getIpEntity", data, token);
    const response: JsonIpResponse = result.data ?? {};
    return IpMapper.toDomain(response);
  };

  const addIP = async (token: string, siren: string, data: any) =>
    api.put(`/ip/${siren}`, data, token);

  const updateIP = async (token: string, siren: string, data: any) =>
    api.post(`/ip/gerer/${siren}`, data, token);

  const deleteIP = async (token: string, id: string) => api.del(`/ip/${id}`, null, token);

  const getWhoIs = async (token: string, ip: string) => api.get(`/ip/whois/${ip}`, token);

  const search = async (criteres: Array<string>, token: string) => {
    const result = await api.post("/ip/search/", criteres, token);
    const response: Array<JsonIpResponse> = result.data ?? [];
    return IpMapper.toDomainList(response);
  };

  const getHistory = async (siren: string, token: string) => api.get(`/ip/histo/${siren}`, token);

  const getStats = async (dateDebut: string, dateFin: string, token: string) =>
    api.get(`/ip/stats?dateDebut=${dateDebut}&dateFin=${dateFin}`, token);

  const downloadIPs = async (siren: string, token: string) =>
    api.post(`/ip/export/${siren}`, null, token);

  return {
    getListIP,
    getInstitutionIpList,
    getIPInfos,
    addIP,
    updateIP,
    deleteIP,
    getWhoIs,
    search,
    getHistory,
    getStats,
    downloadIPs
  };
};
