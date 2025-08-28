import { forgotPasswordMail } from "../mails/forgotPassword.mail.js";
import { manyAttemptsMail } from "../mails/manyAttempts.mail.js";
import { registerMail } from "../mails/register.mail.js";
import { resetPasswordMail } from "../mails/resetPassword.mail.js";

export const renderByKind = {
    register: registerMail,
    forgotPassword: forgotPasswordMail,
    manyAttempts: manyAttemptsMail,
    resetPassword: resetPasswordMail
} as const;