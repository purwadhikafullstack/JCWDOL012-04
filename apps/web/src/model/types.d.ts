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