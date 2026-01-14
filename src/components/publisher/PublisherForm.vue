<template>
  <v-container class="elevation-0">
    <v-form ref="publisherFormRef" validate-on="lazy" class="elevation-0" :disabled="isFormDisabled">
      <h1 v-if="action === RouteAction.CREATION">{{ $t("publisher.form.createTitle") }}</h1>
      <h1 v-else-if="action === RouteAction.MODIFICATION">{{ $t("publisher.form.editTitle") }}</h1>
      <v-card class="elevation-0">
        <div class="mx-9">
          <v-row>
            <v-card-title>{{ $t("publisher.form.sectionTitle") }}</v-card-title>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <div class="mx-9">
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field variant="outlined" :label="$t('publisher.form.nameLabel')"
                  :placeholder="$t('publisher.form.namePlaceholder')" v-model="publisher.name" :rules="lastNameRules"
                  required @keyup.enter="validate" />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field variant="outlined" :label="$t('publisher.form.identifierLabel')"
                  :placeholder="$t('publisher.form.identifierPlaceholder')" v-model="publisher.secondaryId" />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select v-model="publisher.relatedInstitutionTypes" :items="institutionTypes"
                  :label="$t('publisher.form.relatedInstitutionsLabel')"
                  :placeholder="$t('publisher.form.relatedInstitutionsPlaceholder')" persistent-placeholder multiple
                  variant="outlined">
                  <template #prepend-item>
                    <v-list-item @click="toggleAllInstitutionTypes">
                      <template #prepend>
                        <v-icon :color="publisher.relatedInstitutionTypes.length > 0 ? 'indigo darken-4' : ''">
                          {{ institutionTypeIcon }}
                        </v-icon>
                      </template>
                      <v-list-item-title>{{ $t("publisher.form.selectAll") }}</v-list-item-title>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field variant="outlined" :label="$t('publisher.form.addressLabel')"
                  :placeholder="$t('publisher.form.addressPlaceholder')" v-model="publisher.address"
                  :rules="addressRules" required @keyup.enter="validate" />
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card>
      <v-card class="mt-6 mb-6 elevation-0">
        <div class="mx-9">
          <v-card-title>{{ $t("publisher.form.contactSectionTitle") }}</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-row>
            <v-col cols="12" md="6" lg="4" xl="3" v-for="(contact, index) in publisher.contacts" :key="index">
              <PublisherContactForm :ref="el => contactRefs[index] = el" :contact="contact"
                @onChange="removeContact(contact)" />
            </v-col>
          </v-row>
        </div>
        <v-card variant="flat">
          <v-card-title>
            {{ $t("publisher.form.contactsCount", { count: publisher.contacts.length }) }}
          </v-card-title>
          <v-card-text> </v-card-text>

          <v-card-actions class="v-card-actions">
            <v-btn class="ma-2" variant="tonal" @click="addContact">
              <FontAwesomeIcon :icon="faPlus" class="mx-2" />
              {{ $t("publisher.form.addContact") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
      <v-card-actions>
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-col cols="12" md="3" lg="3" xl="3" class="d-flex justify-space-around mr-16 flex-wrap">
          <v-btn size="large" @click="clear" variant="outlined" :disabled="isFormDisabled">
            {{ $t("publisher.form.cancel") }}
          </v-btn>
          <v-btn color="button" :loading="buttonLoading" :disabled="isFormDisabled" size="large" @click="validate"
            variant="elevated">
            {{ $t("publisher.form.save") }}
            <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import PublisherContactForm from "@/components/publisher/PublisherContact.vue";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { usePublisherStore } from "@/composables/store/usePublisherStore";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import Publisher from "@/entity/Publisher";
import PublisherContact, { ContactType } from "@/entity/PublisherContact";
import { RouteAction, RouteName } from "@/router";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  action: RouteAction;
}>();

const authStore = useAuthStore();
const snackbar = useSnackbar();
const publisherStore = usePublisherStore();
const router = useRouter();
const publisherService = usePublisherService();
const institutionService = useInstitutionService();
const { t } = useI18n();
const { addressRules, lastNameRules } = useValidationRules();

const publisher = ref<Publisher>(publisherStore.getCurrentPublisher);
const institutionTypes = ref<Array<string>>([]);
const buttonLoading = ref(false);
const isFormDisabled = ref(false);
const publisherFormRef = ref();
const contactRefs = ref<any[]>([]);

const institutionTypeIcon = computed(() => {
  if (allInstitutionTypesSelected.value) return "mdi-close-box";
  if (someInstitutionTypesSelected.value) return "mdi-minus-box";
  return "mdi-checkbox-blank-outline";
});

const allInstitutionTypesSelected = computed(
  () => publisher.value.relatedInstitutionTypes.length === institutionTypes.value.length
);
const someInstitutionTypesSelected = computed(
  () => publisher.value.relatedInstitutionTypes.length > 0 && !allInstitutionTypesSelected.value
);

onMounted(() => {
  fetchInstitutionTypes();
});

async function fetchInstitutionTypes() {
  try {
    const result = await institutionService.listInstitutionTypes();
    isFormDisabled.value = false;
    institutionTypes.value = result;
  } catch (err: any) {
    snackbar.error(err);
  }
}

function toggleAllInstitutionTypes(): void {
  requestAnimationFrame(() => {
    if (allInstitutionTypesSelected.value) {
      publisher.value.relatedInstitutionTypes = [];
    } else {
      publisher.value.relatedInstitutionTypes = institutionTypes.value.slice();
    }
  });
}

async function validate(): Promise<void> {
  buttonLoading.value = true;
  let errorMessage = "";

  const validationResult = await publisherFormRef.value?.validate();
  let isValide =
    typeof validationResult === "boolean"
      ? validationResult
      : validationResult?.valid;

  let isSubFormValide = true;
  let countContactTechnique = 0;
  let countContactCommercial = 0;

  publisher.value.contacts.forEach((contact, index) => {
    if (contact.type == ContactType.TECHNIQUE) {
      countContactTechnique++;
    } else if (contact.type == ContactType.COMMERCIAL) {
      countContactCommercial++;
    }
    const isContactValid = contactRefs.value[index]?.validate?.() ?? false;

    if (!isValide || !isContactValid) {
      isValide = false;
      isSubFormValide = false;
    }
  });

  if (countContactCommercial === 0 || countContactTechnique === 0) {
    isValide = false;
    errorMessage = t("publisher.form.contactTypeError");
  }

  if (isValide && isSubFormValide) {
    send();
  } else {
    buttonLoading.value = false;
    const message = errorMessage
      ? t("publisher.form.invalidFieldsWithReason", { reason: errorMessage })
      : t("publisher.form.invalidFields");
    snackbar.error(message);
  }
}

function addContact(): void {
  const contact = new PublisherContact();
  publisher.value.addContact(contact);
}

function removeContact(item: PublisherContact): void {
  publisher.value.removeContact(item);
}

async function send(): Promise<void> {
  try {
    if (props.action === RouteAction.CREATION) {
      await publisherService.createPublisher(publisher.value, authStore.getToken);
      snackbar.success(t("publisher.form.createSuccess"), {
        onHide: () => {
          router.push({ name: RouteName.Publishers });
        },
        timeout: 2000,
      });
    } else if (props.action === RouteAction.MODIFICATION) {
      await publisherService.updatePublisher(publisher.value, authStore.getToken);
      snackbar.success(t("publisher.form.updateSuccess"), {
        onHide: () => {
          router.push({ name: RouteName.Publishers });
        },
        timeout: 2000,
      });
    }
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    buttonLoading.value = false;
  }
}

function clear() {
  buttonLoading.value = false;
  contactRefs.value.forEach(refItem => refItem?.clear?.());
  publisherFormRef.value?.resetValidation?.();
  publisher.value = publisherStore.getCurrentPublisher;
  window.scrollTo(0, 0);
}
</script>

<style scoped lang="scss">
.v-card-text {
  border: 0;
}

.v-card-title {
  width: 100%;
}
</style>
