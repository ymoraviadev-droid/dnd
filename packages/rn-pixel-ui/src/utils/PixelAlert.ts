import { AlertOptions } from "../types/AlertTypes";

type Listener = () => void;

let current: (AlertOptions & { id: string }) | null = null;
const queue: (AlertOptions & { id: string })[] = [];
const listeners = new Set<Listener>();

const uid = () => Math.random().toString(36).slice(2);

function emit() { listeners.forEach(l => l()); }

function show(opts: AlertOptions) {
    const item = { id: uid(), ...opts, variant: opts.variant ?? "info" as const };
    if (current) queue.push(item);
    else { current = item; emit(); }
    return item.id;
}

function pop() {
    current = queue.shift() ?? null;
    emit();
}

export const PixelAlert = {
    subscribe(fn: () => void) {
        listeners.add(fn);
        return () => { listeners.delete(fn); }; // always cleanup function
    },
    getCurrent() { return current; },
    show,
    info: (o: Omit<AlertOptions, "variant">) => show({ ...o, variant: "info" }),
    success: (o: Omit<AlertOptions, "variant">) => show({ ...o, variant: "success" }),
    warning: (o: Omit<AlertOptions, "variant">) => show({ ...o, variant: "warning" }),
    error: (o: Omit<AlertOptions, "variant">) => show({ ...o, variant: "error" }),
    confirm: (o: Omit<AlertOptions, "variant" | "isQuestion">) =>
        new Promise<boolean>((resolve) => {
            show({
                ...o,
                variant: "confirm",
                isQuestion: true,
                yesText: o.yesText ?? "Yes",
                noText: o.noText ?? "No",
                onYes: async () => { await o.onYes?.(); resolve(true); },
                onNo: async () => { await o.onNo?.(); resolve(false); },
            });
        }),
    next: pop,
    dismiss: pop,
};
