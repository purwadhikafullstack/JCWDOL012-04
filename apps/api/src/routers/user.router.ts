import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import getCustomers, { addAddress, archieveAddress, archieveWarehouseAdmin, createWarehouseAdmin, getWarehouseAdminData, getAdmins, getUserAddresses, setAsPrimaryAddress, updateAddress, updateWarehouseAdmin, getIdleAdmins } from "@/controllers/user.controller";
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

userRouter.get('/admin/idle',
    requireJwtAuth,
    getIdleAdmins
)

userRouter.post('/admin/wh/create',
    requireJwtAuth,
    superAdminGuard,
    createWarehouseAdmin
)

userRouter.get('/admin/wh/:id',
    requireJwtAuth,
    getWarehouseAdminData
)

userRouter.patch('/admin/wh/:id/archieve',
    requireJwtAuth,
    superAdminGuard,
    archieveWarehouseAdmin
)

userRouter.patch('/admin/wh/:id/update',
    requireJwtAuth,
    superAdminGuard,
    updateWarehouseAdmin
)

userRouter.get('/customers',
    requireJwtAuth,
    superAdminGuard,
    getCustomers
)

export { userRouter };