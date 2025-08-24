import {
  PixelToastShowFn,
  ToastTypeFns,
  TOAST_TYPES,
  ToastRefType,
  ToastType,
} from "../types/ToastTypes";

export const DURATION = {
  SHORT: 2000,
  LONG: 3500,
} as const;

let toastRef: ToastRefType | null = null;
export function setToastRef(ref: ToastRefType | null) { toastRef = ref; }

export const PixelToast: {
  TYPES: typeof TOAST_TYPES;
  DURATION: typeof DURATION;
  show: PixelToastShowFn;
  success: ToastTypeFns;
  error:   ToastTypeFns;
  warning: ToastTypeFns;
  info:    ToastTypeFns;
} = {
  TYPES: TOAST_TYPES,
  DURATION,

  // note: parameter is typed as number via PixelToastShowFn
  show: (message, type: ToastType = TOAST_TYPES.DEFAULT, duration = DURATION.SHORT) => {
    toastRef?.current?.show(message, type, duration);
  },

  success: (message, duration) => PixelToast.show(message, TOAST_TYPES.SUCCESS, duration),
  error:   (message, duration) => PixelToast.show(message, TOAST_TYPES.ERROR, duration),
  warning: (message, duration) => PixelToast.show(message, TOAST_TYPES.WARNING, duration),
  info:    (message, duration) => PixelToast.show(message, TOAST_TYPES.INFO, duration),
};

export default PixelToast;
