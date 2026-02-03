export const useRecaptcha = () => {
  const loadRecaptcha = async () => {
    const maybeRecaptchaLoaded = (globalThis as any).$recaptchaLoaded;
    if (maybeRecaptchaLoaded) {
      await maybeRecaptchaLoaded();
    }
  };

  const executeRecaptcha = async (action: string) => {
    const maybeRecaptcha = (globalThis as any).$recaptcha;
    if (maybeRecaptcha) {
      return await maybeRecaptcha(action);
    }
    return "";
  };

  return {
    loadRecaptcha,
    executeRecaptcha
  };
};
