import SalesReport from '@/components/admin/report/SalesReport';

export default function DashboardHome({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="pb-[120px]">
      <div className="flex flex-col justify-center text-center">
        <h1 className="text-4xl text-center p-2">Welcome to Admin Dashboard</h1>
        <SalesReport searchParams={searchParams} />
      </div>
    </main>
  );
}
