<template>
  <div>
    <v-card elevation="0">
      <v-form ref="formModuleSegmentsIpPlage">
        <v-app-bar elevation="0" density="compact" class="barIp">
          <span v-if="typeAcces === 'ip'">Adresse IP</span>
          <span v-else>Plage d'adresses IP</span>
          <span v-if="typeIp === 'IPV4'">v4</span>
          <span v-else>v6</span>
        </v-app-bar>
        <v-card-text class="overflow-auto fondGrisFonce">
          <v-row class="ma-0">
            <v-col class="py-0">
              <p class="caption mb-0">
                Possibilité de copier/coller directement les IP dans les champs
                de saisie
              </p>
              <v-row v-if="typeAcces === 'ip'">
                <v-col class="pb-0">
                  <!-- IP v4 -->
                  <v-row v-if="typeIp === 'IPV4'">
                    <v-col
                      v-for="(value, index) in ipv4Segments"
                      :key="index"
                    >
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv4SegmentsRules"
                        ref="ipv4SegmentsRefs"
                        v-model="ipv4Segments[index].value"
                        :suffix="getSuffix(index)"
                        @input="nextSegment(index, ipv4Segments, 'ipv4SegmentsRefs')"
                        @paste="onPasteIp"
                        @paste.prevent
                        @focus="$emit('focus')"
                        maxlength="3"
                        variant="outlined"
                        density="compact"
                        required
                      />
                    </v-col>
                  </v-row>
                  <!-- IP v6 -->
                  <v-row v-else>
                    <v-col
                      v-for="(value, index) in ipv6Segments"
                      :key="index"
                    >
                      <v-text-field
                        :data-length="value.length"
                        :data-index="index"
                        :rules="rulesForm.ipv6SegmentsRules"
                        ref="ipv6SegmentsRefs"
                        v-model="value.value"
                        :suffix="getSuffix(index)"
                        @input="nextSegment(index, ipv6Segments, 'ipv6SegmentsRefs')"
                        @paste="onPasteIp"
                        @paste.prevent
                        @focus="$emit('focus')"
                        variant="outlined"
                        density="compact"
                        required
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <!-- PLAGE IP v4 -->
                  <div v-if="typeIp === 'IPV4'">
                    <label>IP de début</label>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv4SegmentsPlageDebut"
                        :key="index"
                        class="pb-0"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv4SegmentsRules"
                          ref="ipv4SegmentsPlageDebutRefs"
                          v-model="value.value"
                          :suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv4SegmentsPlageDebut,
                              'ipv4SegmentsPlageDebutRefs'
                            )
                          "
                          @paste="onPastePlageDebut"
                          @paste.prevent
                          @focus="$emit('focus')"
                          maxlength="3"
                          variant="outlined"
                          density="compact"
                          required
                        />
                      </v-col>
                    </v-row>
                    <label>IP de fin</label>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv4SegmentsPlageFin"
                        :key="index"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv4SegmentsRules"
                          ref="ipv4SegmentsPlageFinRefs"
                          v-model="value.value"
                          :suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv4SegmentsPlageFin,
                              'ipv4SegmentsPlageFinRefs'
                            )
                          "
                          @paste="onPastePlageFin"
                          @paste.prevent
                          @focus="$emit('focus')"
                          :disabled="index <= 1"
                          maxlength="3"
                          variant="outlined"
                          density="compact"
                          required
                        />
                      </v-col>
                    </v-row>
                  </div>

                  <!-- PLAGE IP v6 -->
                  <div v-else>
                    <label>IP de début</label>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv6SegmentsPlageDebut"
                        :key="index"
                        class="pb-0"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv6SegmentsRules"
                          ref="ipv6SegmentsPlageDebutRefs"
                          v-model="value.value"
                          :suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv6SegmentsPlageDebut,
                              'ipv6SegmentsPlageDebutRefs'
                            )
                          "
                          @paste="onPastePlageDebut"
                          @paste.prevent
                          @focus="$emit('focus')"
                          variant="outlined"
                          density="compact"
                          required
                        />
                      </v-col>
                    </v-row>
                    <label>IP de fin</label>
                    <v-row>
                      <v-col
                        v-for="(value, index) in ipv6SegmentsPlageFin"
                        :key="index"
                      >
                        <v-text-field
                          :data-length="value.length"
                          :data-index="index"
                          :rules="rulesForm.ipv6SegmentsRules"
                          ref="ipv6SegmentsPlageFinRefs"
                          v-model="value.value"
                          :suffix="getSuffix(index)"
                          @input="
                            nextSegment(
                              index,
                              ipv6SegmentsPlageFin,
                              'ipv6SegmentsPlageFinRefs'
                            )
                          "
                          @paste="onPastePlageFin"
                          @paste.prevent
                          @focus="$emit('focus')"
                          variant="outlined"
                          density="compact"
                          required
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2">
              <v-row id="fillHeight"> </v-row>
              <v-row>
                <a @click="clear(false)"
                  >Vider les champs
                  <FontAwesomeIcon :icon="faBackspace"
                /></a>
              </v-row>
            </v-col>
          </v-row>

          <!-- COMMENTAIRES -->
          <v-row class="mx-0 mt-0">
            <v-col cols="10" lg="10" md="8" sm="8">
              <v-textarea
                counter="255"
                variant="outlined"
                auto-grow
                rows="2"
                label="Commentaires"
                hint="Apporter ici toute précision sur l'attribution de cette IP, surtout si elle n'appartient pas au réseau Renater."
                :rules="rulesForm.commentaires"
                v-model="commentaires"
                @focus="$emit('focus')"
                clearable
                persistent-hint
              />
            </v-col>
            <v-col cols="2">
              <v-row id="btnToBtm"></v-row>
              <v-row>
                <v-card-actions>
                  <v-btn
                    @click="ajouterIp"
                    :loading="buttonLoading"
                    id="btnSave"
                    size="large"
                    color="button"
                  >
                    <span id="btnText">Enregistrer </span>
                    <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { rulesForms } from "@/core/RulesForm";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { Logger } from "@/utils/Logger";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import type { VForm, VTextField } from "vuetify/components";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";

