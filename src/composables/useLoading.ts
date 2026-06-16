import { useSnackbar } from "@/composables/useSnackbar";
import { ref } from "vue";

export const useLoading = (initialValue = false) => {
  const loading = ref(initialValue);
  const snackbar = useSnackbar();

  const startLoading = () => {
    snackbar.hide();
    loading.value = true;
  };

  const stopLoading = () => {
    loading.value = false;
  };

  return {
    loading,
    startLoading,
    stopLoading
  };
};
