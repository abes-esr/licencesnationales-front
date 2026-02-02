import { unref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

type PageMetaOptions = {
  titleKey: string | { value: string };
  descriptionKey?: string | { value: string };
};

const ensureMetaDescription = (): HTMLMetaElement => {
  let tag = document.querySelector<HTMLMetaElement>("meta[name='description']");
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  return tag;
};

export const usePageMeta = ({ titleKey, descriptionKey }: PageMetaOptions) => {
  const { t } = useI18n();

  watchEffect(() => {
    document.title = t(unref(titleKey));
    if (descriptionKey) {
      const meta = ensureMetaDescription();
      meta.content = t(unref(descriptionKey));
    }
  });
};
