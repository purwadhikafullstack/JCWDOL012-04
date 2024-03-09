import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { setPassword } from "@/middlewares/auth/verification";
import { changeName, validatePassword } from "@/controllers/profile.controller";

const profileRouter = Router();

profileRouter.patch('/change-name',
    requireJwtAuth,
    changeName
)

profileRouter.patch('/change-password',
    requireJwtAuth,
    validatePassword,
    setPassword
)

export { profileRouter };