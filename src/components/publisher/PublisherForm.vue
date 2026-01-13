<template>
  <v-container class="elevation-0">
    <v-form ref="formEditeurRef" validate-on="lazy" class="elevation-0" :disabled="isDisableForm">
      <h1 v-if="action === Action.CREATION">{{ $t("publisher.form.createTitle") }}</h1>
      <h1 v-else-if="action === Action.MODIFICATION">{{ $t("publisher.form.editTitle") }}</h1>
      <v-card class="elevation-0">
        <div class="mx-9">
          <v-row>
            <v-card-title>{{ $t("publisher.form.sectionTitle") }}</v-card-title>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <div class="mx-9">
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  variant="outlined"
                  :label="$t('publisher.form.nameLabel')"
                  :placeholder="$t('publisher.form.namePlaceholder')"
                  v-model="editeur.nom"
                  :rules="rulesForms.nom"
                  required
                  @keyup.enter="validate"
                />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  variant="outlined"
                  :label="$t('publisher.form.identifierLabel')"
                  :placeholder="$t('publisher.form.identifierPlaceholder')"
                  v-model="editeur.identifiantBis"
                />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  v-model="editeur.groupesEtabRelies"
                  :items="typesEtab"
                  :label="$t('publisher.form.relatedInstitutionsLabel')"
                  :placeholder="$t('publisher.form.relatedInstitutionsPlaceholder')"
                  persistent-placeholder
                  multiple
                  variant="outlined"
                >
                  <template #prepend-item>
                    <v-list-item @click="toggle">
                      <template #prepend>
                        <v-icon
                          :color="editeur.groupesEtabRelies.length > 0 ? 'indigo darken-4' : ''"
                        >
                          {{ iconEtab }}
                        </v-icon>
                      </template>
                      <v-list-item-title>{{ $t("publisher.form.selectAll") }}</v-list-item-title>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  variant="outlined"
                  :label="$t('publisher.form.addressLabel')"
                  :placeholder="$t('publisher.form.addressPlaceholder')"
                  v-model="editeur.adresse"
                  :rules="rulesForms.adresse"
                  required
                  @keyup.enter="validate"
                />
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
            <v-col cols="12" md="6" lg="4" xl="3" v-for="(contact, index) in editeur.contacts" :key="index">
              <PublisherContact
                :ref="el => contactRefs[index] = el"
                :contact="contact"
                @onChange="removeContact(contact)"
              />
            </v-col>
          </v-row>
        </div>
        <v-card variant="flat">
          <v-card-title>
            {{ $t("publisher.form.contactsCount", { count: editeur.contacts.length }) }}
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
          <v-btn size="large" @click="clear" variant="outlined" :disabled="isDisableForm">
            {{ $t("publisher.form.cancel") }}
          </v-btn>
          <v-btn
            color="button"
            :loading="buttonLoading"
            :disabled="isDisableForm"
            size="large"
            @click="validate"
            variant="elevated"
          >
            {{ $t("publisher.form.save") }}
            <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import PublisherContact from "@/components/publisher/PublisherContact.vue";
import { useEditeurService } from "@/composables/useEditeurService";
import { useEtablissementService } from "@/composables/useEtablissementService";
import { useSnackbar } from "@/composables/useSnackbar";
import { Action, ContactType } from "@/core/CommonDefinition";
import ContactEditeur from "@/core/ContactEditeur";
import Editeur from "@/core/Editeur";
import { rulesForms } from "@/core/RulesForm";
import { RouteName } from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { useEditeurStore } from "@/stores/editeurStore";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  action: Action;
}>();

const authStore = useAuthStore();
const snackbar = useSnackbar();
const editeurStore = useEditeurStore();
const router = useRouter();
const editeurService = useEditeurService();
const etablissementService = useEtablissementService();
const { t } = useI18n();

const editeur = ref<Editeur>(editeurStore.getCurrentEditeur);
const typesEtab = ref<Array<string>>([]);
const buttonLoading = ref(false);
const isDisableForm = ref(false);
const formEditeurRef = ref();
const contactRefs = ref<any[]>([]);

const iconEtab = computed(() => {
  if (tousTypesEtab.value) return "mdi-close-box";
  if (certainsTypesEtab.value) return "mdi-minus-box";
  return "mdi-checkbox-blank-outline";
});

const tousTypesEtab = computed(
  () => editeur.value.groupesEtabRelies.length === typesEtab.value.length
);
const certainsTypesEtab = computed(
  () => editeur.value.groupesEtabRelies.length > 0 && !tousTypesEtab.value
);

onMounted(() => {
  fetchListeType();
});

async function fetchListeType() {
  snackbar.hide();
  try {
    const result = await etablissementService.listeType();
    isDisableForm.value = false;
    typesEtab.value = result;
  } catch (err: any) {
    snackbar.error(err);
  }
}

function toggle(): void {
  requestAnimationFrame(() => {
    if (tousTypesEtab.value) {
      editeur.value.groupesEtabRelies = [];
    } else {
      editeur.value.groupesEtabRelies = typesEtab.value.slice();
    }
  });
}

async function validate(): Promise<void> {
  snackbar.hide();
  buttonLoading.value = true;
  let errorMessage = "";

  const validationResult = await formEditeurRef.value?.validate();
  let isValide =
    typeof validationResult === "boolean"
      ? validationResult
      : validationResult?.valid;

  let isSubFormValide = true;
  let countContactTechnique = 0;
  let countContactCommercial = 0;

  editeur.value.contacts.forEach((contact, index) => {
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
  const contact = new ContactEditeur();
  editeur.value.addContact(contact);
}

function removeContact(item: ContactEditeur): void {
  editeur.value.removeContact(item);
}

async function send(): Promise<void> {
  try {
    if (props.action === Action.CREATION) {
      await editeurService.createEditeur(editeur.value, authStore.getToken);
      snackbar.success(t("publisher.form.createSuccess"), {
        onHide: () => {
          router.push({ name: RouteName.Publishers });
        },
        timeout: 2000,
      });
    } else if (props.action === Action.MODIFICATION) {
      await editeurService.updateEditeur(editeur.value, authStore.getToken);
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
  snackbar.hide();
  contactRefs.value.forEach(refItem => refItem?.clear?.());
  formEditeurRef.value?.resetValidation?.();
  editeur.value = editeurStore.getCurrentEditeur;
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
