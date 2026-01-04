import { cn } from "@/lib/utils"

export function PageContainer({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("container mx-auto px-4 py-6 max-w-lg md:max-w-2xl min-h-[calc(100vh-4rem-3rem)]", className)} {...props}>
            {children}
        </div>
    )
}
