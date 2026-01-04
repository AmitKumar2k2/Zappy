import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
    steps: { label: string; description?: string }[];
    currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between relative">
                {/* Connector Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10" />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 -z-10"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isLocked = index > currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-colors z-0",
                                    isCompleted && "border-primary bg-primary text-white",
                                    isCurrent && "border-primary text-primary",
                                    isLocked && "border-gray-300 text-gray-300"
                                )}
                            >
                                {isCompleted ? <Check className="h-5 w-5" /> : (
                                    isLocked ? <Lock className="h-4 w-4" /> : <span className="text-sm font-semibold">{index + 1}</span>
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <span className={cn("block text-xs font-semibold", isCurrent ? "text-primary" : "text-gray-500")}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
