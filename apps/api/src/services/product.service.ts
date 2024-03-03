import { Products } from "@prisma/client";
import { prisma } from "./prisma.service";

export default class ProductService {
    prisma;

    constructor(){
        this.prisma = prisma;
    }

    async get(): Promise<any> {
        return await this.prisma.products.findMany();
    }

    async getById(id: number): Promise<any> {
        return await this.prisma.products.findUnique({
            where: {
                id: id
            }
        });
    }

    async add(product: Products): Promise<any> {
        return await this.prisma.products.create({
            data: product
        });
    }

    async update(id: number, product: Products): Promise<any> {
        return await this.prisma.products.update({
            where: {
                id: id
            },
            data: product
        });
    }

    async remove(id: number): Promise<any> {
        return await this.prisma.products.update({
            where: {
                id: id
            },
            data: {
                archived: true
            }
        })
    }
    
}