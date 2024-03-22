import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import distance from "@/lib/distance";
import { resInternalServerError, resSuccess, resUnprocessable } from "@/services/responses";

const prisma = new PrismaClient();

export async function getProvinces(req: Request, res: Response) {
    await prisma.provinces.findMany()
        .then((provinces) => res.json({ data: provinces }))
        .catch((error) => res.status(500).json({ message: error.message }))
}

export async function getCities(req: Request, res: Response) {
    if (req.params.provinceId) {
        await prisma.cities.findMany({
            where: {
                provinceId: parseInt(req.params.provinceId)
            }
        })
            .then((cities) => res.json({ data: cities }))
            .catch((error) => res.status(500).json({ message: error.message }))
    } else {
        await prisma.cities.findMany()
            .then((cities) => res.json({ data: cities }))
            .catch((error) => res.status(500).json({ message: error.message }))
    }
}

export async function getClosestWarehouse(req: Request, res: Response) {
    const latitude = req.query.lat ? String(req.query.lat) : null;
    const longitude = req.query.lng ? String(req.query.lng) : null;

    if (!latitude || !longitude) return resUnprocessable(res, 'Please provide shipping address', null);

    const warehouses = await prisma.warehouses.findMany({
        where: {
            archived: false
        }
    });
    if (!warehouses) return resInternalServerError(res, 'No warehouse is available', null);

    const closestWarehouse = warehouses.reduce((prev, current) => {
        const prevDistance = distance(latitude, longitude, prev.latitude, prev.longitude);
        const currentDistance = distance(latitude, longitude, current.latitude, current.longitude);
        return prevDistance < currentDistance ? prev : current;
    });

    if (closestWarehouse) return resSuccess(res, 'Closest warehouse found', closestWarehouse);

    return resInternalServerError(res, 'Error getting closest warehouse', null);
}
