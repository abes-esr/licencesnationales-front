<template>
  <v-app>
    <v-theme-provider :theme="isDark ? 'dark' : 'light'" with-background>
      <Header />
      <AppSnackbar />
      <v-layout class="flex-shrink-0">
        <SideMenu />
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
import AppSnackbar from "@/components/common/AppSnackbar.vue";
import Footer from "@/components/common/Footer.vue";
import Header from "@/components/common/Header.vue";
import SideMenu from "@/components/common/SideMenu.vue";
import { useUiStore } from "@/composables/store/useUiStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const uiStore = useUiStore();
const { isDark } = storeToRefs(uiStore);

onMounted(() => {
  const meta = document.querySelector("meta[name=viewport]");
  if (meta) {
    meta.setAttribute(
      "content",
      "shrink-to-fit=no, width=device-width, initial-scale=" +
      1 / window.devicePixelRatio
    )
  }
});

</script>

<style lang="scss">
@use "./theme/main.scss";
</style>
