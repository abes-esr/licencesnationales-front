import User from "@/core/User";
import { useApiService } from "@/composables/useApiService";

interface JsonLoginResponse {
  accessToken: string;
  tokenType: string;
  userNameEtab: string;
  isAdmin: boolean;
  userSiren: string;
  id: number;
  role: string;
}

interface JsonMotDePasseOublieResponse {
  message: string;
}

interface JsonReinitialiserMotDePasseResponse {
  message: string;
}

interface JsonVerifierValiditeTokenResponse {
  estValide: boolean;
}

export const useAuthService = () => {
  const api = useApiService();

  const login = async (loginValue: string, password: string): Promise<User> => {
    const result = await api.post("/authentification/connexion", {
      login: loginValue,
      password
    });
    const response = result.data as JsonLoginResponse;
    const user: User = new User();
    user.id = response.id;
    user.token = response.accessToken;
    user.nameEtab = response.userNameEtab;
    user.siren = response.userSiren;
    user.isAdmin = response.role === "admin" ? true : false;
    user.isLoggedIn = true;
    return user;
  };

  const motDePasseOublieSiren = async (data: { siren: string; recaptcha: string }) => {
    const result = await api.post("/authentification/motDePasseOublie", data);
    return result.data as JsonMotDePasseOublieResponse;
  };

  const motDePasseOublieEmail = async (data: { email: string; recaptcha: string }) => {
    const result = await api.post("/authentification/motDePasseOublie", data);
    return result.data as JsonMotDePasseOublieResponse;
  };

  const reinitialiserMotDePasse = async (data: {
    nouveauMotDePasse: string;
    token: string;
    recaptcha: string;
  }) => {
    const result = await api.post("/authentification/reinitialiserMotDePasse", data);
    return result.data as JsonReinitialiserMotDePasseResponse;
  };

  const verifierValiditeToken = async (token: string): Promise<boolean> => {
    const result = await api.post("/authentification/verifierValiditeToken", { token });
    const response = result.data as JsonVerifierValiditeTokenResponse;
    return response.estValide;
  };

  const changePassword = async (ancien: string, nouveau: string, token: string) => {
    await api.post(
      "/authentification/modifierMotDePasse",
      { ancienMotDePasse: ancien, nouveauMotDePasse: nouveau },
      token
    );
    return true;
  };

  const getVersion = () => api.get("/applicationVersion");

  return {
    login,
    motDePasseOublieSiren,
    motDePasseOublieEmail,
    reinitialiserMotDePasse,
    verifierValiditeToken,
    changePassword,
    getVersion
  };
};
