'use client';
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface PhotoUploaderProps {
    onFileSelect: (file: File, base64: string) => void;
    currentImage?: string | null;
    label?: string;
    required?: boolean;
}

export function PhotoUploader({ onFileSelect, currentImage, label = "Upload Photo", required }: PhotoUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    useEffect(() => {
        if (currentImage) setPreview(currentImage);
    }, [currentImage]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onFileSelect(file, base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        // TODO: Notify parent to clear?
        // Since props `onFileSelect` expects a file, clearing logic might need a separate callback or logic.
        // For now, check-in flow mandates a photo, so clearing might just be for retrying.
        // If we need to clear state in parent, we might need onClear prop. Assuming this is just "change photo".
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none pb-1 block">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {preview ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-md"
                        onClick={clearImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                    role="button"
                    tabIndex={0}
                >
                    <Camera className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">Tap to capture or upload</span>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFile}
                        capture="environment" // Hints mobile to use rear camera
                    />
                </div>
            )}
        </div>
    );
}
