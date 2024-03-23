import TransactionService from "@/services/transaction.service";
import TransactionProductService from "@/services/transaction.product.service";
import UserCitiesTransactionService from "@/services/transaction.userCities.service";
import MutationOrderService from "@/services/transaction.mutation.service";
import TransactionWarehouseService from "@/services/transaction.warehouse.service";
import ProductTransactionService from "@/services/product.transaction.service";
import { TransactionsCreateModel } from "@/model/transaction.create.model";
import { transactionProductCreateModel } from "@/model/transaction.product.create.model";
import { MutationCreateModel } from "@/model/transaction.mutation.create.model";
import distance from "@/lib/distance";
import { Transactions, TransactionsProducts, mutationType, Users, UserCities, paymentType, ShoppingCart, Warehouses, orderStatus } from "@prisma/client";
import { Request, Response } from "express";
import { midtransRequest } from "@/model/transaction.midtrans.create.model";
import { prisma } from "@/services/prisma.service";

type transactionData = {
    userId: number,
    total: number,
    paymentType: paymentType,
    warehouseId: number,
    shippingCost: number
};

export default class TransactionController {
    TransactionService: TransactionService;
    TransactionProductService: TransactionProductService;
    MutationOrderService: MutationOrderService;
    UserCitiesTransactionService: UserCitiesTransactionService;
    TransactionWarehouseService: TransactionWarehouseService;
    ProductTransactionService: ProductTransactionService;
    constructor() {
        this.TransactionService = new TransactionService();
        this.TransactionProductService = new TransactionProductService();
        this.MutationOrderService = new MutationOrderService();
        this.UserCitiesTransactionService = new UserCitiesTransactionService();
        this.TransactionWarehouseService = new TransactionWarehouseService();
        this.ProductTransactionService = new ProductTransactionService();
    }

    async getTotal(orders: ShoppingCart[]): Promise<number> {
        let total = 0;
        for (const order of orders) {
            const price = await this.ProductTransactionService.getById(order.productId).then(product => product?.price) ?? 0;
            total += price * order.quantity;
        }
        return total;
    }

    //input from body:
    // shoppingCart[],
    // paymentType,
    // shipping cost
    async preTransaction(req: Request, res: Response): Promise<void> {
        const user:any = req.user;
        const userId = user.id;
        const orders: ShoppingCart[] = req.body.orders;
        let total = await this.getTotal(orders);
        const paymentType: paymentType = req.body.paymentType;
        const closestWarehouseId: number = req.body.closestWarehouseId;
        const shippingCost = req.body.shippingCost;
        if (closestWarehouseId != null && shippingCost != null && paymentType != null && total != null && userId != null && orders != null && orders.length > 0 && total > 0) {
            let orderStatus: orderStatus = "PENDING_PROOF";
            const transactionLatestId = await this.TransactionService.getLatestId();
            const transactionUid = `ORDER-${transactionLatestId + 1}-${Date.now()}`
            const transactionData: TransactionsCreateModel = {
                userId: userId,
                transactionUid: transactionUid,
                total: total,
                paymentType: paymentType,
                orderStatus: orderStatus,
                warehouseId: closestWarehouseId,
                shippingCost: shippingCost
            };
            if (paymentType === "PAYMENT_GATEWAY") { await this.handlePaymentGateway(req, res, transactionData); }
            if (paymentType === "TRANSFER") { 
                const result = await this.handlePayment(req, res, transactionData); 
                if(result != null){
                    res.status(201).json(result);
                }
            }
        } else {
            res.status(400).json({ message: "Invalid request" });
        }
    }

    async handleShipment(req:Request, res:Response): Promise<void> {
        const transactionUid = req.body.order_id;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        const mutationTempData: MutationCreateModel[] = [];
        if(transaction != null){
            const transactionProduct = await this.TransactionProductService.getByTransactionId(transaction.id);
            if(transactionProduct != null){
                for(const product of transactionProduct){
                    const mutationData: MutationCreateModel = {
                        transactionId: transaction.id,
                        productId: product.productId,
                        quantity: product.quantity,
                        isAdd: false,
                        mutationType: "TRANSACTION",
                        warehouseId: transaction.warehouseId,
                    }
                    mutationTempData.push(mutationData);
                }
                const result = await this.MutationOrderService.createShipment(mutationTempData);
                if(result){
                    res.status(201).json(transaction);
                }else{
                    res.status(500).json({message: "Internal server error"});
                }
            }
        }else{
            res.status(404).json({message: "Transaction not found"});
        }
    }

