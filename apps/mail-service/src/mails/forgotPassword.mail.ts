import { env } from "@dnd/env";

const { API_URL } = env;

export const forgotPasswordMail = (email: string, name: string, payload: string) => {
    const token = payload;

    return {
        to: email,
        subject: "dnd - Reset Your Password",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c3e50;">Hello ${name},</h2>
                    <h2>Reset Your Password</h2>
                    <p>We have received a request to reset your password. If this was not you, please ignore this email.</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${API_URL}/auth/reset/${token}" 
                           style="background-color: #007bff; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                           Reset Password
                        </a>
                    </div>

                    <p>BridgePoint Team</p>
                </div>
            </div>
        `
    };
};
