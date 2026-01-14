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
                    <v-text-field variant="outlined" :label="$t('institution.split.sirenLabel')"
                      :placeholder="$t('institution.split.sirenLabel')" v-model="institutionSiren" :rules="sirenRules"
                      class="pt-6 w-100" required @keyup.enter="validateForm" maxLength="9" />
                    <h3>{{ $t("institution.split.count", { count: institutionCount }) }}</h3>
                  </v-col>

                  <v-card-actions>
                    <v-row class="pa-0 ga-4">
                      <v-btn variant="elevated" @click="increaseInstitutionCount">
                        {{ $t("institution.split.addInstitution") }}
                      </v-btn>
                      <v-btn variant="elevated" @click="decreaseInstitutionCount">
                        {{ $t("institution.split.removeInstitution") }}
                      </v-btn>
                    </v-row>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <InstitutionForm :action="Action.SCISSION" :trigger-scission="triggerSplit" @send="send"
                v-for="n in institutionCount" :key="n" />
              <v-card-actions class="v-card-actions">
                <v-row>
                  <v-spacer class="hidden-sm-and-down"></v-spacer>
                  <v-col cols="12" md="3" lg="3" xl="3" class="d-flex justify-space-around mr-16 flex-wrap">
                    <v-btn @click="triggerChildrenForm" :loading="buttonLoading" size="large" color="button"
                      variant="elevated">
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
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import { Action } from "@/entity/CommonDefinition";
import { RouteName } from "@/router";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionService = useInstitutionService();
const router = useRouter();
const { t } = useI18n();
const { sirenRules } = useValidationRules();

const institutionSiren = ref("");
const institutionCount = ref(2);
const institutionPayloads = ref<Array<any>>([]);
const buttonLoading = ref(false);
const triggerSplit = ref(false);
const formRef = ref();

function triggerChildrenForm(): void {
  triggerSplit.value = true;
}

async function send(payload: any): Promise<void> {
  buttonLoading.value = true;
  institutionPayloads.value.push(payload);

  if (institutionPayloads.value.length !== institutionCount.value) {
    return;
  }

  const validation = await formRef.value?.validate();
  const isValid = typeof validation === "boolean" ? validation : validation?.valid;

  if (isValid) {
    institutionService
      .splitInstitution(authStore.getToken, {
        sirenScinde: institutionSiren.value.trim(),
        nouveauxEtabs: institutionPayloads.value,
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
        triggerSplit.value = false;
        institutionPayloads.value = [];
      });
  } else {
    buttonLoading.value = false;
    triggerSplit.value = false;
    institutionPayloads.value = [];
  }
}

function validateForm() {
  formRef.value?.validate();
}

function increaseInstitutionCount() {
  institutionCount.value++;
}

function decreaseInstitutionCount() {
  if (institutionCount.value > 2) institutionCount.value--;
}

defineExpose({ formRef });
</script>




