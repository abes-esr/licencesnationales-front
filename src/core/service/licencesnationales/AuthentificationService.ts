import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import User from "@/core/User";

export class AuthentificationService extends LicencesNationalesApiService {
  /**
   * Appel API pour se logger et obtenir un getToken d'identification
   * @param data Json de login à l'API LicencesNationales
   * @return Json de réponse à l'authentification
   * @throws CredentialNotValidError si l'authentification a échoué
   * @throws HttpRequestError pour tout autre erreur
   */
  async login(login: string, password: string) {
    try {
      const result = await this.client.post<JsonLoginResponse>("/authentification/connexion", {
        login,
        password
      });
      return new User({
        id: result.data.id,
        token: result.data.accessToken,
        siren: result.data.userSiren,
        nameEtab: result.data.userNameEtab,
        isLoggedIn: true,
        isAdmin: result.data.role === "admin" ? true : false
      });
    } catch (err) {
      throw this.buildException(err);
    }
  }

  /**
   * Appel API pour réinitiliser son mot de passe avec son Siren
   * @param data
   */
  async motDePasseOublieSiren(data: { siren: string; recaptcha: string }) {
    try {
      const result = await this.client.post<JsonMotDePasseOublieResponse>(
        "/authentification/motDePasseOublie",
        data
      );
      return result.data;
    } catch (err) {
      throw this.buildException(err);
    }
  }

  /**
   * Appel API pour réinitiliser son mot de passe avec son email
   * @param data
   */
  async motDePasseOublieEmail(data: { email: string; recaptcha: string }) {
    try {
      const result = await this.client.post<JsonMotDePasseOublieResponse>(
        "/authentification/motDePasseOublie",
        data
      );
      return result.data;
    } catch (err) {
      throw this.buildException(err);
    }
  }

  async reinitialiserMotDePasse(data: {
    nouveauMotDePasse: string;
    token: string;
    recaptcha: string;
  }) {
    try {
      const result = await this.client.post<JsonReinitialiserMotDePasseResponse>(
        "/authentification/reinitialiserMotDePasse",
        data
      );
      return result.data;
    } catch (err) {
      throw this.buildException(err);
    }
  }

  async verifierValiditeToken(token: string) {
    try {
      const json: { token: string } = {
        token: token
      };
      const result = await this.client.post<JsonVerifierValiditeTokenResponse>(
        "/authentification/verifierValiditeToken",
        json
      );
      return result.data.estValide;
    } catch (err) {
      throw this.buildException(err);
    }
  }

  async changePassword(ancien: string, nouveau: string, token: string) {
    const json: { ancienMotDePasse: string; nouveauMotDePasse: string } = {
      ancienMotDePasse: ancien,
      nouveauMotDePasse: nouveau
    };
    try {
      await this.client.post("/authentification/modifierMotDePasse", json, token);
      return true;
    } catch (err) {
      throw this.buildException(err);
    }
  }

  async getVersion() {
    try {
      return await this.client.get("/applicationVersion");
    } catch (err) {
      throw this.buildException(err);
    }
  }
}

export const authService = new AuthentificationService();

/* JSON entrée / sortie */

export interface JsonLoginResponse {
  accessToken: string;
  tokenType: string;
  userNameEtab: string;
  isAdmin: boolean;
  userSiren: string;
  id: number;
  role: string;
}

export interface JsonMotDePasseOublieResponse {
  message: string;
}

export interface JsonReinitialiserMotDePasseResponse {
  message: string;
}

export interface JsonVerifierValiditeTokenResponse {
  estValide: boolean;
}
