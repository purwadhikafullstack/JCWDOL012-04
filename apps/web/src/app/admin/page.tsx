'use client';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { Loading } from '@/components/Loading';
import SalesReport from '@/components/admin/report/SalesReport';

export default function DashboardHome({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const auth = useAuth();
  const isAuthenticated = auth?.user.isAuthenticated;
  const role = auth?.user.data?.role;
  const username = auth?.user.data?.firstName;
  const isAuthLoading = auth?.isLoading;
  const adminWarehouseId = auth?.user.data?.wareHouseAdmin_warehouseId;
  if (isAuthLoading) return <Loading />;
  if (!isAuthenticated || role === 'CUSTOMER')
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );
  return (
    <main className="pb-[120px]">
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl p-2 ml-10 font-medium">Welcome {username}</h1>
        <SalesReport
          searchParams={searchParams}
          role={role}
          adminWarehouseId={adminWarehouseId}
        />
      </div>
    </main>
  );
}
