export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];

export const TOAST_TYPES = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
    DEFAULT: "default",
};

export type PixelToastShowFn = (message: string, type?: ToastType, duration?: number) => void;
export type PixelToastTypeFns = { (message: string, duration?: number): void };

export type ToastRefType = {
    current: {
        show: PixelToastShowFn;
    } | null;
}