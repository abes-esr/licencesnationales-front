import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/acces",
    name: "acces",
    component: () => import("../components/ListeAcces.vue")
  },
  {
    path: "/acces/:id",
    name: "acces-details",
    component: () => import("../components/Acces.vue")
  },
  {
    path: "/acces/:id",
    name: "acces-analyse",
    component: () => import("../components/Acces.vue")
  },
  {
    path: "/ajoutAcces",
    name: "ajoutAcces",
    component: () => import("../components/AjoutAcces.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
