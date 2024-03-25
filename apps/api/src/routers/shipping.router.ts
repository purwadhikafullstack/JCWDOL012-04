import { Router } from "express";
import { requireJwtAuth } from "@/middlewares/auth/requireJwtAuth";
import { getShippingMethod } from "@/controllers/shipping.controller";

const shippingRouter = Router();

shippingRouter.post('/method',
    requireJwtAuth,
    getShippingMethod
)

export { shippingRouter }