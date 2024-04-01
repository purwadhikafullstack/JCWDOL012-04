import { ProvincesModel } from './ProvincesModel';
import { UserCitiesModel } from './UserCitiesModel';
import { WarehousesModel } from './WarehousesModel';

export interface CitiesModel {
    id: number | string;
    name: string;
    provinceId: number;
    province?: ProvincesModel;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
    type: "KOTA" | "KABUPATEN"

    users?: UserCitiesModel[];
    warehouses?: WarehousesModel[];
}