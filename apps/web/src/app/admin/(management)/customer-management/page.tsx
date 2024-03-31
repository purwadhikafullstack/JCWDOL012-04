import UnauthorizedPage from "@/components/auth/unauthorized"
import { columns } from "./com/columns"
import { DataTable } from "./com/data-table"
import axios from "axios"
import { cookies } from 'next/headers'
import { UsersModel } from "@/model/UsersModel"
import { verifyUserServerSide } from "../action"

async function getCustomers(): Promise<any> {
    const cookie = cookies().get('palugada-auth-token')?.value
    const USER_BASE_URL = process.env.USER_BASE_URL || ''
    if (!USER_BASE_URL) throw new Error('USER_BASE_URL is not defined')
    const user = axios.create({
        baseURL: USER_BASE_URL,
        headers: {
            'Cookie': `palugada-auth-token=${cookie}`
        }
    })

    return await user.get('/customers')
        .then((response) => response.data.data as AdminModel[])
        .catch((error) => {
            console.error('Error getting Administrator data', error.response?.data);
            return [] as AdminModel[]
        });
}

export default async function DemoPage() {
    const user: UsersModel | undefined | null = await verifyUserServerSide()

    if (!user || user?.role?.toUpperCase() !== "SUPER_ADMIN") return (
        < UnauthorizedPage message="401 | You are not authorized to view this page" ctaLabel="Go To Dashboard Home" redirectTo="/admin" />
    )
    const data: AdminModel[] = await getCustomers()

    return (
        <main className="p-5 pb-[130px] sm:pb-2">
            <div className="flex flex-row justify-between items-center mt-4 sm:mt-0 gap-4">
                <h1 className="text-md font-semibold sm:text-xl ">Customers Overview</h1>
            </div>
            <div className="container mx-auto py-10 px-0">
                <DataTable columns={columns} data={data} />
            </div>
        </main>
    )
}
