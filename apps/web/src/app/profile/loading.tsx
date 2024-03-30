import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            <div className="max-w-screen-sm flex flex-col gap-3 mx-auto mt-6 px-4 md:px-0">
                <Skeleton className="rounded-sm h-10 w-full" />
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between h-60 gap-3">
                    <Skeleton className="h-14 w-[248px]" />
                    <Skeleton className="rounded-full h-40 w-40" />
                </div>
                <Skeleton className="rounded-sm h-9 w-full" />
                <Skeleton className="rounded-sm h-9 w-full" />
                <Skeleton className="rounded-sm h-9 w-full" />
                <Skeleton className="rounded-sm h-9 w-full" />
            </div>
        </>
    )
}