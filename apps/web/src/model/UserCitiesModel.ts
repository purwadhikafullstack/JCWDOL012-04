export interface UserCitiesModel {
    id?: number;
    userId?: number;
    cityId: number | string;
    address: string;
    latitude?: string;
    longitude?: string;
    isPrimaryAddress: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    archieved?: boolean;
    label: string;
}