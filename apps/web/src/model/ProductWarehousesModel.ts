import { ProductsModel } from './ProductsModel';
import { WarehousesModel } from './WarehousesModel';

export interface ProductWarehousesModel {
    id: number;
    productId: number;
    product?: ProductsModel;
    warehouseId: number;
    warehouse?: WarehousesModel;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}