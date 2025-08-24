import {
  PixelToastShowFn,
  PixelToastTypeFns,
  TOAST_TYPES,
  ToastRefType,
  ToastType,
} from "../types/ToastTypes";

export const DURATION = {
  SHORT: 2000,
  LONG: 3500,
} as const;

// internal global ref (set by PixelToastContainer on mount)
let toastRef: ToastRefType | null = null;

/** Called by PixelToastContainer; do not call directly from app code */
export function setToastRef(ref: ToastRefType | null) {
  toastRef = ref;
}

export const PixelToast: {
  TYPES: typeof TOAST_TYPES;
  DURATION: typeof DURATION;
  show: PixelToastShowFn;
  success: PixelToastTypeFns;
  error: PixelToastTypeFns;
  warning: PixelToastTypeFns;
  info: PixelToastTypeFns;
} = {
  TYPES: TOAST_TYPES,
  DURATION,

  show: (message, type: ToastType = "DEFAULT", duration = DURATION.SHORT) => {
    if (toastRef?.current) {
      toastRef.current.show(message, type, duration);
    }
  },

  success: (message, duration) => PixelToast.show(message, "SUCCESS", duration),
  error:   (message, duration) => PixelToast.show(message, "ERROR", duration),
  warning: (message, duration) => PixelToast.show(message, "WARNING", duration),
  info:    (message, duration) => PixelToast.show(message, "INFO", duration),
};

export default PixelToast;
