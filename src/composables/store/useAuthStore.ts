import { useAuthService } from "@/composables/service/useAuthService";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import Institution from "@/entity/Institution";
import User from "@/entity/User";
import router, { RouteName } from "@/router";
import { defineStore } from "pinia";

const authService = useAuthService();
const institutionService = useInstitutionService();

interface AuthState {
  user: User;
  connectedInstitution: Institution;
  adminInstitutionSiren: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: new User(),
    connectedInstitution: new Institution(),
    adminInstitutionSiren: ""
  }),

  getters: {
    isLoggedIn: (state) => state.user.isLoggedIn,
    isAdmin: (state) => state.user.isAdmin,
    userSiren: (state) => state.user.siren,
    userInstitutionName: (state) => state.user.institutionName,
    token: (state) => state.user.token,
    connectedInstitution: (state) => state.connectedInstitution,
    adminInstitutionSirenValue: (state) => state.adminInstitutionSiren
  },

  actions: {
    async login(data: { login: string; password: string }): Promise<boolean> {
      this.user = await authService.login(data.login, data.password);
      this.connectedInstitution = await institutionService.getInstitution(
        this.user.siren,
        this.user.token
      );
      router.push({ name: RouteName.Home });
      return true;
    },

    logout() {
      this.user = new User();
      this.connectedInstitution = new Institution();
      router.push({ name: RouteName.Login });
      return true;
    },

    setAdminInstitutionSiren(value: string) {
      this.adminInstitutionSiren = value;
    }
  },

  persist: true
});
