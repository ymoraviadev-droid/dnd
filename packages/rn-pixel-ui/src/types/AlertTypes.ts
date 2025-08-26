export type AlertVariant = "info" | "success" | "warning" | "error" | "confirm";

export type AlertOptions = {
    title: string;
    content: string | React.ReactNode;
    variant?: AlertVariant;
    isQuestion?: boolean;     // show No button only if true
    yesText?: string;
    noText?: string;
    icon?: React.ReactNode;   // override default icon
    onYes?: () => void | Promise<void>;
    onNo?: () => void | Promise<void>;
};