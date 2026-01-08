<template>
  <div>
    <v-form ref="formRef">
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="2" />
            <v-col cols="8" class="pa-0">
              <v-card-title>Fusion d'établissements</v-card-title>
              <v-card>
                <v-card-text>
                  <v-card-title>
                    Siren des établissements à fusionner
                  </v-card-title>
                  <v-row>
                    <v-col cols="4" xs="12" v-for="n in sirenNumber" :key="n">
                      <v-text-field
                        variant="outlined"
                        label="SIREN"
                        placeholder="SIREN"
                        v-model="sirenEtab[n - 1]"
                        :rules="rulesForms.siren"
                        maxlength="9"
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-btn variant="elevated" @click="increaseSirenNumber">
                      Ajouter un siren
                    </v-btn>
                    <v-btn variant="elevated" @click="decreaseSirenNumber">
                      Supprimer un siren
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <form-etablissement
                :listeSirenFusion="sirenEtab"
                :action="Action.FUSION"
              ></form-etablissement>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormEtablissement from "@/components/etablissement/FormEtablissement.vue";
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
