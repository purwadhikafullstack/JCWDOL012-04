import { Request, Response } from "express";
import axios from "axios";
import { resInternalServerError, resSuccess } from "@/services/responses";

export async function getShippingMethod(req: Request, res: Response) {

    if (!req.body.origin || !req.body.destination || !req.body.weight || !req.body.courier) return resInternalServerError(res, 'Please provide the correct request data', null);
    const rajaOngkirApiKey = process.env.RAJAONGKIR_API_KEY;
    const rajaOngkirUrl = process.env.RAJAONGKIR_URL;

    if (!rajaOngkirApiKey || !rajaOngkirUrl) {
        console.error('RAJAONGKIR_API_KEY or RAJAONGKIR_URL is not defined');
        return resInternalServerError(res, 'Internal server error', null);
    }

    const shippingMethod = await axios.post(`${rajaOngkirUrl}/cost`, req.body, {
        headers: {
            key: rajaOngkirApiKey,
        }
    })
        .then((response) => response.data.rajaongkir.results)
        .catch((error) => {
            console.error(error)
            resInternalServerError(res, 'Error getting shipping method', null)
        })

    if (shippingMethod) return resSuccess(res, 'Shipping method found', shippingMethod)

    return resInternalServerError(res, 'Error getting shipping method', null)
}