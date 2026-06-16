import { useI18n } from "vue-i18n";

export const useValidationRules = () => {
  const { t } = useI18n();

  return {
    establishmentNameRules: [(v: string) => !!v || t("validation.establishmentNameRules.required")],
    sirenRules: [
      (v: string) => !!v || t("validation.sirenRules.required"),
      (v: string) => /^\d{9}$/.test(v.trim()) || t("validation.sirenRules.format")
    ],
    establishmentTypeRules: [(v: string) => !!v || t("validation.establishmentTypeRules.required")],
    lastNameRules: [(v: string) => !!v || t("validation.lastNameRules.required")],
    firstNameRules: [(v: string) => !!v || t("validation.firstNameRules.required")],
    addressRules: [(v: string) => !!v || t("validation.addressRules.required")],
    postalCodeRules: [
      (v: string) => !!v || t("validation.postalCodeRules.required"),
      (v: string) => /^\d{5}$/.test(v.trim()) || t("validation.postalCodeRules.format")
    ],
    cityRules: [(v: string) => !!v || t("validation.cityRules.required")],
    phoneRules: [
      (v: string) => !!v || t("validation.phoneRules.required"),
      (v: string) => /^\d{10}$/.test(v.trim()) || t("validation.phoneRules.format")
    ],
    emailRules: [
      (v: string) => !!v || t("validation.emailRules.required"),
      (v: string) => /.+@.+\..+/.test(v.trim()) || t("validation.emailRules.invalid")
    ],
    passwordRules: [
      (v: string) => !!v || t("validation.passwordRules.required"),
      (v: string) => (!!v && v.length >= 8) || t("validation.passwordRules.minLength"),
      (v: string) => /^(.*[a-z]+.*)$/.test(v) || t("validation.passwordRules.lowercase"),
      (v: string) => /^(.*[A-Z]+.*)$/.test(v) || t("validation.passwordRules.uppercase"),
      (v: string) => /^(.*\d+.*)$/.test(v) || t("validation.passwordRules.digit"),
      (v: string) =>
        /^(.*[@$!%*?&]+.*)$/.test(v) || t("validation.passwordRules.special") + "@ $ ! % * ? &"
    ],
    privacyAcceptanceRules: [(v: boolean) => v || t("validation.privacyAcceptanceRules.required")],
    searchDomainRules: [(v: string) => !!v || t("validation.searchDomainRules.required")],
    searchQueryRules: [(v: string) => !!v || t("validation.searchQueryRules.required")],
    dateRules: [(v: string) => !!v || t("validation.dateRules.required")],
    ipv4SegmentRules: [
      (v: string) => !!v || t("validation.ipSegmentRules.required"),
      (v: string) =>
        /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))$/.test(v) ||
        t("validation.ipSegmentRules.invalid")
    ],
    ipv6SegmentRules: [
      (v: string) => !!v || t("validation.ipSegmentRules.required"),
      (v: string) => /^\s*([0-9a-fA-F]{1,4})$/.test(v) || t("validation.ipSegmentRules.invalid")
    ],
    ipv4Rules: [
      (v: string) => !!v || t("validation.ipRules.required"),
      (v: string) =>
        /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
          v
        ) || t("validation.ipRules.invalid")
    ],
    ipv6Rules: [
      (v: string) => !!v || t("validation.ipRules.required"),
      (v: string) =>
        /^\s*(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\s*$/.test(
          v
        ) || t("validation.ipRules.invalid")
    ],
    ipv4RangeRules: [
      (v: string) => !!v || t("validation.ipRangeRules.required"),
      (v: string) =>
        /^(([(\d+)(x+)]){1,3})?\.(([(\d+)(x+)]){1,3})?\.(([(\d+)(x+)]){1,3})(-+([(\d+)(x)]{1,3}))\.(([(\d+)(x+)]){1,3})(-+([(\d+)(x)]{1,3}))$/.test(
          v
        ) || t("validation.ipRangeRules.invalid")
    ],
    ipv6RangeRules: [
      (v: string) => !!v || t("validation.ipRangeRules.required"),
      (v: string) =>
        /^\s*((([0-9a-fA-F]{1,4}:){6,6}[0-9a-fA-F]{1,4}-[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}-[0-9a-fA-F]{1,4}))s*$/.test(
          v
        ) || t("validation.ipRangeRules.invalid")
    ],
    commentRules: [(v: string) => v.length <= 255 || t("validation.commentRules.max255")],
    adminCommentRules: [
      (v: string) => v.length <= 4000 || t("validation.adminCommentRules.max4000")
    ]
  };
};
