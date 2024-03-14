import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { addAddress, archieveAddress, getUserAddresses, setAsPrimaryAddress } from "@/controllers/user.controller";

const userRouter = Router();

userRouter.get('/address',
    requireJwtAuth,
    getUserAddresses
)

userRouter.post('/address/add',
    requireJwtAuth,
    addAddress
)

userRouter.patch('/address/:id/archieve',
    requireJwtAuth,
    archieveAddress
)

userRouter.patch('/address/:id/set-primary',
    requireJwtAuth,
    setAsPrimaryAddress
)

export { userRouter };