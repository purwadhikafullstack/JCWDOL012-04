type NavLinks = {
    id: number,
    label: string,
    href: string,
}[]

type RajaOngkirCostResults = {
    code: string,
    name: string,
    costs: {
        service: string,
        description: string,
        cost: {
            value: number,
            etd: string,
            note: string
        }[]
    }[]
}[]