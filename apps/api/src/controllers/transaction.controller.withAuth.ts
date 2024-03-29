import TransactionService from "@/services/transaction.service";
import TransactionProductService from "@/services/transaction.product.service";
import UserCitiesTransactionService from "@/services/transaction.userCities.service";
import TransactionWarehouseService from "@/services/transaction.warehouse.service";
import ProductTransactionService from "@/services/product.transaction.service";
import TransactionMutationService from "@/services/transaction.mutation.service";
import { TransactionsCreateModel } from "@/model/transaction.create.model";
import { transactionProductCreateModel } from "@/model/transaction.product.create.model";
import { MutationCreateModel } from "@/model/transaction.mutation.create.model";
import distance from "@/lib/distance";
import { Transactions, Users, UserCities, paymentType, ShoppingCart, Warehouses, orderStatus } from "@prisma/client";
import { Request, Response } from "express";
import { midtransRequest } from "@/model/transaction.midtrans.create.model";
import { ProductStockController } from "./products/product.stock.controller";
import fs from 'fs';
import path from 'path';

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
    UserCitiesTransactionService: UserCitiesTransactionService;
    TransactionWarehouseService: TransactionWarehouseService;
    ProductTransactionService: ProductTransactionService;
    ProductStockController: ProductStockController;
    TransactionMutationService: TransactionMutationService;
    constructor() {
        this.TransactionService = new TransactionService();
        this.TransactionProductService = new TransactionProductService();
        this.UserCitiesTransactionService = new UserCitiesTransactionService();
        this.TransactionWarehouseService = new TransactionWarehouseService();
        this.ProductTransactionService = new ProductTransactionService();
        this.ProductStockController = new ProductStockController();
        this.TransactionMutationService = new TransactionMutationService();
    }

    async requestStock(req: Request, res: Response): Promise<void> {
        const warehouseId = req.body.warehouseId;
        const productId = req.body.productId;
        const transactionId = req.body.transactionId;
        const rawQuantity = req.body.rawQuantity;
        await this.ProductStockController.automatedMutation(warehouseId, productId, transactionId, rawQuantity)
            .then((result) => {
                res.status(200).json(result);
            }).catch((error) => {
                res.status(500).json({ message: "Internal server error" });
            });

    }

    async getAll(req: Request, res: Response): Promise<void> {
        const user = req.user as Users;
        const transactions = await this.TransactionService.getAllTransactionCustomer(user.id);
        res.status(200).json(transactions);
    }

    async getAllForAdmin(req: Request, res: Response): Promise<void> {
        const user = req.user as Users;
        let transactions: Transactions[] = [];
        if (user.role == "SUPER_ADMIN") {
            transactions = await this.TransactionService.getAllTransactionAdmin();
        }
        if (user.role == "WAREHOUSE_ADMIN" && user.wareHouseAdmin_warehouseId != null) {
            transactions = await this.TransactionService.getAllTransactionAdminWarehouse(user.wareHouseAdmin_warehouseId);
        }
        if (transactions.length === 0) {
            res.status(404).json({ message: "Transaction not found" });
        } else {
            res.status(200).json(transactions);
        }
    }

    async getAllOrderStatus(req: Request, res: Response): Promise<void> {
        const orderStatus = await this.TransactionService.getAllOrderStatus();
        res.status(200).json(orderStatus);
    }

    async getAllProductCategory(req: Request, res: Response): Promise<void> {
        const productCategories = await this.TransactionProductService.getAllProductCategory();
        res.status(200).json(productCategories);
    }

    async getTransactionByUid(req: Request, res: Response): Promise<void> {
        const user = req.user as Users;
        const transactionUid = req.params.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null && transaction.userId === user.id) {
            res.status(200).json(transaction);
        } else if (transaction != null && transaction.userId !== user.id) {
            res.status(403).json({ message: "Forbidden" });
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async getTransactionByUidAdmin(req: Request, res: Response): Promise<void> {
        const user = req.user as Users;
        const transactionUid = req.params.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUidAdmin(transactionUid);
        if (transaction != null && (user.role === "SUPER_ADMIN" || (user.role === "WAREHOUSE_ADMIN" && user.wareHouseAdmin_warehouseId === transaction.warehouseId))) {
            res.status(200).json(transaction);
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    }

    async getLatestTransactionUid(req: Request, res: Response): Promise<void> {
        const user = req.user as Users;
        const latestTransactionUid = await this.TransactionService.getLatestTransactionUid(user.id);
        if (latestTransactionUid === '') {
            res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(latestTransactionUid);
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
        const user: Users = req.user as Users;
        const userId = user.id;
        const orders: ShoppingCart[] = req.body.orders;
        let total = await this.getTotal(orders);
        const paymentType: paymentType = req.body.paymentType;
        const closestWarehouseId: number = req.body.closestWarehouseId;
        const shippingAddressId: number = req.body.shippingAddressId;
        total += req.body.shippingCost;
        const shippingCost = req.body.shippingCost;
        if (closestWarehouseId != null && shippingCost != null && paymentType != null && orders != null && orders.length > 0 && shippingAddressId) {
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
                shippingAddressId: shippingAddressId,
                shippingCost: shippingCost,
            };
            if (paymentType === "PAYMENT_GATEWAY") {
                await this.handlePaymentGateway(req, res, transactionData);
            }
            if (paymentType === "TRANSFER") {
                const result = await this.handlePayment(req, res, transactionData);
                if (result != null) {
                    res.status(201).json(result);
                }
            }
        } else {
            res.status(400).json({ message: "Invalid request" });
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

    async handlePaymentGateway(req: Request, res: Response, transactionData: TransactionsCreateModel) {
        const midtransRequest: midtransRequest = {
            "transaction_details": {
                "order_id": transactionData.transactionUid,
                "gross_amount": transactionData.total
            }
        }


        const result = await this.handlePayment(req, res, transactionData);
        if (result != null) {
            const midtransResponse = await this.TransactionService.createMidtransTransaction(midtransRequest);
            if (midtransResponse != null) {
                res.status(201).json(midtransResponse);
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async handleShipment(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.order_id;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        const mutationTempData: MutationCreateModel[] = [];
        if (transaction != null) {
            const transactionProduct = await this.TransactionProductService.getByTransactionId(transaction.id);
            if (transactionProduct != null) {
                for (const product of transactionProduct) {
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
                const result = await this.TransactionMutationService.createShipment(mutationTempData);
                if (result) {
                    res.status(201).json(transaction);
                } else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async handleMutationReversal(req: Request, res: Response): Promise<void> {
        //work later
    }

    async cancelOrder(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.cancelTransaction(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async confirmOrder(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.confirmTransaction(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async handlePaymentGatewayNotif(req: Request, res: Response) {
        const status = req.body.transaction_status;
        const transactionUid = req.body.order_id;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            let updatedTransaction: Transactions | null = null;
            if (status == 'settlement' || status == "capture") {
                updatedTransaction = await this.TransactionService.paymentGatewaySuccess(transactionUid);
            } else if (status != "pending") {
                updatedTransaction = await this.TransactionService.paymentGatewayFailed(transactionUid);
            }

            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
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
        const user: any = req.user;
        const userId = user.id;
        const transactions = await this.UserCitiesTransactionService.getUsersByUserId(userId);
        res.status(200).json(transactions);
    }

    async getUserCitiesByUserId(req: Request, res: Response): Promise<void> {
        const user: any = req.user;
        const userId = user.id;
        const userCities = await this.UserCitiesTransactionService.getByUserId(userId);
        res.status(200).json(userCities);
    }

    async postPaymentProof(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const paymentProof = req.file ? req.file.path : '';
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction && paymentProof) {
            if (transaction.paymentProof) {
                // fs.unlink(path.join(__dirname, '../../', transaction.paymentProof), (err) => {
                fs.unlink(path.join(process.cwd(), transaction.paymentProof), (err) => {
                    if (err) {
                        console.error(`Failed to delete old payment proof: ${err.message}`);
                        res.status(500).json({ message: "Internal server error" });
                    }
                });
            }
            const updatedTransaction = await this.TransactionService.postPaymentProof(transactionUid, paymentProof);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            if (!paymentProof) {
                res.status(404).json({ message: "Payment proof not found" });
            }
            if (!transaction) {
                res.status(404).json({ message: "Transaction not found" });
            }
        }
    }

    async verifyPaymentProof(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.verifyPayment(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async denyPaymentProof(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.denyPayment(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    async processOrder(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const updatedTransaction = await this.TransactionService.processOrder(transactionUid);
            if (updatedTransaction != null) {
                res.status(200).json(updatedTransaction);
            }
        } else {
            res.status(404).json({ message: "Transaction not found" });
        }
    }

    //not done
    async shipOrder(req: Request, res: Response): Promise<void> {
        const transactionUid = req.body.transactionUid;
        const transaction = await this.TransactionService.getByTransactionUid(transactionUid);
        if (transaction != null) {
            const transactionProducts = await this.TransactionProductService.getByTransactionId(transaction.id);
            const mutationDataList: MutationCreateModel[] = [];
            if (transactionProducts != null) {
                for (const transactionProduct of transactionProducts) {
                    const mutationData: MutationCreateModel = {
                        transactionId: transaction.id,
                        productId: transactionProduct.productId,
                        warehouseId: transaction.warehouseId,
                        isAdd: false,
                        quantity: transactionProduct.quantity,
                        mutationType: "TRANSACTION"
                    }
                    mutationDataList.push(mutationData);
                }
                const product = await this.TransactionMutationService.createShipment(mutationDataList);
                if (product) {
                    const updatedTransaction = await this.TransactionService.shipTransaction(transactionUid);
                    if (updatedTransaction != null) {
                        res.status(200).json(updatedTransaction);
                    }
                }
            } else {
                res.status(404).json({ message: "Transaction not found" });
            }
        }else{
            res.status(500).json({message: "Internal server error"});
        }
    }

}