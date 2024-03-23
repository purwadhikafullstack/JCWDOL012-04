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
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    gender: "male" | "female" | undefined
    isVerified?: boolean
    createdAt?: Date
    updatedAt?: Date
    archived?: boolean
}