interface SegmentPlage {
  length: number;
  value: string;
}

interface Props {
  typeIp?: string;
  typeAcces?: string;
}

const props = withDefaults(defineProps<Props>(), {
  typeIp: "IPV4",
  typeAcces: "ip"
});

const emit = defineEmits<{
  (
    e: "FormModuleSegmentsIpPlageEvent",
    payload: { id: string; typeIp: string; ip: string; commentaires: string }
  ): void;
  (e: "alertSuccess", message: string): void;
  (e: "alertError", message: string): void;
  (e: "focus"): void;
}>();

const rulesForm = rulesForms;
const authStore = useAuthStore();
const messageStore = useMessageStore();
const etablissementStore = useEtablissementStore();

const formModuleSegmentsIpPlage = ref<VForm | null>(null);
const ipv4SegmentsRefs = ref<InstanceType<typeof VTextField>[]>([]);
const ipv6SegmentsRefs = ref<InstanceType<typeof VTextField>[]>([]);
const ipv4SegmentsPlageDebutRefs = ref<InstanceType<typeof VTextField>[]>([]);
const ipv4SegmentsPlageFinRefs = ref<InstanceType<typeof VTextField>[]>([]);
const ipv6SegmentsPlageDebutRefs = ref<InstanceType<typeof VTextField>[]>([]);
const ipv6SegmentsPlageFinRefs = ref<InstanceType<typeof VTextField>[]>([]);

const ipv4Segments = ref<SegmentPlage[]>([]);
const ipv6Segments = ref<SegmentPlage[]>([]);
const ipv4SegmentsPlageDebut = ref<SegmentPlage[]>([]);
const ipv4SegmentsPlageFin = ref<SegmentPlage[]>([]);
const ipv6SegmentsPlageDebut = ref<SegmentPlage[]>([]);
const ipv6SegmentsPlageFin = ref<SegmentPlage[]>([]);

