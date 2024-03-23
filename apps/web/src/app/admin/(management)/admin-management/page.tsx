import { columns } from "./(components)/columns"
import { DataTable } from "./(components)/data-table"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'

const cookie = cookies().get('palugada-auth-token')?.value
const USER_BASE_URL = process.env.USER_BASE_URL

const user = axios.create({
    baseURL: USER_BASE_URL,
    headers: {
        'Cookie': `palugada-auth-token=${cookie}`
    }
})

async function getAdmins(): Promise<any> {
    return await user.get('/admin')
        .then((response) => response.data.data as AdminModel[])
        .catch((error) => {
            console.error('Error getting Administrator data', error);
        });
}

export default async function DemoPage() {
    const data: AdminModel[] = await getAdmins()

    return (
        <main className="p-5 pb-[130px] sm:pb-2">
            <div className="flex flex-row justify-between items-center mt-4 sm:mt-0 gap-4 flex-wrap">
                <h1 className="text-md font-semibold sm:text-xl ">Administrator Management</h1>
                <Button className="text-xs sm:text-sm">+ New Admin</Button>
            </div>
            <div className="container mx-auto py-10 px-0">
                <DataTable columns={columns} data={data} />
            </div>
        </main>
    )
}
