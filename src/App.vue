<template>
  <v-app>
    <v-theme-provider :theme="isDark ? 'dark' : 'light'" with-background>
    <Header />
    <v-layout class="flex-shrink-0">
      <side-menu :display-menu="isLoggedIn" :is-admin="isAdmin" />
      <v-main class="ma-0 pa-3" id="main">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-main>
    </v-layout>
    <Footer />
    </v-theme-provider>
  </v-app>
</template>


<script setup lang="ts">
import { computed, onMounted } from "vue";
import Header from "@/components/common/Header.vue";
import SideMenu from "@/components/common/SideMenu.vue";
import Footer from "@/components/common/Footer.vue";
import { useAuthStore } from "@/stores/authStore";   // Ton store Pinia
import { useUiStore } from "@/stores/uiStore"; // Exemple si tu as un themeStore

// Stores
const authStore = useAuthStore();
const uiStore = useUiStore();

// Computed
const isDark = computed(() => uiStore.isDark);
const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);

// Mounted
onMounted(() => {


  // Adapter les breakpoints (comme l'ancien code)
  const meta = document.querySelector("meta[name=viewport]");
  if (meta) {
    meta.setAttribute(
      "content",
      "shrink-to-fit=no, width=device-width, initial-scale=" +
        1 / window.devicePixelRatio
    );
  }
});
</script>

<style lang="scss">
@use "./theme/main.scss";
</style>