import { Request, Response } from "express";
import { Users } from "@prisma/client";
import TransactionWarehouseService from "@/services/transaction.warehouse.service";
import { prisma } from "@/services/prisma.service";

export default class TransactionWarehouseController {
    prisma;
    transactionWarehouseService;
    constructor(){
        this.prisma = prisma;
        this.transactionWarehouseService = new TransactionWarehouseService();
    }

    async getAll(req: Request, res: Response){
        const user = req.user as Users;
        if(user.role !== 'SUPER_ADMIN'){
            return res.status(403).json({ message: "Forbidden" });
        }
        try {
            const warehouses = await this.transactionWarehouseService.getAll();
            res.status(200).json(warehouses);
        } catch (error) {
            console.error('Error getting warehouses', error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
