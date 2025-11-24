// import Vue from "vue";
// import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";
// import User from "@/core/User";
// import Editeur from "@/core/Editeur";
// import {
//   authService,
//   JsonLoginRequest
// } from "@/core/service/licencesnationales/AuthentificationService";
// import { editeurService } from "@/core/service/licencesnationales/EditeurService";
// import Etablissement from "@/core/Etablissement";
// import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
// import ContactEtablissement from "@/core/ContactEtablissement";
// import router from "@/router";
// import { Message } from "@/core/CommonDefinition";

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {
//     user: new User(),
//     etablissementConnecte: new Etablissement(),
//     darkTheme: false,
//     message: new Message(),
//     creationCompteEffectuee: false,
//     sirenEtabSiAdmin: "",
//     currentEditeur: new Editeur(),
//     currentEtablissement: new Etablissement()
//   },
//   mutations: {
//     SET_USER(state, user: User) {
//       state.user = user;
//     },
//     SET_ETABLISSEMENT_CONNECTE(state, item: Etablissement) {
//       state.etablissementConnecte = item;
//     },
//     SET_LOGOUT(state) {
//       state.user.token = "";
//       state.user.siren = "";
//       state.user.nameEtab = "";
//       state.user.isLoggedIn = false;
//       state.user.isAdmin = false;
//     },
//     SET_THEME(state) {
//       state.darkTheme = !state.darkTheme;
//     },
//     SET_CREATION_COMPTE_TRUE(state) {
//       state.creationCompteEffectuee = true;
//     },
//     SET_CREATION_COMPTE_FALSE(state) {
//       state.creationCompteEffectuee = false;
//     },
//     SET_SIRENETABSIADMIN(state, sirenEtabSiAdmin) {
//       state.sirenEtabSiAdmin = sirenEtabSiAdmin;
//     },
//     SET_CURRENT_EDITEUR(state, item: Editeur) {
//       state.currentEditeur = item;
//     },
//     SET_CURRENT_ETABLISSEMENT(state, item: Etablissement) {
//       state.currentEtablissement = item;
//     },
//     mutationSnackBarDisplay(state, value: boolean) {
//       state.message.isDisplayed = value;
//     }
//   },
//   actions: {
//     login(context, data: JsonLoginRequest): Promise<boolean> {
//       return new Promise((resolve, reject) => {
//         // On appel le serviceLn LicencesNationales
//         authService
//           .login(data.login, data.password)
//           .then(result => {
//             // On sauvegarde l'utilisateur
//             context.commit("SET_USER", result);
//             etablissementService
//               .getEtablissement(
//                 context.state.user.siren,
//                 context.state.user.token
//               )
//               .then(item => {
//                 context.commit("SET_ETABLISSEMENT_CONNECTE", item); // On sauvegarde dans le store
//                 router.push({ name: "Home" });
//                 resolve(true);
//               })
//               .catch(err => {
//                 //Si une erreur avec le ws est jetée, on lève un message d'erreur
//                 reject(err);
//               });
//           })
//           .catch(err => {
//             //Si une erreur avec le ws est jetée, on lève un message d'erreur
//             reject(err);
//           });
//       });
//     },
//     logout({ commit }) {
//       commit("SET_LOGOUT");
//       commit("mutationSnackBarDisplay", false);
//       router.push({ name: "Login" });
//     },
//     changeTheme({ commit }) {
//       commit("SET_THEME");
//     },
//     setCreationCompteEffectueeTrue({ commit }) {
//       commit("SET_CREATION_COMPTE_TRUE");
//     },
//     setCreationCompteEffectueeFalse({ commit }) {
//       commit("SET_CREATION_COMPTE_FALSE");
//     },
//     //*******************
//     //       Composants
//     //*******************
//     openDisplayedMessage(context, value: Message) {
//       context.state.message.isDisplayed = true;
//       context.state.message.isSticky = value.isSticky;
//       context.state.message.isMultiline = value.isMultiline;
//       context.state.message.type = value.type;
//       context.state.message.texte = value.texte;
//     },
//     closeDisplayedMessage(context) {
//       context.commit("mutationSnackBarDisplay", false);
//     },
//     setSirenEtabSiAdmin({ commit }, sirenEtabSiAdmin) {
//       commit("SET_SIRENETABSIADMIN", sirenEtabSiAdmin);
//     },
//     setCurrentEditeur(context, value: Editeur): Promise<boolean> {
//       return new Promise((resolve, reject) => {
//         if (value.id == -999) {
//           // Nouvel éditeur
//           context.commit("SET_CURRENT_EDITEUR", value); // On sauvegarde dans le store
//           resolve(true);
//         } else {
//           editeurService
//             .getEditeur(value.id, context.state.user.token)
//             .then(item => {
//               context.commit("SET_CURRENT_EDITEUR", item); // On sauvegarde dans le store
//               resolve(true);
//             })
//             .catch(err => {
//               //Si une erreur avec le ws est jetée, on lève un message d'erreur
//               reject(err);
//             });
//         }
//       });
//     },
//     setCurrentEtablissement(context, value: Etablissement): Promise<boolean> {
//       return new Promise((resolve, reject) => {
//         if (value.id == -999) {
//           // Nouvel etablissement
//           context.commit("SET_CURRENT_ETABLISSEMENT", value); // On sauvegarde dans le store
//           resolve(true);
//         } else {
//           etablissementService
//             .getEtablissement(value.siren, context.state.user.token)
//             .then(item => {
//               context.commit("SET_CURRENT_ETABLISSEMENT", item); // On sauvegarde dans le store
//               resolve(true);
//             })
//             .catch(err => {
//               //Si une erreur avec le ws est jetée, on lève un message d'erreur
//               reject(err);
//             });
//         }
//       });
//     },
//     updateCurrentEtablissement(context, value: Etablissement) {
//       context.commit("SET_CURRENT_ETABLISSEMENT", value);
//     },
//     setEtablissementConnecté(context, value: Etablissement): Promise<boolean> {
//       return new Promise((resolve, reject) => {
//         etablissementService
//           .getEtablissement(value.siren, context.state.user.token)
//           .then(item => {
//             context.commit("SET_ETABLISSEMENT_CONNECTE", item); // On sauvegarde dans le store
//             resolve(true);
//           })
//           .catch(err => {
//             //Si une erreur avec le ws est jetée, on lève un message d'erreur
//             reject(err);
//           });
//       });
//     }
//   },
//   getters: {
//     getEtablissementConnecte: state => (): Etablissement => {
//       const etablissement = new Etablissement();
//       Object.assign(etablissement, state.etablissementConnecte);
//       etablissement.dateCreation = new Date(etablissement.dateCreation);

//       const contact: ContactEtablissement = new ContactEtablissement();
//       Object.assign(contact, state.etablissementConnecte.contact);
//       etablissement.contact = contact;

//       return etablissement;
//     },
//     userSiren: state => (): string => {
//       return state.user.siren;
//     },
//     userEtab: state => (): string => {
//       return state.user.nameEtab;
//     },
//     getToken: state => (): string => {
//       return state.user.token;
//     },
//     isLoggedIn: state => (): boolean => {
//       return state.user.isLoggedIn;
//     },
//     isAdmin: state => (): boolean => {
//       return state.user.isAdmin;
//     },
//     isDark: state => (): boolean => {
//       return state.darkTheme;
//     },
//     getDisplayedMessage: state => (): Message => {
//       const message = new Message();
//       Object.assign(message, state.message);
//       return message;
//     },
//     creationCompteEffectuee: state => (): boolean => {
//       return state.creationCompteEffectuee;
//     },
//     sirenEtabSiAdmin: state => (): string => {
//       return state.sirenEtabSiAdmin;
//     },
//     getCurrentEditeur: state => (): Editeur => {
//       const editeur = new Editeur();
//       Object.assign(editeur, state.currentEditeur);
//       return editeur;
//     },
//     getCurrentEtablissement: state => (): Etablissement => {
//       const etablissement = new Etablissement();
//       Object.assign(etablissement, state.currentEtablissement);
//       etablissement.dateCreation = new Date(etablissement.dateCreation);

//       const contact: ContactEtablissement = new ContactEtablissement();
//       Object.assign(contact, state.currentEtablissement.contact);
//       etablissement.contact = contact;

//       return etablissement;
//     }
//   },
//   plugins: [createPersistedState()]
// });
