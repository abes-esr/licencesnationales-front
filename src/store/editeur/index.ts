import { Module } from "vuex";
import { RootState } from "@/store/types";
import { EditeurState } from "@/store/editeur/types";
import { getters} from "@/store/editeur/getters";
import { mutations} from "@/store/editeur/mutations";
import { actions } from "@/store/editeur/actions";

const namespaced = true;

const state: EditeurState = {
    editeur: undefined,
    error: false,
    errorMessage: "",
    isLogged: false,

}

export const editeur: Module<EditeurState, RootState> = {
    namespaced,
    state,
    getters,
    mutations,
    actions
}