const ip = ref("");
const commentaires = ref("");
const buttonLoading = ref(false);

const typeIp = computed(() => props.typeIp);
const typeAcces = computed(() => props.typeAcces);
const isAdmin = computed(() => authStore.isAdmin);

const resetSegments = () => {
  ipv4Segments.value = [
    { length: 3, value: "" },
    { length: 3, value: "" },
    { length: 3, value: "" },
    { length: 3, value: "" }
  ];
  ipv6Segments.value = Array.from({ length: 8 }).map(() => ({
    length: 5,
    value: ""
  }));
  ipv4SegmentsPlageDebut.value = [
    { length: 3, value: "" },
    { length: 3, value: "" },
    { length: 3, value: "" },
    { length: 3, value: "" }
  ];
  ipv4SegmentsPlageFin.value = [
    { length: 3, value: "" },
    { length: 3, value: "" },
    { length: 3, value: "" },
    { length: 3, value: "" }
  ];
  ipv6SegmentsPlageDebut.value = Array.from({ length: 8 }).map(() => ({
    length: 5,
    value: ""
  }));
  ipv6SegmentsPlageFin.value = Array.from({ length: 8 }).map(() => ({
    length: 5,
    value: ""
  }));
};

const refMap: Record<string, { value: Array<InstanceType<typeof VTextField>> }> =
  {
    ipv4SegmentsRefs,
    ipv6SegmentsRefs,
    ipv4SegmentsPlageDebutRefs,
    ipv4SegmentsPlageFinRefs,
    ipv6SegmentsPlageDebutRefs,
    ipv6SegmentsPlageFinRefs
  };

const getSuffix = (index: number) => {
  if (typeIp.value === "IPV4") {
    return index === 3 ? "" : ".";
  }
  return index === 7 ? "" : ":";
};

const nextSegment = (
  index: number,
  array: SegmentPlage[],
  refArray: keyof typeof refMap
) => {
  const indexMax = array.length - 1;

  if (typeIp.value === "IPV4") {
    if (array[index].value.length >= 3 && index < indexMax) {
      refMap[refArray]?.value?.[index + 1]?.focus?.();
    }
  } else {
    if (array[index].value.length >= 4 && index < indexMax) {
      refMap[refArray]?.value?.[index + 1]?.focus?.();
    }
  }
};

const setIp = () => {
  let value = "";
  if (typeAcces.value === "ip") {
    if (typeIp.value === "IPV4") {
      for (const field of ipv4Segments.value) {
        value += field.value + ".";
      }
      value = value.substring(0, value.lastIndexOf("."));
    } else {
      for (const field of ipv6Segments.value) {
        value += field.value + ":";
      }
      value = value.substring(0, value.lastIndexOf(":"));
    }
  } else {
    if (typeIp.value === "IPV4") {
      ipv4SegmentsPlageDebut.value.forEach((content, index) => {
        if (index === 2 || index === 3) {
          value +=
            content.value + "-" + ipv4SegmentsPlageFin.value[index].value + ".";
        } else {
          value += content.value + ".";
        }
      });
      value = value.substring(0, value.lastIndexOf("."));
    } else {
      ipv6SegmentsPlageDebut.value.forEach((content, index) => {
        if (content.value === ipv6SegmentsPlageFin.value[index].value) {
          value += content.value + ":";
        } else {
          value += content.value + "-" + ipv6SegmentsPlageFin.value[index].value + ":";
        }
      });
      value = value.substring(0, value.lastIndexOf(":"));
    }
  }
  ip.value = value;
};

