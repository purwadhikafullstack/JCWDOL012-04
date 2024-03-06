export interface UserCitiesModel {
    id: number;
    userId: number;
    cityId: number;
    address: string;
    latitude: string;
    longitude: string;
    isPrimaryAddress: boolean;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}