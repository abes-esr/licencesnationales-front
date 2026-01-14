import { PublisherMapper } from "@/mapper/PublisherMapper";
import {
  JsonCreatePublisherRequest,
  JsonPublisherResponse,
  JsonSimplePublisherResponse,
  JsonUpdatePublisherRequest
} from "@/mapper/PublisherMapper";
import { useApiService } from "@/composables/service/useApiService";
import Publisher from "@/entity/Publisher";

export const usePublisherService = () => {
  const api = useApiService();

  const createPublisher = async (publisher: Publisher, token: string): Promise<boolean> => {
    const json: JsonCreatePublisherRequest = PublisherMapper.toCreatePayload(publisher);
    await api.put("/editeurs/", json, token);
    return true;
  };

  const updatePublisher = async (publisher: Publisher, token: string): Promise<boolean> => {
    const json: JsonUpdatePublisherRequest = PublisherMapper.toUpdatePayload(publisher);
    await api.post("/editeurs/" + publisher.id, json, token);
    return true;
  };

  const getPublishers = async (token: string): Promise<Array<Publisher>> => {
    const result = await api.get("/editeurs", token);
    const response: Array<JsonSimplePublisherResponse> = result.data;
    return PublisherMapper.toDomainList(response);
  };

  const getPublisher = async (id: number, token: string): Promise<Publisher> => {
    const result = await api.get("/editeurs/" + id, token);
    const response: JsonPublisherResponse = result.data;
    return PublisherMapper.toDomain(response);
  };

  const deletePublisher = async (id: number, token: string): Promise<boolean> => {
    await api.del("/editeurs/" + id, null, token);
    return true;
  };

  const downloadPublishers = async (ids: Array<number>, token: string): Promise<any> => {
    const response = await api.post("/editeurs/export", ids, token);
    return response;
  };

  const search = (criteres: Array<string>, token: string) =>
    api.post("/editeurs/search/", criteres, token);

  const sendPublishers = (token: string) => api.get("/editeurs/exportMensuelEditeur/", token);

  const getPublisherSendDates = (token: string) =>
    api.get("/editeurs/getDateEnvoiEditeur/", token);

  return {
    createPublisher,
    updatePublisher,
    getPublishers,
    getPublisher,
    deletePublisher,
    downloadPublishers,
    search,
    sendPublishers,
    getPublisherSendDates
  };
};



