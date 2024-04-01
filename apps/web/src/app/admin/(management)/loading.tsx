import { Skeleton } from "@/components/ui/skeleton";

export default function AdminManagementLoading() {
    return (
        <div className="flex flex-col justify-center h-96 w-full p-4 md:p-8 gap-6">
            <div className="flex justify-between gap-4 w-full">
                <Skeleton className=" h-10 w-full max-w-[300px]" />
                <Skeleton className=" h-10 w-full max-w-[160px]" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    )
}