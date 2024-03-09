import TransactionService from "@/services/transaction.service";
import TransactionProductService from "@/services/transaction.product.service";
import UserCitiesTransactionService from "@/services/transaction.userCities.service";
import MutationOrderService from "@/services/transaction.mutation.service";
import TransactionWarehouseService from "@/services/transaction.warehouse.service";
import distance from "@/lib/distance";
import { Transactions, TransactionsProducts, Mutations, mutationType, Users, UserCities, paymentType, ShoppingCart, Warehouses } from "@prisma/client";
import { Request, Response } from "express";
import accCheck from "@/lib/account.check";

export default class TransactionController{
    TransactionService: TransactionService;
    TransactionProductService: TransactionProductService;
    MutationOrderService: MutationOrderService;
    UserCitiesTransactionService: UserCitiesTransactionService;
    TransactionWarehouseService: TransactionWarehouseService;
    user;
    constructor(){
        this.TransactionService = new TransactionService();
        this.TransactionProductService = new TransactionProductService();
        this.MutationOrderService = new MutationOrderService();
        this.UserCitiesTransactionService = new UserCitiesTransactionService();
        this.TransactionWarehouseService = new TransactionWarehouseService();

        this.user = {
            id:1,
            firstName: 'customer1',
            lastName: 'lastName1',
            email: 'email1@bata.com',
            role: 'CUSTOMER',
            isVerified: true
        };
    }

    async create(req:Request, res:Response): Promise<void>{
        // const user = req.user as Users;
        const user = this.user;
        const userId = user.id;
        if(!await accCheck(user, res)) return;
        const orders:ShoppingCart[] = req.body.orders;
        const paymentType:paymentType = req.body.paymentType;
        const userCitiesId:number = req.body.userCitiesId;
        const userCities:UserCities = await this.UserCitiesTransactionService.getById(userCitiesId) as UserCities;
        const closestWarehouseId = (userCities.closestWarehouseId == null) ? await this.getClosestWarehouseId(userCities) : userCities.closestWarehouseId;
        if(closestWarehouseId == -1){
            res.status(400).json({message: "No warehouse found"});
            return;
        }
        // res.status(201).json(newTransaction);
    }

    async getClosestWarehouseId(userCitiesParam:UserCities): Promise<number>{
        const cityWarehouses = await this.TransactionWarehouseService.getByCityId(userCitiesParam.cityId);
        const warehouses = (cityWarehouses.length == 0) ? await this.TransactionWarehouseService.getAll() : cityWarehouses;
        const result = this.getMinDistance(warehouses, userCitiesParam);
        return result;
    }

    async getMinDistance(warehouses:Warehouses[], userCities:UserCities): Promise<number>{
        let closestWarehouseId = -1;
        let closestDistance = Number.MAX_SAFE_INTEGER;
        for(const warehouse of warehouses){
            const distanceToWarehouse = distance(warehouse.latitude, warehouse.longitude, userCities?.latitude??"0", userCities?.longitude??"0");
            if(distanceToWarehouse < closestDistance){
                closestDistance = distanceToWarehouse;
                closestWarehouseId = warehouse.id;
            }
        }
        if(closestWarehouseId!=-1) {
            this.UserCitiesTransactionService.updateClosestWarehouseId(userCities.id, closestWarehouseId);
            return closestWarehouseId;
        }else{
            return -1;
        }
    }

    async getByUserId(req:Request, res:Response): Promise<void>{
        // const user = req.user as Users;
        const user = this.user;
        const userId = user.id;
        const transactions = await this.TransactionService.getByUserId(userId);
        res.status(200).json(transactions);
    }

    async getUserCitiesByUserId(req:Request, res:Response): Promise<void>{
        // const user = req.user as Users;
        const user = this.user;
        const userId = user.id;
        const userCities = await this.UserCitiesTransactionService.getByUserId(userId);
        res.status(200).json(userCities);
    }

}