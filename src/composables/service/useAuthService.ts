import { UserMapper } from "@/mapper/UserMapper";
import { JsonLoginResponse } from "@/mapper/UserMapper";
import { useApiService } from "@/composables/service/useApiService";
import User from "@/entity/User";

export interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface VerifyTokenResponse {
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
    return UserMapper.toDomain(response);
  };

  const forgotPasswordBySiren = async (data: { siren: string; recaptcha: string }) => {
    const result = await api.post("/authentification/motDePasseOublie", data);
    return result.data as ForgotPasswordResponse;
  };

  const forgotPasswordByEmail = async (data: { email: string; recaptcha: string }) => {
    const result = await api.post("/authentification/motDePasseOublie", data);
    return result.data as ForgotPasswordResponse;
  };

  const resetPassword = async (data: {
    nouveauMotDePasse: string;
    token: string;
    recaptcha: string;
  }) => {
    const result = await api.post("/authentification/reinitialiserMotDePasse", data);
    return result.data as ResetPasswordResponse;
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    const result = await api.post("/authentification/verifierValiditeToken", { token });
    const response = result.data as VerifyTokenResponse;
    return response.estValide;
  };

  const changePassword = async (oldPassword: string, newPassword: string, token: string) => {
    await api.post(
      "/authentification/modifierMotDePasse",
      { ancienMotDePasse: oldPassword, nouveauMotDePasse: newPassword },
      token
    );
    return true;
  };

  const getVersion = () => api.get("/applicationVersion");

  return {
    login,
    forgotPasswordBySiren,
    forgotPasswordByEmail,
    resetPassword,
    verifyToken,
    changePassword,
    getVersion
  };
};



