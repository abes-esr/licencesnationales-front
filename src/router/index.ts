import { useAuthService } from "@/composables/service/useAuthService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useSnackbar } from "@/composables/useSnackbar";

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export enum RouteAction {
  CREATION = "CREATION",
  MODIFICATION = "MODIFICATION",
  VISUALISER = "VISUALISER",
  FUSION = "FUSION",
  SCISSION = "SCISSION"
}

export enum RouteName {
  Home = "Home",
  Login = "Login",
  Password = "Password",
  ForgotPassword = "ForgotPassword",
  PasswordReset = "PasswordReset",
  InstitutionCreate = "InstitutionCreate",
  Profile = "Profile",
  InstitutionView = "InstitutionView",
  InstitutionEdit = "InstitutionEdit",
  Institutions = "Institutions",
  InstitutionMerge = "InstitutionMerge",
  InstitutionSplit = "InstitutionSplit",
  IpList = "IpList",
  IpCreate = "IpCreate",
  Publishers = "Publishers",
  PublisherCreate = "PublisherCreate",
  PublisherEdit = "PublisherEdit",
  Search = "Search",
  History = "History",
  Statistics = "Statistics",
  Terms = "Terms",
  Privacy = "Privacy",
  Legal = "Legal",
  Accessibility = "Accessibility"
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: RouteName.Home,
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true }
  },

  // Authentication
  { path: "/login", name: RouteName.Login, component: () => import("../views/Login.vue") },
  {
    path: "/password",
    name: RouteName.Password,
    component: () => import("../views/Password.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/password/forgot",
    name: RouteName.ForgotPassword,
    component: () => import("../views/ForgotPassword.vue")
  },
  {
    path: "/password/reset",
    name: RouteName.PasswordReset,
    component: () => import("../views/PasswordReset.vue")
  },

  // Institution
  {
    path: "/institutions/create",
    name: RouteName.InstitutionCreate,
    component: () => import("../views/InstitutionCreate.vue")
  },
  {
    path: "/profile",
    name: RouteName.Profile,
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/institutions/view",
    name: RouteName.InstitutionView,
    component: () => import("../views/InstitutionView.vue")
  },
  {
    path: "/institutions/edit",
    name: RouteName.InstitutionEdit,
    component: () => import("../views/InstitutionEdit.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/institutions",
    name: RouteName.Institutions,
    component: () => import("../views/Institutions.vue")
  },

  {
    path: "/institutions/merge",
    name: RouteName.InstitutionMerge,
    component: () => import("../views/InstitutionMerge.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/institutions/split",
    name: RouteName.InstitutionSplit,
    component: () => import("../views/InstitutionSplit.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },

  {
    path: "/ip",
    name: RouteName.IpList,
    component: () => import("../views/IpList.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/ip/create",
    name: RouteName.IpCreate,
    component: () => import("../views/IpCreate.vue"),
    meta: { requiresAuth: true }
  },

  // Publishers
  {
    path: "/publishers",
    name: RouteName.Publishers,
    component: () => import("../views/Publishers.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/publishers/create",
    name: RouteName.PublisherCreate,
    component: () => import("../views/PublisherCreate.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/publishers/edit",
    name: RouteName.PublisherEdit,
    component: () => import("../views/PublisherEdit.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/search",
    name: RouteName.Search,
    component: () => import("../views/Search.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/history",
    name: RouteName.History,
    component: () => import("../views/History.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },
  {
    path: "/stats",
    name: RouteName.Statistics,
    component: () => import("../views/Statistics.vue"),
    meta: { requiresAuth: true, isAdmin: true }
  },

  // Static pages
  { path: "/terms", name: RouteName.Terms, component: () => import("../views/footer/Terms.vue") },
  {
    path: "/privacy",
    name: RouteName.Privacy,
    component: () => import("../views/footer/Privacy.vue")
  },
  {
    path: "/legal",
    name: RouteName.Legal,
    component: () => import("../views/footer/Legal.vue")
  },
  {
    path: "/accessibility",
    name: RouteName.Accessibility,
    component: () => import("../views/footer/Accessibility.vue")
  },

  // Fallback
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

const DEFAULT_TITLE = "Licences Nationales";
const authService = useAuthService();

// ---- After Navigation ----
router.afterEach((to) => {
  document.title = (to.meta.title as string) ?? DEFAULT_TITLE;
});

// ---- Guards ----
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const snackbar = useSnackbar();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  if (to.name === RouteName.Login && auth.isLoggedIn) {
    return next("/");
  }

  if (to.name === RouteName.PasswordReset && auth.isLoggedIn) {
    return next("/");
  }

  if (to.meta.requiresAuth) {
    try {
      const isValid = await authService.verifyToken(auth.token);

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
