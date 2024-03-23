import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { getWarehouse, getWarehouses, archiveWarehouse, createWarehouse, updateWarehouse } from "@/controllers/warehouse.controller";
import { superAdminGuard } from "@/middlewares/auth/userDataVerification";

const warehouseRouter = Router();

warehouseRouter.get('/',
    requireJwtAuth,
    superAdminGuard,
    getWarehouses
)

warehouseRouter.get('/:id',
    requireJwtAuth,
    getWarehouse
)

warehouseRouter.patch('/:id',
    requireJwtAuth,
    superAdminGuard,
    updateWarehouse
)

warehouseRouter.post('/create',
    requireJwtAuth,
    superAdminGuard,
    createWarehouse
)

warehouseRouter.patch('/:id/archive',
    requireJwtAuth,
    superAdminGuard,
    archiveWarehouse
)

export default warehouseRouter;