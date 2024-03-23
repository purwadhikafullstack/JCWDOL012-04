import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { getCities, getClosestWarehouse, getProvinces } from "@/controllers/data.controller";

const dataRouter = Router();

dataRouter.get('/provinces',
    requireJwtAuth,
    getProvinces
)

dataRouter.get('/cities',
    requireJwtAuth,
    getCities
)

dataRouter.get('/:provinceId/cities',
    requireJwtAuth,
    getCities
)

dataRouter.get('/closest-wh',
    // requireJwtAuth,
    getClosestWarehouse
)

export { dataRouter }