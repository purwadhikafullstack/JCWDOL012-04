import { cn } from "@/lib/utils"

export default function Spinner({ className }: { className?: string }) {
    return (
        <div
            className={cn(`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-[var(--primaryColor)] motion-reduce:animate-[spin_1.5s_linear_infinite]`, className)}
            role="status">
        </div>
    )
}