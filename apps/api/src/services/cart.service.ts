import {prisma} from './prisma.service';


export default class CartService {
    prisma;
    constructor() {
        this.prisma = prisma;
    }

    async get(): Promise<any> {
        return await this.prisma.shoppingCart.findMany({
            include: {
                product: true
            }
        });
    }

    async getById(id: number): Promise<any> {
        return await this.prisma.shoppingCart.findUnique({
            where: {
                id: id,
                archived: false
            }
        });
    }

    async getByIdFirst(id: number): Promise<any> {
        return await this.prisma.shoppingCart.findFirst({
            where: {
                id: id,
                archived: false
            }
        });
    }

    async preAdd(productId:number): Promise<any> {
        return await this.prisma.products.findUnique({
            where: {
                id: productId,
                archived: false
            },
            include: {
                productImages: true,
            }
        });
    }

    async add(shoppingCart: any): Promise<any> {
        return await this.prisma.shoppingCart.create({
            data: shoppingCart
        });
    }

    async update(id: number, shoppingCart: any): Promise<any> {
        return await this.prisma.shoppingCart.update({
            where: {
                id: id,
                archived: false
            },
            data: shoppingCart
        });
    }

    async remove(id: number): Promise<any> {
        return await this.prisma.shoppingCart.delete({
            where: {
                id: id
            }
        });
    }

    async getByUserId(userId: number): Promise<any> {
        return await this.prisma.shoppingCart.findMany({
            where: {
                userId: userId,
                archived: false
            }, 
            include: {
                product: true
            },
            orderBy: {
                createdAt: 'desc'
            },
        });
    }

    async getByProductId(productId: number): Promise<any> {
        return await this.prisma.shoppingCart.findMany({
            where: {
                productId: productId,
                archived: false
            }
        });
    }

    async getByUserIdProductIdFirst(userId: number, productId: number): Promise<any> {
        return await this.prisma.shoppingCart.findFirst({
            where: {
                userId: userId,
                productId: productId,
                archived: false
            }
        });
    }

    async getGlobalStock(productId: number): Promise<any> {
        return await this.prisma.productsWarehouses.aggregate({
            _sum: {
                stock: true
            },
            where: {
                productId: productId
            },
        });
    }

}