import { useAuthStore } from "@/stores/authStore";
import { MessageType } from "@/core/CommonDefinition";
import { useSnackbar } from "@/composables/useSnackbar";
import { useAuthService } from "@/composables/useAuthService";

import Login from "../views/Login.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/TableauDeBord.vue"),
    meta: { requiresAuth: true }
  },

  // Authentication
  { path: "/login", name: "Login", component: () => import("../views/Login.vue") },
  {
    path: "/password",
    name: "Password",
    component: () => import("../views/Password.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/motdepasseoublie",
    name: "ForgotPassword",
    component: () => import("../views/ForgotPassword.vue")
  },
  {
    path: "/reinitialisationPass",
    name: "ReinitialisationPass",
    component: () =>
      import("../components/authentification/login/FormReinitialisationPass.vue")
  },

  // Etablissement
  {
    path: "/creationEtablissement",
    name: "CreationEtablissement",
    component: () =>
      import("../components/etablissement/FormEtablissement.vue"),
    props: { action: "CREATION" }
  },
  {
    path: "/profil",
    name: "Profil",
    component: () =>
      import("../components/etablissement/FormEtablissement.vue"),
    props: { action: "MODIFICATION" },
    meta: { requiresAuth: true }
  },
  {
    path: "/afficherEtablissement",
    name: "AfficherEtablissement",
    component: () =>
      import("../components/etablissement/CardEtablissement.vue")
  },
  {
    path: "/modifierEtablissement",
    name: "ModifierEtablissement",
    component: () =>
      import("../components/etablissement/FormEtablissement.vue"),
    props: { action: "MODIFICATION" },
    meta: { requiresAuth: true }
  },
  {
    path: "/listeEtab",
    name: "ListeEtab",
    component: () => import("../components/etablissement/ListeEtab.vue")
  },

  {
    path: "/fusionEtablissement",
    name: "FusionEtablissement",
    component: () =>
      import("../components/etablissement/FormFusionEtablissement.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/scissionEtablissement",
    name: "ScissionEtablissement",
    component: () =>
      import("../components/etablissement/FormScissionEtablissement.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },

  {
    path: "/listeAcces",
    name: "ListeIP",
    component: () => import("../components/ip/ListeAcces.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/ajouterAcces",
    name: "ajouterAcces",
    component: () => import("../components/ip/AjouterAcces.vue"),
    meta: { requiresAuth: true }
  },

  // Editeurs
  {
    path: "/listeEditeurs",
    name: "ListeEditeurs",
    component: () => import("../components/editeur/ListeEditeurs.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/nouvelEditeur",
    name: "NouvelEditeur",
    component: () => import("../components/editeur/FormEditeur.vue"),
    props: { action: "CREATION" },
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/modifierEditeur",
    name: "ModifierEditeur",
    component: () => import("../components/editeur/FormEditeur.vue"),
    props: { action: "MODIFICATION" },
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/recherche",
    name: "Recherche",
    component: () => import("../components/common/Recherche.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/historique",
    name: "Historique",
    component: () => import("../components/etablissement/Historique.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/stats",
    name: "Statistiques",
    component: () => import("../components/etablissement/Statistiques.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },

  // Static pages
  { path: "/cgu", name: "CGU", component: () => import("../views/footer-static/CGU.vue") },
  {
    path: "/donneespersonnelles",
    name: "DonneesPersonnelles",
    component: () => import("../views/footer-static/DonneesPersonnelles.vue")
  },
  {
    path: "/mentions",
    name: "MentionsLegales",
    component: () => import("../views/footer-static/MentionsLegales.vue")
  },
  {
    path: "/accessibilite",
    name: "Accessibilite",
    component: () => import("../views/footer-static/Accessibilite.vue")
  },

  // Fallback
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  }
});

const DEFAULT_TITLE = "Licences Nationales";
const authService = useAuthService();

// ---- After Navigation ----
router.afterEach((to) => {
  document.title = (to.meta.title as string) || DEFAULT_TITLE;
});

// ---- Guards ----
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const snackbar = useSnackbar();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  if (to.name === "Login" && auth.isLoggedIn) {
    return next("/");
  }

  if (to.name === "ReinitialisationPass" && auth.isLoggedIn) {
    return next("/");
  }

  if (to.meta.requiresAuth) {
    try {
      const isValid = await authService.verifierValiditeToken(auth.getToken);

      if (!isValid) {
        snackbar.error("Votre session a expiré", { sticky: true });
        auth.logout();

        return;
      }

      return next();

    } catch (err: any) {
      snackbar.error(err);
      auth.logout();

      return;
    }
  }

  return next();
});

export default router;
