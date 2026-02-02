<template>
  <div>
    <v-form ref="formRef">
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="2" />
            <v-col cols="8" class="pa-0">
              <v-card-title>{{ $t("institution.merge.title") }}</v-card-title>
              <v-card>
                <v-card-text>
                  <v-card-title>{{ $t("institution.merge.sirenTitle") }}</v-card-title>
                  <v-row>
                    <v-col cols="4" xs="12" v-for="n in sirenCount" :key="n">
                      <v-text-field variant="outlined" :label="$t('institution.merge.sirenLabel')"
                        :placeholder="$t('institution.merge.sirenLabel')" v-model="institutionSirens[n - 1]"
                        :rules="sirenRules" maxlength="9" required />
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-btn variant="elevated" @click="increaseSirenNumber">
                      {{ $t("institution.merge.addSiren") }}
                    </v-btn>
                    <v-btn variant="elevated" @click="decreaseSirenNumber">
                      {{ $t("institution.merge.removeSiren") }}
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <InstitutionForm :listeSirenFusion="institutionSirens" :action="RouteAction.FUSION" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";
import { useValidationRules } from "@/composables/useValidationRules";
import { RouteAction } from "@/router";
import { ref } from "vue";

const institutionSirens = ref<Array<string>>(["", ""]);
const sirenCount = ref(2);
const formRef = ref();
const { sirenRules } = useValidationRules();

usePageMeta({
  titleKey: "institution.merge.meta.title",
  descriptionKey: "institution.merge.meta.description"
});

function increaseSirenNumber() {
  sirenCount.value++;
}

function decreaseSirenNumber() {
  if (sirenCount.value > 2) {
    sirenCount.value--;
    institutionSirens.value.pop();
  }
}

defineExpose({ formRef, institutionSirens });
</script>
