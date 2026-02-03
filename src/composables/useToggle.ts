import { ref } from "vue";

export const useToggle = (initialValue = false) => {
  const value = ref(initialValue);

  const toggle = () => {
    value.value = !value.value;
  };

  return {
    toggle,
    value
  };
};