    async handleMutationReversal(req:Request, res:Response): Promise<void> {
        //work later
    }

    async handlePaymentGatewaySuccess(req: Request, res: Response) {
        const transactionUid = req.body.order_id;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.paymentGatewaySuccess(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async handlePaymentGatewayFailed(req: Request, res: Response) {
        const transactionUid = req.body.order_id;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.paymentGatewayFailed(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async handlePaymentGateway(req: Request, res: Response, transactionData: TransactionsCreateModel) {
        const midtransRequest: midtransRequest = {
            "transaction_details": {
                "order_id": transactionData.transactionUid,
                "gross_amount": transactionData.total
            }
        }

        const temp = await this.handlePayment(req, res, transactionData);
        if (temp != null) {
            const midtransResponse = await this.TransactionService.createMidtransTransaction(midtransRequest);
            if (midtransResponse != null) {
                res.status(201).json(midtransResponse);
            }else{
                res.status(500).json({message: "Internal server error"});
            }
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async handlePayment(req: Request, res: Response, transactionData: TransactionsCreateModel): Promise<Transactions> {
        const orders: ShoppingCart[] = req.body.orders;
        const transactionProductTempData: transactionProductCreateModel[] = [];
        for (const order of orders) {
            const price = await this.ProductTransactionService.getById(order.productId).then(product => product?.price) ?? 0;
            const transactionProductData: transactionProductCreateModel = {
                productId: order.productId,
                price: price,
                quantity: order.quantity
            };
            transactionProductTempData.push(transactionProductData);
        }
        const result: Transactions = await this.TransactionService.create(transactionData, transactionProductTempData);
        return result;
    }



    async getClosestWarehouse(req: Request): Promise<Warehouses> {
        const userCityId: number = parseInt(req.body.userCityId?.toString() ?? "-1");
        const userCity: UserCities = await this.UserCitiesTransactionService.getById(userCityId) as UserCities;
        if (userCity.closestWarehouseId != null) {
            const warehouse = await this.TransactionWarehouseService.getById(userCity.closestWarehouseId) as Warehouses;
            return warehouse;
        }
        const warehouses = await this.TransactionWarehouseService.getAll();
        const result = await this.getMinDistance(warehouses, userCity);
        return result;
    }

    async getMinDistance(warehouses: Warehouses[], userCities: UserCities): Promise<Warehouses> {
        let closestWarehouseId = -1;
        let closestDistance = Number.MAX_SAFE_INTEGER;
        let closestWarehouse: Warehouses = {} as Warehouses;
        for (const warehouse of warehouses) {
            const distanceToWarehouse = distance(warehouse.latitude, warehouse.longitude, userCities?.latitude ?? "0", userCities?.longitude ?? "0");
            if (distanceToWarehouse < closestDistance) {
                closestDistance = distanceToWarehouse;
                closestWarehouseId = warehouse.id;
                closestWarehouse = warehouse;
            }
        }
        if (closestWarehouseId != -1) {
            await this.UserCitiesTransactionService.updateClosestWarehouseId(userCities.id, closestWarehouseId);
            return closestWarehouse;
        } else {
            return {} as Warehouses;
        }
    }

    async getUsersByUserId(req: Request, res: Response): Promise<void> {
        const user:any = req.user;
        const userId = user.id;
        const transactions = await this.UserCitiesTransactionService.getUsersByUserId(userId);
        res.status(200).json(transactions);
    }

    async getUserCitiesByUserId(req: Request, res: Response): Promise<void> {
        const user:any = req.user;
        const userId = user.id;
        const userCities = await this.UserCitiesTransactionService.getByUserId(userId);
        res.status(200).json(userCities);
    }

}