<template>
  <div>
    <v-container class="pb-0" :disabled="disableForm">
      <h1>{{ $t("publisher.list.title") }}</h1>
      <v-row class="ma-0">
        <v-col cols="12" md="6" lg="6" xl="6" class="pa-0">
          <ConfirmPopup ref="confirmRef" />
        </v-col>
      </v-row>
      <div class="d-flex flex-row-reverse flex-wrap">
        <v-btn @click="addPublisher" class="btn-1 mx-2 mr-0 my-2">
          {{ $t("publisher.list.create") }}
          <FontAwesomeIcon :icon="faCirclePlus" class="mx-2" />
        </v-btn>
      </div>
    </v-container>

    <v-card variant="flat" class="mt-2" :disabled="disableForm">
      <v-card-text class="fondGris">
        <VDataTable :headers="headers" :header-props="{ class: 'bg-primary' }" :items="publishers" :items-per-page="25"
          :items-per-page-options="[25, 50, 100, { value: -1, title: $t('publisher.list.all') }]"
          class="elevation-0 ma-3" :search="searchQuery" density="compact" :loading="dataLoading" id="mytable">
          <template v-slot:headers="{ columns, toggleSort, isSorted, getSortIcon }">
            <tr>
              <th v-for="column in columns" :key="column.key" class="text-left"
                @click="column.sortable ? toggleSort(column) : ''">
                <div style="display: flex; align-items: center; white-space: nowrap;">
                  <span>{{ column.title }}</span>
                  <v-icon v-if="column.sortable && !isSorted(column)" class="pl-2" size="small">
                    mdi-sort
                  </v-icon>
                  <v-icon v-else-if="column.sortable" class="pl-2" size="small">
                    {{ getSortIcon(column) }}
                  </v-icon>
                </div>
              </th>
            </tr>
          </template>
          <template #top>
            <v-row class="ma-0">
              <v-col cols="12" sm="6" class="px-0">
                <v-tooltip :text="$t('publisher.list.downloadTooltip')" location="top" open-delay="100" theme="dark"
                  content-class="text-white">
                  <template #activator="{ props }">
                    <v-btn variant="text" @click="downloadPublishers" class="bouton-simple " v-bind="props"
                      :loading="isExportLoading">
                      <h2>{{ $t("publisher.list.downloadTitle") }}</h2>
                      <FontAwesomeIcon :icon="faDownload" class="mx-2" size="lg" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="0" sm="3" class="px-0"></v-col>
              <v-col cols="12" sm="3" class="px-0">
                <v-text-field v-model="searchQuery" :label="$t('publisher.list.searchLabel')"
                  prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable />
              </v-col>
            </v-row>
          </template>

          <template #item.createdAt="{ item }">
            <span>{{ item.createdAt.toLocaleDateString() }}</span>
          </template>

          <template #item.action="{ item }">
            <v-btn class="ma-0 pa-0" variant="plain" @click="editPublisher(item)">
              <FontAwesomeIcon color="#1f3f5f" :icon="faPenToSquare" />
            </v-btn>
            <v-btn class="ma-0 pa-0 bouton-simple" variant="plain" @click="deletePublisher(item)">
              <FontAwesomeIcon :icon="faXmark" color="red" />
            </v-btn>
          </template>
        </VDataTable>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { usePublisherStore } from "@/composables/store/usePublisherStore";
import { useSnackbar } from "@/composables/useSnackbar";
import Publisher from "@/entity/Publisher";
import { LicencesNationalesUnauthorizedApiError } from "@/exception/licencesnationales/LicencesNationalesUnauthorizedApiError";
import { RouteName } from "@/router";
import { formatApiError } from "@/utils/formatApiError";
import {
  faCirclePlus,
  faDownload,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { DataTableHeader } from "vuetify";
import { VDataTable } from "vuetify/components";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const publisherStore = usePublisherStore();
const router = useRouter();
const publisherService = usePublisherService();
const { t } = useI18n();

const disableForm = ref(false);
const isExportLoading = ref(false);
const searchQuery = ref("");
const publishers = ref<Array<Publisher>>([]);
const dataLoading = ref(true);
const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);

const headers = computed<DataTableHeader[]>(() => [
  {
    title: t("publisher.list.createdAt"),
    align: "start",
    key: "createdAt",
    sortable: true,
  },
  { title: t("publisher.list.name"), key: "name", sortable: true },
  { title: t("publisher.list.action"), key: "action", sortable: false },
]);

const isAdmin = computed(() => authStore.isAdmin);

onMounted(() => {
  if (!isAdmin.value) {
    snackbar.error(t("publisher.list.notAllowed"), {
      onHide: () => {
        router.push({ name: RouteName.Home });
      },
    });
    return;
  }

  fetchPublishers();
});

async function fetchPublishers() {
  try {
    publishers.value = await publisherService.getPublishers(authStore.token);
  } catch (err: any) {
    if (err instanceof LicencesNationalesUnauthorizedApiError) {
      disableForm.value = true;
      snackbar.error(t("publisher.list.unauthorized"), {
        onHide: () => {
          router.push({ name: RouteName.Home });
        },
      });
    } else {
      snackbar.error(err);
    }
  } finally {
    dataLoading.value = false;
  }
}

async function addPublisher() {
  try {
    await publisherStore.setCurrentPublisher(new Publisher());
    router.push({ name: RouteName.PublisherCreate });
  } catch (err: any) {
    snackbar.error(err);
  }
}

async function editPublisher(item: Publisher) {
  try {
    await publisherStore.setCurrentPublisher(item);
    router.push({ name: RouteName.PublisherEdit });
  } catch (err: any) {
    snackbar.error(err);
  }
}

async function downloadPublishers(): Promise<void> {
  isExportLoading.value = true;
  const ids = publishers.value.map(element => element.id);

  try {
    const response = await publisherService.downloadPublishers(ids, authStore.user.token);
    const fileURL = URL.createObjectURL(
      new Blob([response.data], { type: "application/csv" })
    );
    const fileLink = document.createElement("a");

    fileLink.href = fileURL;
    fileLink.setAttribute("download", "export.csv");
    document.body.appendChild(fileLink);

    fileLink.click();
  } catch (err: any) {
    snackbar.error(formatApiError(err));
  } finally {
    isExportLoading.value = false;
  }
}

async function deletePublisher(item: Publisher) {

  const confirmed = await confirmRef.value?.open(
    t("publisher.list.deleteConfirm", { name: item.name })
  );

  if (!confirmed) {
    return;
  }

  try {
    await publisherService.deletePublisher(item.id, authStore.token);
    snackbar.success(t("publisher.list.deleteSuccess", { name: item.name }));
    fetchPublishers();
  } catch (err: any) {
    snackbar.error(formatApiError(err));
  }
}
</script>

<style>
.v-data-table {
  background-color: transparent !important;
}

.theme--light .v-data-footer__icons-before .v-btn,
.theme--light .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-before .v-btn {
  background-color: transparent !important;
}
</style>
