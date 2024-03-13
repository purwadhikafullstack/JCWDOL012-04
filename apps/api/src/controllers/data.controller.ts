import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProvinces(req: Request, res: Response) {
    await prisma.provinces.findMany()
        .then((provinces) => res.json({ data: provinces }))
        .catch((error) => res.status(500).json({ message: error.message }))
}

export async function getCities(req: Request, res: Response) {
    await prisma.cities.findMany({
        where: {
            provinceId: parseInt(req.params.provinceId)
        }
    })
        .then((cities) => res.json({ data: cities }))
        .catch((error) => res.status(500).json({ message: error.message }))
}