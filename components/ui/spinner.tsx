import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export const Spinner = ({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12"
    }

    return <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
}
