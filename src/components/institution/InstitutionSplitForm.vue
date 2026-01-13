<template>
  <div>
    <v-form ref="formRef">
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="2" xs="0" />
            <v-col cols="8" xs="12">
              <v-card-title>{{ $t("institution.split.title") }}</v-card-title>
              <v-card>
                <v-card-text>
                  <v-card-title>{{ $t("institution.split.sirenTitle") }}</v-card-title>
                  <v-col cols="12">
                    <v-text-field
                      variant="outlined"
                      :label="$t('institution.split.sirenLabel')"
                      :placeholder="$t('institution.split.sirenLabel')"
                      v-model="sirenEtab"
                      :rules="rulesForms.siren"
                      class="pt-6 w-100"
                      required
                      @keyup.enter="validateForm"
                      maxLength="9"
                    />
                    <h3>{{ $t("institution.split.count", { count: etablissementNumber }) }}</h3>
                  </v-col>

                  <v-card-actions>
                    <v-row class="pa-0 ga-4">
                      <v-btn variant="elevated" @click="increaseEtablissementNumber">
                        {{ $t("institution.split.addInstitution") }}
                      </v-btn>
                      <v-btn variant="elevated" @click="decreaseEtablissementNumber">
                        {{ $t("institution.split.removeInstitution") }}
                      </v-btn>
                    </v-row>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <InstitutionForm
                :action="Action.SCISSION"
                :trigger-scission="triggerScission"
                @send="send"
                v-for="n in etablissementNumber"
                :key="n"
              />
              <v-card-actions class="v-card-actions">
                <v-row>
                  <v-spacer class="hidden-sm-and-down"></v-spacer>
                  <v-col cols="12" md="3" lg="3" xl="3" class="d-flex justify-space-around mr-16 flex-wrap">
                    <v-btn @click="triggerChildrenForm" :loading="buttonLoading" size="large" color="button" variant="elevated">
                      {{ $t("institution.split.save") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <br />
  </div>
</template>
<style src="./style.css"></style>
<script setup lang="ts">
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { useEtablissementService } from "@/composables/useEtablissementService";
import { useSnackbar } from "@/composables/useSnackbar";
import { Action } from "@/core/CommonDefinition";
import { rulesForms } from "@/core/RulesForm";
import { RouteName } from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const etablissementService = useEtablissementService();
const router = useRouter();
const { t } = useI18n();

const sirenEtab = ref("");
const etablissementNumber = ref(2);
const etablissementDTOS = ref<Array<any>>([]);
const buttonLoading = ref(false);
const triggerScission = ref(false);
const formRef = ref();

function triggerChildrenForm(): void {
  triggerScission.value = true;
}

async function send(payload: any): Promise<void> {
  buttonLoading.value = true;
  etablissementDTOS.value.push(payload);

  if (etablissementDTOS.value.length !== etablissementNumber.value) {
    return;
  }

  const validation = await formRef.value?.validate();
  const isValid = typeof validation === "boolean" ? validation : validation?.valid;

  if (isValid) {
    etablissementService
      .scission(authStore.getToken, {
        sirenScinde: sirenEtab.value.trim(),
        nouveauxEtabs: etablissementDTOS.value,
      })
      .then(() => {
        snackbar.success(t("institution.split.success"));
        router.push({ name: RouteName.Institutions });
      })
      .catch((err: any) => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonLoading.value = false;
        triggerScission.value = false;
        etablissementDTOS.value = [];
      });
  } else {
    buttonLoading.value = false;
    triggerScission.value = false;
    etablissementDTOS.value = [];
  }
}

function validateForm() {
  formRef.value?.validate();
}

function increaseEtablissementNumber() {
  etablissementNumber.value++;
}

function decreaseEtablissementNumber() {
  if (etablissementNumber.value > 2) etablissementNumber.value--;
}

defineExpose({ formRef });
</script>
