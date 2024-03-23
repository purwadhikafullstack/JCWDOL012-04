import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import getWarehouses, { createWarehouse } from "@/controllers/warehouse.controller";
import { superAdminGuard } from "@/middlewares/auth/userDataVerification";

const warehouseRouter = Router();

warehouseRouter.get('/',
    requireJwtAuth,
    superAdminGuard,
    getWarehouses
)

warehouseRouter.post('/create',
    // requireJwtAuth,
    // superAdminGuard,
    createWarehouse
)

export default warehouseRouter;