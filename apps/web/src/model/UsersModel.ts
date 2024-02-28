import { WarehousesModel } from './WarehousesModel';
import { UserCitiesModel } from './UserCitiesModel';
import { TransactionsModel } from './TransactionsModel';
import { ShoppingCartModel } from './ShoppingCartModel';

export interface UsersModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    gender: string;
    phoneNumber: string;
    isVerified: boolean;
    role: string;
    wareHouseAdmin_warehouseId?: number;
    wareHouseAdmin?: WarehousesModel;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;

    userCities?: UserCitiesModel[];
    transactions?: TransactionsModel[];
    shoppingCart?: ShoppingCartModel[];
}