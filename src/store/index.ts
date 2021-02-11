import Vue from "vue";
import Vuex, {StoreOptions} from "vuex";
import {editeur} from "@/store/editeur";
import {etablissement} from "@/store/etablissement";
import {ip} from "@/store/ip";
import {RootState} from "@/store/types";
import {user} from "@/store/user";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    lnMessage: "Licences Nationales"
  },
  modules: {
    editeur,
    etablissement,
    ip, 
    user
  }
};

export default new Vuex.Store<RootState>(store);