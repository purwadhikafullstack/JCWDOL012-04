import { ProductsModel } from './ProductsModel';

export interface ProductImagesModel {
    id: number;
    prductId: number;
    path: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    products?: ProductsModel;
}