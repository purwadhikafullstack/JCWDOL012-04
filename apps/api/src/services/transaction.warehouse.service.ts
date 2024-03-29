import { prisma } from "./prisma.service";

export default class TransactionWarehouseService {
    prisma;
    constructor(){
        this.prisma = prisma;
    }

    async getAll(){
        return await this.prisma.warehouses.findMany({
            where: {
                archived: false
            }
        });
    }

    async getById(id:number){
        return await this.prisma.warehouses.findUnique({
            where: {
                id: id
            }
        });
    }

    async getByCityId(cityId:number){
        return await this.prisma.warehouses.findMany({
            where: {
                cityId: cityId
            }
        });
    }

}