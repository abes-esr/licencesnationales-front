<template>
  <div>
    <ConfirmPopup ref="confirm" />
    <v-form ref="formAjouterAcces">
      <v-row align="center" justify="center">
        <v-col lg="11" md="12" xs="12">
          <v-row>
            <v-card-title>
              <h1>{{ $t("ip.create.title") }}</h1>
            </v-card-title>
          </v-row>
          <v-row>
            <v-col>
              <a @click="allerListeAcces">
                <FontAwesomeIcon :icon="faReply" />&nbsp;{{ $t("ip.create.backToList") }}
              </a>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" class="pa-0">
              <v-card-title class="pb-0">
                {{ $t("ip.create.chooseType") }}
              </v-card-title>
            </v-col>
            <v-col cols="12" md="4" class="pa-3">
              <v-card-text class="fondGris">
                <FontAwesomeIcon :icon="faCircleInfo" size="2x" style="color: #478dcb;" />
                <a href="https://documentation.abes.fr/aidelicencesnationales/index.html#TutoDeDeclarationDesIP"
                  target="_blank" class="pl-3 pb-6 text-body-1 font-weight-bold">
                  {{ $t("ip.create.helpLink") }}
                </a>
              </v-card-text>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" class="pb-0">
              <v-divider />
              <div id="radioIP">
                <v-radio-group v-model="typeIp" inline @change="
                  clearChild(true);
                clearChild(false);
                ">
                  <v-radio v-for="n in 2" :key="n" :label="typesIp[n - 1]" :value="typesIp[n - 1]" />
                </v-radio-group>
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="8">
              <IpRangeSegments :typeIp="typeIp" typeAcces="ip" ref="ip" @FormModuleSegmentsIpPlageEvent="validate"
                @alertSuccess="alertSuccess" @alertError="alertError" @focus="clearChild(false)" />
              <br />
              <IpRangeSegments :typeIp="typeIp" typeAcces="plage" ref="plage" @FormModuleSegmentsIpPlageEvent="validate"
                @alertSuccess="alertSuccess" @alertError="alertError" @focus="clearChild(true)" />
            </v-col>
            <v-col cols="4">
              <v-card-text class="overflow-auto fondGris">
                <h2 class="pb-4">{{ $t("ip.create.addedListTitle") }}</h2>
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th style="width: 20%">{{ $t("ip.create.table.type") }}</th>
                      <th>{{ $t("ip.create.table.address") }}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in arrayAjouterIp" :key="item.id ?? index">
                      <td>{{ item.typeIp }}</td>
                      <td>{{ item.ip }}</td>
                      <td>
                        <v-btn class="ma-0 pa-0 bouton-simple" variant="text" icon :title="$t('ip.create.delete')"
                          @click="supprimerIP(item.id, index)">
                          <FontAwesomeIcon :icon="faXmark" class="fa-orange" />
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
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
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import IpRangeSegments from "@/components/ip/IpRangeSegments.vue";
import { useIpService } from "@/composables/service/useIpService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useSnackbar } from "@/composables/useSnackbar";
import { RouteName } from "@/router";
import { faCircleInfo, faReply, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbar();
const iPService = useIpService();
const { t } = useI18n();

const typeIp = ref<string>("IPV4");
const typesIp = ["IPV4", "IPV6"];
const arrayAjouterIp = ref<Array<any>>([]);

const formAjouterAcces = ref<VForm | null>(null);
const confirm = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const ip = ref<InstanceType<typeof IpRangeSegments> | null>(null);
const plage = ref<InstanceType<typeof IpRangeSegments> | null>(null);

const metaInfo = {
  meta: [
    {
      name: "description",
      content: t("ip.create.meta.description"),
    },
  ],
  title: t("ip.create.meta.title"),
};

const validate = (payloadFromModuleSegmentsIpPlage: any): void => {
  arrayAjouterIp.value.push(payloadFromModuleSegmentsIpPlage);
};

const clear = () => {
  arrayAjouterIp.value = [];
  formAjouterAcces.value?.resetValidation();
};

const supprimerIP = async (idIP: string, index: number) => {
  const confirmed = await confirm.value?.open(t("ip.create.deleteConfirm"));
  if (confirmed) {
    iPService
      .deleteIP(authStore.token, idIP)
      .then(response => {
        snackbar.success(response.data.message);
        arrayAjouterIp.value.splice(index, 1);
      })
      .catch(err => {
        snackbar.error(err);
      });
  }
};

const alertSuccess = (evt: string) => {
  snackbar.success(evt);
};

const alertError = (evt: string) => {
  snackbar.error(evt);
};

const clearChild = (isPlage: boolean) => {
  if (isPlage) {
    ip.value?.clear(false);
  } else {
    plage.value?.clear(false);
  }
};

const scrollToMessage = () => {
  const messageBox = document.getElementById("messageBox");
  if (messageBox) {
    window.scrollTo(0, messageBox.offsetTop);
  }
};

const allerListeAcces = () => {
  router.push({ name: RouteName.IpList });
};
</script>
<style scoped>
h1 {
  font-size: 30px;
}

#radioIP {
  padding-left: 20px !important;
}

#fillHeight {
  height: 80%;
}
</style>
