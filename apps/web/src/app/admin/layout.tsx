import BottomMenu from "@/components/admin/ui/bottom-menu";
import Sidebar from "@/components/admin/ui/sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <div className="fixed grid grid-cols-6 w-screen h-screen">
                <div className="hidden sm:col-span-1 sm:flex flex-col p-8 border-r-2 border-purple-200">
                    <Sidebar />
                </div>
                <div className="col-span-6 sm:col-span-5 overflow-auto max-h-screen sm:p-8">
                    {children}
                </div>
            </div>
            <div className="flex flex-row gap-3 justify-between items-center bg-white p-2 h-[60px] border-t-2 border-purple-100 w-full fixed bottom-0 sm:hidden overflow-auto">
                <BottomMenu />
            </div>
        </>
    )
}