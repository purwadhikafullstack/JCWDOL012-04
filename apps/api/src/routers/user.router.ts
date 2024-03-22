import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { addAddress, archieveAddress, archieveWarehouseAdmin, createWarehouseAdmin, getAdmins, getUserAddresses, setAsPrimaryAddress, updateAddress } from "@/controllers/user.controller";
import { superAdminGuard } from "@/middlewares/auth/userDataVerification";

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
    superAdminGuard,
    createWarehouseAdmin
)

userRouter.patch('/admin/wh/:id/archieve',
    requireJwtAuth,
    superAdminGuard,
    archieveWarehouseAdmin
)

export { userRouter };