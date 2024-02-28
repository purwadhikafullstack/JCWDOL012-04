import { Router } from "express";
import { loginWithEmail, registerWithEmail, verifyToken } from "@/controllers/auth.controller";

const authRouter = Router();

authRouter.post('/register', verifyToken, registerWithEmail);
authRouter.post('/login', verifyToken, loginWithEmail);

export { authRouter };