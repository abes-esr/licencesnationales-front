import { useApiService } from "@/composables/useApiService";

export const useIpService = () => {
  const api = useApiService();

  const getListIP = (token: string, siren: string) =>
    api.get(`/ip/${siren}`, token);

  const getListIPEtab = (token: string, siren: string) =>
    api.get(`/ip/ipsEtab/${siren}`, token);

  const getIPInfos = (token: string, data: any) =>
    api.post("/ip/getIpEntity", data, token);

  const addIP = (token: string, siren: string, data: any) =>
    api.put(`/ip/${siren}`, data, token);

  const updateIP = (token: string, siren: string, data: any) =>
    api.post(`/ip/gerer/${siren}`, data, token);

  const deleteIP = (token: string, id: string) =>
    api.del(`/ip/${id}`, null, token);

  const getWhoIs = (token: string, ip: string) =>
    api.get(`/ip/whois/${ip}`, token);

  const search = (criteres: Array<string>, token: string) =>
    api.post("/ip/search/", criteres, token);

  const getHisto = (siren: string, token: string) =>
    api.get(`/ip/histo/${siren}`, token);

  const getStats = (dateDebut: string, dateFin: string, token: string) =>
    api.get(`/ip/stats?dateDebut=${dateDebut}&dateFin=${dateFin}`, token);

  const downloadIPs = (siren: string, token: string) =>
    api.post(`/ip/export/${siren}`, null, token);

  return {
    getListIP,
    getListIPEtab,
    getIPInfos,
    addIP,
    updateIP,
    deleteIP,
    getWhoIs,
    search,
    getHisto,
    getStats,
    downloadIPs
  };
};
