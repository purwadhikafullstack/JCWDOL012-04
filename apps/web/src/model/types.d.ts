type NavLinks = {
    id: number,
    label: string,
    href: string,
}[]

interface RajaOngkirCostResults {
    code: string;
    name: string;
    costs: {
        service: string,
        description: string,
        cost: {
            value: number,
            etd: string,
            note: string
        }[]
    }[];
}

type RajaOngkirRequestCost = {
    origin: string,
    destination: string,
    weight: number,
    courier: string
}

interface AdminModel {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    gender: "male" | "female" | undefined | string
    isVerified?: boolean
    createdAt?: Date
    updatedAt?: Date
    archived?: boolean
}

type TWarehouse = {
    id: number,
    name: string,
    address: string,
    latitude: string,
    longitude: string,
    city: {
        id: number,
        name: string,
        type: string,
        provinceId: string
    },
    warehouseAdmin: {
        id: number,
        firstName: string,
    }[]
}

type TCreateWH = {
    name: string,
    address: string,
    provinceId?: string,
    cityId: string,
    latitude: string,
    longitude: string,
    adminId: string
}

type TWarehouseError = {
    status: number | undefined | null,
    message: string | undefined | null,
} | null