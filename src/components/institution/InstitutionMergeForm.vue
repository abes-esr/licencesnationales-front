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
                    <v-col cols="4" xs="12" v-for="n in sirenNumber" :key="n">
                      <v-text-field
                        variant="outlined"
                        :label="$t('institution.merge.sirenLabel')"
                        :placeholder="$t('institution.merge.sirenLabel')"
                        v-model="sirenEtab[n - 1]"
                        :rules="rulesForms.siren"
                        maxlength="9"
                        required
                      />
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
              <InstitutionForm :listeSirenFusion="sirenEtab" :action="Action.FUSION" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";

const sirenEtab = ref<Array<string>>(["", ""]);
const sirenNumber = ref(2);
const formRef = ref();

function increaseSirenNumber() {
  sirenNumber.value++;
}

function decreaseSirenNumber() {
  if (sirenNumber.value > 2) {
    sirenNumber.value--;
    sirenEtab.value.pop();
  }
}

defineExpose({ formRef, sirenEtab });
</script>
