import { Router } from "express";
import { loginWithEmail, registerWithEmail } from "@/controllers/auth.controller";

const authRouter = Router();

authRouter.post('/register', registerWithEmail);
authRouter.post('/login', loginWithEmail);

export { authRouter };