import { formatApiError } from "@/utils/formatApiError";
import { Logger } from "@/utils/Logger";
import { reactive } from "vue";

export enum MessageType {
  ERREUR,
  INFORMATION,
  AVERTISSEMENT,
  VALIDATION
}

export type SnackbarState = {
  isDisplayed: boolean;
  sticky: boolean;
  multiline: boolean;
  type: MessageType;
  text: string;
  timeout?: number;
  onHide?: () => void;
  onShow?: () => void;
};

export type SnackbarOptions = Partial<Omit<SnackbarState, "isDisplayed" | "text">>;

export type SnackbarShowOptions = Omit<SnackbarOptions, "type" | "sticky" | "multiline"> &
  Partial<Pick<SnackbarState, "sticky" | "multiline">>;

const state = reactive({
  isDisplayed: false,
  sticky: false,
  multiline: true,
  type: MessageType.INFORMATION,
  text: ""
});

export const snackbarState = state;

export const useSnackbar = () => {
  const show = async (text: string, options: SnackbarOptions = {}) => {
    const { timeout = 10000, onHide, onShow } = options;
    state.isDisplayed = true;
    state.sticky = options.sticky ?? false;
    state.multiline = options.multiline ?? true;
    state.type = options.type ?? MessageType.INFORMATION;
    state.text = text;

    if (onShow) {
      onShow();
    }

    if (typeof timeout === "number" && timeout > 0) {
      setTimeout(() => {
        hide(onHide);
      }, timeout);
    }
  };

  const hide = (onHide?: () => void) => {
    state.isDisplayed = false;
    if (onHide) {
      onHide();
    }
  };

  const success = (text: string, options: SnackbarShowOptions = {}) => {
    return show(text, {
      type: MessageType.VALIDATION,
      sticky: options.sticky ?? true,
      multiline: options.multiline ?? true,
      ...options
    });
  };

  const error = (err: any, options: SnackbarShowOptions = {}) => {
    const text = formatApiError(err);
    Logger.error(text);
    return show(text, {
      type: MessageType.ERREUR,
      sticky: options.sticky ?? false,
      multiline: options.multiline ?? true,
      ...options
    });
  };

  const info = (text: string, options: SnackbarShowOptions = {}) => {
    Logger.info(text);
    return show(text, {
      type: MessageType.INFORMATION,
      sticky: options.sticky ?? false,
      multiline: options.multiline ?? true,
      ...options
    });
  };

  const warning = (text: string, options: SnackbarShowOptions = {}) => {
    Logger.warn(text);
    return show(text, {
      type: MessageType.AVERTISSEMENT,
      sticky: options.sticky ?? true,
      multiline: options.multiline ?? true,
      ...options
    });
  };

  return {
    state,
    show,
    hide,
    success,
    error,
    info,
    warning
  };
};
