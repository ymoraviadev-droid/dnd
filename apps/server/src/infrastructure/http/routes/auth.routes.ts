import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync.mw.js";
import { validate } from "../middlewares/validation.mw.js";
import { LoginByTokenSchema, LoginSchema, RegisterSchema } from "@dnd/zod-schemas";
import { loginUser } from "../../../application/auh-actions/loginUser.js";
import { registerUser } from "../../../application/auh-actions/registerUser.js";
import { auth } from "../middlewares/auth.mw.js";
import { logoutUser } from "../../../application/auh-actions/logoutUser.js";
import { getUser } from "../../../application/auh-actions/getUser.js";

const authRouter = Router();

authRouter.post("/", validate("body", RegisterSchema), catchAsync(async (req, res) => {
    const user = req.body;
    const createdUser = await registerUser(user);
    return res.status(200).json(createdUser);
}));

authRouter.post("/login",
    validate("body", LoginSchema),
    catchAsync(async (req, res) => {
        const result = await loginUser(req);
        res.status(200).json(result);
    })
);

authRouter.post("/login/:token",
    validate("params", LoginByTokenSchema),
    catchAsync(async (req, res) => {
        const result = await loginUser(req);
        res.status(200).json(result);
    })
);

authRouter.get("/:id", auth, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await getUser(+id);
    res.status(200).json(user);
}));

authRouter.patch("/logout/:id", auth, catchAsync(async (req, res) => {
    const { id } = req.params;
    await logoutUser(+id);
    res.status(200).send("");
}));

export { authRouter };
