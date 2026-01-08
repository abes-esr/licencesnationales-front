<template>
  <div>
    <MessageBox />
    <v-container variant="flat">
      <h1>Statistiques de l'application</h1>
      <v-alert
        v-if="message"
        type="error"
        density="compact"
        class="mt-4"
      >
        {{ message }}
      </v-alert>

      <h2 class="mt-6">
        Saisissez la période souhaitée pour les statistiques
      </h2>

      <v-form ref="formRef" class="mt-4">
        <v-row>
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-menu
              v-model="menuDateDebut"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  ref="dateDebutRef"
                  v-model="formattedDateDebut"
                  label="Date de début"
                  prepend-icon="mdi-calendar"
                  :rules="rulesFormConfig.dateRules"
                  disabled
                  variant="outlined"
                />
              </template>
              <v-date-picker
                v-model="dateDebut"
                :show-current="false"
                color="primary"
                @update:model-value="menuDateDebut = false"
              >
                <template #actions>
                  <v-btn variant="outlined" @click="menuDateDebut = false">
                    Annuler
                  </v-btn>
                </template>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="4" md="3" lg="2">
            <v-menu
              v-model="menuDateFin"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  ref="dateFinRef"
                  v-model="formattedDateFin"
                  label="Date de fin"
                  prepend-icon="mdi-calendar"
                  :rules="rulesFormConfig.dateRules"
                  disabled
                  variant="outlined"
                />
              </template>
              <v-date-picker
                v-model="dateFin"
                :show-current="false"
                color="primary"
                @update:model-value="menuDateFin = false"
              >
                <template #actions>
                  <v-btn variant="outlined" @click="menuDateFin = false">
                    Annuler
                  </v-btn>
                </template>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="4" md="2">
            <v-btn class="mt-2" @click="getStats">
              Valider
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-card v-if="etabStats.length > 0" class="mt-4 pa-4">
        <v-row>
          <h3>
            Statistiques entre le {{ formattedDateDebut }} et le
            {{ formattedDateFin }}
          </h3>
        </v-row>
        <v-row class="mt-2">
          <v-list subheader class="mr-4">
            <v-subheader>Etablissements</v-subheader>
            <v-list-item v-for="item in etabStats" :key="item.index">
              <div v-for="(value, name) in item" :key="name">
                {{ name }} : {{ value }}
              </div>
            </v-list-item>
            <v-divider />
          </v-list>
          <v-list subheader>
            <v-subheader>Adresses et plages IP</v-subheader>
            <v-list-item v-for="item in ipStats" :key="item.index">
              <div v-for="(value, name) in item" :key="name">
                {{ name }} : {{ value }}
              </div>
            </v-list-item>
          </v-list>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VDatePicker } from "vuetify/components";
import MessageBox from "@/components/common/MessageBox.vue";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { Message, MessageType } from "@/core/CommonDefinition";
import { rulesForms } from "@/core/RulesForm";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import moment from "moment";

const authStore = useAuthStore();
const messageStore = useMessageStore();

const rulesFormConfig = rulesForms;
const message = ref("");
const etabStats = ref<Array<any>>([]);
const ipStats = ref<Array<any>>([]);
const dateDebut = ref<string>("");
const dateFin = ref<string>("");
const menuDateDebut = ref(false);
const menuDateFin = ref(false);
const formRef = ref();
const dateDebutRef = ref();
const dateFinRef = ref();

const formattedDateDebut = computed({
  get: () =>
    dateDebut.value ? moment(dateDebut.value).format("DD-MM-YYYY") : "",
  set: value => {
    dateDebut.value = value ? moment(value, "DD-MM-YYYY").format("YYYY-MM-DD") : "";
  }
});

const formattedDateFin = computed({
  get: () =>
    dateFin.value ? moment(dateFin.value).format("DD-MM-YYYY") : "",
  set: value => {
    dateFin.value = value ? moment(value, "DD-MM-YYYY").format("YYYY-MM-DD") : "";
  }
});

async function getStats() {
  const validation = await formRef.value?.validate();
  const isValid = typeof validation === "boolean" ? validation : validation?.valid;

  if (!isValid) {
    return;
  }

  try {
    const etabsResponse = await etablissementService.getStats(
      formattedDateDebut.value,
      formattedDateFin.value,
      authStore.getToken
    );
    etabStats.value = etabsResponse.data.stats;

    const ipResponse = await iPService.getStats(
      formattedDateDebut.value,
      formattedDateFin.value,
      authStore.getToken
    );
    ipStats.value = ipResponse.data.stats;
  } catch (err: any) {
    const newMessage = new Message();
    newMessage.type = MessageType.ERREUR;
    newMessage.texte = err.message;
    newMessage.isSticky = true;
    messageStore.openDisplayedMessage(newMessage);
  }
}

</script>
