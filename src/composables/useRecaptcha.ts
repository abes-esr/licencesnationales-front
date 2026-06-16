import { useReCaptcha } from "vue-recaptcha-v3";

export const useRecaptcha = () => {
  const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

  const getRecaptchaToken = async (action: string) => {
    await recaptchaLoaded();
    return await executeRecaptcha(action);
  };

  return {
    getRecaptchaToken
  };
};
