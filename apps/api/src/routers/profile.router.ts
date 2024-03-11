import { Router, Request, Response } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { setPassword } from "@/middlewares/auth/verification";
import { changeEmail, changeName, sendChangeEmail, validateEmailChangeRequest, validatePassword } from "@/controllers/profile.controller";
import { resSuccess } from "@/services/responses";

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

profileRouter.post('/request-change-email',
    requireJwtAuth,
    validatePassword,
    sendChangeEmail
)

profileRouter.get('/change/email/verify-token',
    requireJwtAuth,
    validateEmailChangeRequest
)

profileRouter.patch('/change/email',
    requireJwtAuth,
    validatePassword,
    validateEmailChangeRequest,
    changeEmail
)

export { profileRouter };