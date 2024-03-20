import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { getCities, getProvinces } from "@/controllers/data.controller";

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

export { dataRouter }