import { useApiService } from "@/composables/service/useApiService";
import Institution from "@/entity/Institution";
import Notification from "@/entity/Notification";
import {
  InstitutionMapper,
  JsonCreateInstitution,
  JsonInstitutionResponse,
  JsonUpdateInstitution
} from "@/mapper/InstitutionMapper";
import { NotificationMapper } from "@/mapper/NotificationMapper";

interface JsonInstitutionTypeResponse {
  libelle: string;
}

interface JsonNotificationUserResponse {
  message: string;
  description: string;
}

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

export const useInstitutionService = () => {
  const api = useApiService();

  const createInstitution = async (
    institution: Institution,
    tokenrecaptcha: string
  ): Promise<boolean> => {
    const json: JsonCreateInstitution = InstitutionMapper.toCreatePayload(
      institution,
      tokenrecaptcha
    );
    await api.put("/etablissements", json);
    return true;
  };

  const listInstitutionTypes = async (): Promise<Array<string>> => {
    const result = await api.get("/etablissements/getType");
    const response: Array<JsonInstitutionTypeResponse> = result.data;
    return response.map((element) => element.libelle);
  };

  const getInstitutions = async (token: string): Promise<Array<Institution>> => {
    const result = await api.get("/etablissements/", token, {}, true);
    const response: Array<JsonInstitutionResponse> = result.data ?? [];
    return InstitutionMapper.toDomainList(response);
  };

  const getInstitution = async (siren: string, token: string): Promise<Institution> => {
    const result = await api.get("/etablissements/" + siren, token);
    const response: JsonInstitutionResponse = result.data;
    return InstitutionMapper.toDomain(response);
  };

  const updateInstitution = async (
    institution: Institution,
    token: string,
    isAdmin: boolean
  ): Promise<boolean> => {
    const json: JsonUpdateInstitution = InstitutionMapper.toUpdatePayload(institution, isAdmin);

    await api.post("/etablissements/" + institution.siren, json, token);
    return true;
  };

  const deleteInstitution = async (siren: string, token: string): Promise<boolean> => {
    await api.del("/etablissements/" + siren, null, token);
    return true;
  };

  const validateInstitution = async (siren: string, token: string) =>
    api.post("/etablissements/validation/" + siren, null, token);

  const invalidateInstitution = async (siren: string, token: string) =>
    api.post("/etablissements/devalidation/" + siren, null, token);

  const mergeInstitutions = async (token: string, data: any) =>
    api.post("/etablissements/mergeInstitutions", data, token);

  const splitInstitution = async (token: string, data: any) =>
    api.post("/etablissements/splitInstitution", data, token);

  const downloadInstitutions = async (sirens: Array<string>, token: string) => {
    const response = await api.post("/etablissements/export", sirens, token);
    return response;
  };

  const getAdminNotifications = async (token: string): Promise<Array<Notification>> => {
    const result = await api.get("/etablissements/notificationsAdmin/", token, {}, true);
    return NotificationMapper.toDomainList(result.data["notifications"]);
  };

  const getInstitutionNotifications = async (
    siren: string,
    token: string
  ): Promise<Array<NotificationUser>> => {
    const result = await api.get("/etablissements/notifications/" + siren, token);
    const response: Array<JsonNotificationUserResponse> = result.data["notifications"];
    const notifs: Array<NotificationUser> = [];
    response.forEach(function (element, i) {
      notifs.push({
        index: i,
        message: element.message,
        description: element.description
      });
    });
    return notifs;
  };

  const search = async (criteres: Array<string>, token: string) => {
    const result = await api.post("/etablissements/search/", criteres, token);
    const response: Array<JsonInstitutionResponse> = result.data ?? [];
    return InstitutionMapper.toDomainList(response);
  };

  const getHistory = async (siren: string, token: string) =>
    api.get("/etablissements/histo/" + siren, token);

  const getStats = async (dateDebut: string, dateFin: string, token: string) =>
    api.get("/etablissements/stats?dateDebut=" + dateDebut + "&dateFin=" + dateFin, token);

  return {
    createInstitution,
    listInstitutionTypes,
    getInstitutions,
    getInstitution,
    updateInstitution,
    deleteInstitution,
    validateInstitution,
    invalidateInstitution,
    mergeInstitutions,
    splitInstitution,
    downloadInstitutions,
    getAdminNotifications,
    getInstitutionNotifications,
    search,
    getHistory,
    getStats
  };
};
