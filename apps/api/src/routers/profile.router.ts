import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { setPassword } from "@/controllers/auth.controller";
import { changeEmail, changeName, sendChangeEmail, updateProfilePicture, validateEmailChangeRequest, validatePassword } from "@/controllers/profile.controller";
import { uploader } from "@/middlewares/uploader";

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

profileRouter.patch('/change/profile-picture',
    requireJwtAuth,
    uploader(`PP`, '/images/profile-pictures', 'profile-picture').single('file'),
    updateProfilePicture
)

export { profileRouter };