import BottomMenu from '@/components/admin/ui/bottom-menu';
import Sidebar from '@/components/admin/ui/sidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed grid grid-cols-7 w-screen h-screen">
        <div className="hidden md:col-span-2 xl:col-span-1 md:flex flex-col p-4 border-r-[1px] border-purple-200">
          <Sidebar />
        </div>
        <div className="col-span-7 md:col-span-5 xl:col-span-6 overflow-auto max-h-screen sm:p-8">
          {children}
        </div>
      </div>
      <div className="flex flex-row gap-3 justify-between items-center bg-white p-2 h-[60px] border-t-2 border-purple-100 w-full fixed bottom-0 md:hidden overflow-auto">
        <BottomMenu />
      </div>
    </>
  );
}
