import { defineStore } from "pinia";
import User from "@/core/User";
import Etablissement from "@/core/Etablissement";
import router from "@/router";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";

interface AuthState {
  user: User;
  etablissementConnecte: Etablissement;
  sirenEtabSiAdmin: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: new User(),
    etablissementConnecte: new Etablissement(),
    sirenEtabSiAdmin: ""
  }),

  getters: {
    isLoggedIn: (state) => state.user.isLoggedIn,
    isAdmin: (state) => state.user.isAdmin,
    userSiren: (state) => state.user.siren,
    userEtab: (state) => state.user.nameEtab,
    getToken: (state) => state.user.token,

    getEtablissementConnecte: (state) => {
      const et = new Etablissement();
      Object.assign(et, state.etablissementConnecte);
      et.dateCreation = new Date(et.dateCreation);
      return et;
    },

    sirenEtabSiAdminValue: (state) => state.sirenEtabSiAdmin
  },

  actions: {
    async login(data: { login: string; password: string }): Promise<boolean> {
      try {
        const result = await authService.login(data.login, data.password);

        this.user = result;

        const etablissement = await etablissementService.getEtablissement(
          this.user.siren,
          this.user.token
        );

        this.etablissementConnecte = etablissement;

        router.push({ name: "Home" });

        return true;
      } catch (err) {
        throw err;
      }
    },

    logout() {
      this.user.token = "";
      this.user.siren = "";
      this.user.nameEtab = "";
      this.user.isLoggedIn = false;
      this.user.isAdmin = false;

      router.push({ name: "Login" });
    },

    setSirenEtabSiAdmin(value: string) {
      this.sirenEtabSiAdmin = value;
    }
  },

  persist: true
});
