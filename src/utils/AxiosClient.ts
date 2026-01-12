import axios, { AxiosInstance, AxiosResponse } from "axios";

/**
 * Représente un client Axios pour envoyer et recevoir des requêtes HTTP avec
 * les méthodes POST et GET avec ou sans authentification
 */
class AxiosClient {
  client: AxiosInstance;

  constructor(url: string) {
    this.client = axios.create({
      baseURL: url
    });
    this.client.defaults.timeoutErrorMessage = "Délai d'attente dépassé";
  }

  /**
   * Appel HTTP POST
   * @param url URL de la requête HTTP
   * @param data Body de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: any,
    token?: string
  ): Promise<R> {
    // Si un token est renseigné, on le rajoute à l'entête
    let config;
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        },
        timeout: 1000 * 10
      };
    } else {
      config = {
        timeout: 1000 * 10
      };
    }
    return await this.client.post<T, R, D>(url, data, config);
  }

  /**
   * Appel HTTP PUT
   * @param url URL de la requête HTTP
   * @param data Body de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  put(url: string, data: any, token?: string): Promise<AxiosResponse> {
    // Si un token est renseigné, on le rajoute à l'entête
    let config;
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        },
        timeout: 1000 * 10
      };
    } else {
      config = {
        timeout: 1000 * 10
      };
    }

    return this.client.put(url, data, config);
  }

  /**
   * Appel HTTP GET
   * @param url URL de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  get(url: string, token?: string, param?: any, longRequest?: boolean): Promise<AxiosResponse> {
    // Si un token est renseigné, on le rajoute à l'entête
    let config;
    let timeout = 3000 * 10;
    if (longRequest) {
      timeout = 100000 * 10;
    }
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        },
        params: param,
        timeout: timeout
      };
    } else {
      config = {
        params: param,
        timeout: timeout
      };
    }

    return this.client.get(url, config);
  }

  /**
   * Appel HTTP DELETE
   * @param url URL de la requête HTTP
   * @param data Body de la requête HTTP
   * @param token Token Bearer à ajouter à l'entête
   */
  delete(url: string, data: any, token?: string): Promise<AxiosResponse> {
    // Si un getToken est renseigné, on le rajoute à l'entête
    let config;
    if (token) {
      config = {
        headers: {
          Authorization: "Bearer " + token
        },
        timeout: 1000 * 10,
        data: data
      };
    } else {
      config = {
        timeout: 1000 * 10,
        data: data
      };
    }
    return this.client.delete(url, config);
  }
}

export default AxiosClient;
