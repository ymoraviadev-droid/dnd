import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync.mw.js";
import { validate } from "../middlewares/validation.mw.js";
import { LoginDTO, RegisterDTO } from "@dnd/zod-schemas";
import { registerUser } from "../../../application/actions/registerUser.js";
import { loginUser } from "../../../application/actions/loginUser.js";
import { auth } from "../middlewares/auth.mw.js";

const authRouter = Router();

authRouter.post("/", validate("body", RegisterDTO), catchAsync(async (req, res) => {
    const user = req.body;
    const createdUser = await registerUser(user);
    return res.status(200).json(createdUser);
}));

authRouter.post("/login", validate("body", LoginDTO), catchAsync(async (req, res) => {
    const user = await loginUser(req);
    return res.status(200).json(user);
}));

authRouter.post("/login/:token", catchAsync(async (req, res) => {
    const { token } = req.params;
    return res.status(200).json({ ok: true });
}));

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
