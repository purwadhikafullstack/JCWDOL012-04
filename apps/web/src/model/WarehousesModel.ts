import { CitiesModel } from './CitiesModel';
import { ProductWarehousesModel } from './ProductWarehousesModel';
import { TransactionsModel } from './TransactionsModel';
import { MutationsModel } from './MutationsModel';
import { UsersModel } from './UsersModel';

export interface WarehousesModel {
    id: number;
    name: string;
    address: string;
    cityId: number;
    city?: CitiesModel;
    latitude: string;
    longitude: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;

    warehouseAdmin?: UsersModel[];
    productsWarehouses?: ProductWarehousesModel[];
    transactions?: TransactionsModel[];
    mutations?: MutationsModel[];
}