const ajouterIp = async () => {
  buttonLoading.value = true;
  const validation = await formModuleSegmentsIpPlage.value?.validate();
  if (validation?.valid) {
    setIp();

    let siren = "";
    if (isAdmin.value) {
      siren = etablissementStore.getCurrentEtablissement.siren;
    } else {
      siren = authStore.userSiren;
    }

    iPService
      .addIP(authStore.getToken, siren, {
        typeIp: typeIp.value,
        ip: ip.value,
        commentaires: commentaires.value
      })
      .then(response => {
        emit("FormModuleSegmentsIpPlageEvent", {
          id: response.data.id,
          typeIp: typeIp.value,
          ip: ip.value,
          commentaires: commentaires.value
        });
        formModuleSegmentsIpPlage.value?.resetValidation();
        clear(false);
        emit("alertSuccess", response.data.message);
      })
      .catch(err => {
        Logger.error(err?.toString?.() ?? err);
        emit("alertError", err?.response?.data?.message ?? "Erreur lors de l'enregistrement");
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else {
    buttonLoading.value = false;
  }
};

const clear = (dontClearComments: boolean) => {
  ip.value = "";
  if (!dontClearComments) commentaires.value = "";
  resetSegments();
  formModuleSegmentsIpPlage.value?.resetValidation();
  messageStore.closeDisplayedMessage();
};

const onPasteIp = (evt: ClipboardEvent) => {
  const pasted = evt.clipboardData?.getData("text") ?? "";
  if (typeIp.value === "IPV4") {
    pasted
      .trim()
      .split(".")
      .forEach((content, index) => {
        if (ipv4Segments.value[index]) {
          ipv4Segments.value[index].value = content.slice(0, 3);
        }
      });
  } else {
    pasted
      .trim()
      .split(":")
      .forEach((content, index) => {
        if (ipv6Segments.value[index]) {
          ipv6Segments.value[index].value = content.slice(0, 4);
        }
      });
  }
};

const onPastePlageDebut = (evt: ClipboardEvent) => {
  const pasted = evt.clipboardData?.getData("text") ?? "";
  if (typeIp.value === "IPV4") {
    pasted
      .trim()
      .split(".")
      .forEach((content, index) => {
        if (ipv4SegmentsPlageDebut.value[index]) {
          ipv4SegmentsPlageDebut.value[index].value = content.slice(0, 3);
        }
      });
  } else {
    pasted
      .trim()
      .split(":")
      .forEach((content, index) => {
        if (ipv6SegmentsPlageDebut.value[index]) {
          ipv6SegmentsPlageDebut.value[index].value = content.slice(0, 4);
        }
      });
  }
};

const onPastePlageFin = (evt: ClipboardEvent) => {
  const pasted = evt.clipboardData?.getData("text") ?? "";
  if (typeIp.value === "IPV4") {
    pasted
      .trim()
      .split(".")
      .forEach((content, index) => {
        if (ipv4SegmentsPlageFin.value[index + 2]) {
          ipv4SegmentsPlageFin.value[index + 2].value = content.slice(0, 3);
        }
      });
  } else {
    pasted
      .trim()
      .split(":")
      .forEach((content, index) => {
        if (ipv6SegmentsPlageFin.value[index]) {
          ipv6SegmentsPlageFin.value[index].value = content.slice(0, 4);
        }
      });
  }
};

watch(
  ipv4SegmentsPlageDebut,
  () => {
    if (ipv4SegmentsPlageFin.value[0]) {
      ipv4SegmentsPlageDebut.value[0] = ipv4SegmentsPlageFin.value[0];
    }
    if (ipv4SegmentsPlageFin.value[1]) {
      ipv4SegmentsPlageDebut.value[1] = ipv4SegmentsPlageFin.value[1];
    }
  },
  { deep: true }
);

onMounted(() => {
  clear(false);
});

defineExpose({
  clear
});
</script>

<style scoped>
button {
  font-size: 12px !important;
}
#btnText {
  padding-right: 5px;
}
#btnToBtm {
  height: 58%;
}
#fillHeight {
  height: 70%;
}
</style>

<style>
.v-input--is-disabled > .v-input__control > .v-input__slot {
  background: #b0b4c4 !important;
}
</style>
