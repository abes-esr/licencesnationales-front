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
    getToken: (state) => state.user.token,

    getConnectedInstitution: (state) => {
      const et = new Institution();
      Object.assign(et, state.connectedInstitution);
      et.createdAt = new Date(et.createdAt);
      return et;
    },

    adminInstitutionSirenValue: (state) => state.adminInstitutionSiren
  },

  actions: {
    async login(data: { login: string; password: string }): Promise<boolean> {
      try {
        const result = await authService.login(data.login, data.password);

        this.user = result;

        const institution = await institutionService.getInstitution(
          this.user.siren,
          this.user.token
        );

        this.connectedInstitution = institution;

        router.push({ name: RouteName.Home });

        return true;
      } catch (err) {
        throw err;
      }
    },

    logout() {
      this.user.token = "";
      this.user.siren = "";
      this.user.institutionName = "";
      this.user.isLoggedIn = false;
      this.user.isAdmin = false;

      router.push({ name: RouteName.Login });
    },

    setAdminInstitutionSiren(value: string) {
      this.adminInstitutionSiren = value;
    }
  },

  persist: true
});


