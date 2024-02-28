import { ProductsModel } from "./ProductsModel";

export interface ShoppingCartModel {
    id: number;
    userId: number;
    productId: number;
    product?: ProductsModel;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}