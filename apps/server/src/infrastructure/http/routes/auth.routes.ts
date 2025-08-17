import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync.mw.js";
import { validate } from "../middlewares/validation.mw.js";
import { LoginByTokenDTO, LoginDTO, RegisterDTO } from "@dnd/zod-schemas";
import { loginUser } from "../../../application/auh-actions/loginUser.js";
import { registerUser } from "../../../application/auh-actions/registerUser.js";
import { auth } from "../middlewares/auth.mw.js";

const authRouter = Router();

authRouter.post("/", validate("body", RegisterDTO), catchAsync(async (req, res) => {
    const user = req.body;
    const createdUser = await registerUser(user);
    return res.status(200).json(createdUser);
}));

authRouter.post(
    "/login/:token?",
    (req, res, next) => {
        const hasToken = typeof req.params.token === "string" && req.params.token.length > 0;
        const mw = hasToken
            ? validate("params", LoginByTokenDTO)
            : validate("body", LoginDTO);
        return mw(req, res, next);
    },
    catchAsync(async (req, res) => {
        const out = await loginUser(req);
        res.status(200).json(out);
    })
);

authRouter.get("/:id", auth, catchAsync(async (req, res) => {
    res.status(200).json({});
}));


authRouter.get("/refresh/:token", auth, catchAsync(async (req, res) => {
    const { token } = req.params;
    res.status(200).send({ new: "ok" });
}));

authRouter.get("/logout", auth, catchAsync(async (req, res) => {
    res.status(200).send("");
}));

authRouter.delete("/:id", auth, catchAsync(async (req, res) => {
    res.status(200).send("");
}));

authRouter.put("/:id", auth, catchAsync(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    // Update user logic here
    res.status(200).send("");
}));

export { authRouter };
