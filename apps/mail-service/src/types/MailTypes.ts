export type MailKind = 'register' | 'forgotPassword' | 'manyAttempts' | 'resetPassword';

export type MailJob = {
    kind: MailKind;
    to: string;
    name: string;
    payload: string;        // token / new password / etc.
};

export type MailRequest = MailJob & {
    replyTo: string;
    correlationId: string;
    schema: 1;
};