import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { addAddress, archieveAddress, createWarehouseAdmin, getAdmins, getUserAddresses, setAsPrimaryAddress, updateAddress } from "@/controllers/user.controller";

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

userRouter.patch('/address/:id/update',
    requireJwtAuth,
    updateAddress
)

userRouter.get('/admin',
    requireJwtAuth,
    getAdmins
)

userRouter.post('/admin/wh/create',
    requireJwtAuth,
    // SUPER_ADMIN GUARD
    createWarehouseAdmin
)

export { userRouter };