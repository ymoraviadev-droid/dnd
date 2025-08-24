export const TOAST_TYPES = {
  DEFAULT: "DEFAULT",
  SUCCESS: "SUCCESS",
  ERROR:   "ERROR",
  WARNING: "WARNING",
  INFO:    "INFO",
} as const;

export type ToastType = typeof TOAST_TYPES[keyof typeof TOAST_TYPES];

/** The API for the container’s show() and the global PixelToast.show() */
export type PixelToastShowFn = (
  message: string,
  type?: ToastType,
  duration?: number   // ← WIDE number, not a literal
) => void;

export type ToastTypeFns = (message: string, duration?: number) => void;

/** The ref shape the container registers globally */
export type ToastRefType = {
  current: { show: PixelToastShowFn } | null;
};
